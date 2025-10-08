/**
 * Project Navigation Handler
 * Manages dual-action navigation for project cards:
 * - Card click -> Project detail page
 * - External link -> Live project website
 */
class ProjectNavigation {
    constructor() {
        this.projectCards = [];
        this.analytics = {
            detailViews: 0,
            externalClicks: 0
        };
        
        this.init();
    }

    /**
     * Initialize project navigation
     */
    init() {
        this.bindProjectCardEvents();
        this.enhanceVisualFeedback();
        this.setupAnalytics();
        
        console.log('Project Navigation initialized');
    }

    /**
     * Bind click events to project cards
     */
    bindProjectCardEvents() {
        // Use event delegation for better performance with infinite scroll
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (!projectCard) return;

            // Check if click is on external link or its children
            const externalLink = e.target.closest('.project-link');
            if (externalLink) {
                this.handleExternalLinkClick(externalLink, projectCard);
                return;
            }

            // Handle project card click (excluding external link area)
            this.handleProjectCardClick(projectCard, e);
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const projectCard = e.target.closest('.project-card[tabindex]');
                if (projectCard && e.key === 'Enter') {
                    e.preventDefault();
                    this.handleProjectCardClick(projectCard, e);
                }
            }
        });
    }

    /**
     * Handle project card click (navigate to detail page)
     */
    handleProjectCardClick(projectCard, event) {
        const projectId = projectCard.getAttribute('data-id');
        const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
        
        if (!projectId) {
            console.warn('Project card missing data-id attribute:', projectCard);
            return;
        }

        // Track analytics
        this.trackDetailView(projectId, projectTitle);

        // Navigate to project detail page
        const detailUrl = `project-detail.html?id=${projectId}`;
        
        // Check for modifier keys for new tab behavior
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            window.open(detailUrl, '_blank');
        } else {
            window.location.href = detailUrl;
        }
    }

    /**
     * Handle external link click
     */
    handleExternalLinkClick(linkElement, projectCard) {
        const projectId = projectCard.getAttribute('data-id');
        const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
        const externalUrl = linkElement.getAttribute('href');

        // Track analytics
        this.trackExternalClick(projectId, projectTitle, externalUrl);

        // Let the browser handle the navigation naturally
        // (link already has target="_blank")
    }

    /**
     * Enhance visual feedback for interactive elements
     */
    enhanceVisualFeedback() {
        // Add styles for project card hover and focus states
        const style = document.createElement('style');
        style.textContent = `
            /* Project Card Interactive Styles */
            .project-card {
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                outline: none;
            }
            
            .project-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
            }
            
            .project-card:focus-visible {
                outline: 3px solid #ff2200;
                outline-offset: 2px;
            }
            
            .project-card:active {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
            }
            
            /* Enhance project link button to indicate it's separate */
            .project-card .project-link {
                position: relative;
                z-index: 2;
                pointer-events: all;
            }
            
            .project-card .project-link:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(255, 34, 0, 0.3);
            }
            
            /* Add subtle indicator for clickable card */
            .project-card::after {
                content: '';
                position: absolute;
                top: 16px;
                right: 16px;
                width: 24px;
                height: 24px;
                background: linear-gradient(135deg, #ff2200, #ff4400);
                border-radius: 50%;
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.3s ease;
                pointer-events: none;
            }
            
            .project-card:hover::after {
                opacity: 0.1;
                transform: scale(1);
            }
            
            /* Mobile touch feedback */
            @media (hover: none) and (pointer: coarse) {
                .project-card:hover {
                    transform: none;
                }
                
                .project-card:active {
                    transform: scale(0.98);
                    transition: transform 0.1s ease;
                }
                
                .project-card::after {
                    display: none;
                }
            }
            
            /* Screen reader text for navigation context */
            .project-card-sr-text {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);

        // Add accessibility attributes to project cards
        this.enhanceAccessibility();
    }

    /**
     * Enhance accessibility for project cards
     */
    enhanceAccessibility() {
        // Use mutation observer to handle dynamically loaded cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const projectCards = node.classList?.contains('project-card') 
                            ? [node] 
                            : node.querySelectorAll?.('.project-card') || [];
                        
                        projectCards.forEach(card => this.enhanceCardAccessibility(card));
                    }
                });
            });
        });

        // Enhance existing cards
        document.querySelectorAll('.project-card').forEach(card => {
            this.enhanceCardAccessibility(card);
        });

        // Observe for new cards (from infinite scroll)
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            observer.observe(projectsGrid, { childList: true, subtree: true });
        }
    }

    /**
     * Enhance individual card accessibility
     */
    enhanceCardAccessibility(card) {
        if (card.hasAttribute('data-nav-enhanced')) return;

        const projectTitle = card.querySelector('h3')?.textContent || 'Project';
        const projectCategory = card.querySelector('.project-category')?.textContent || '';
        
        // Make card focusable
        card.setAttribute('tabindex', '0');
        
        // Add ARIA label
        card.setAttribute('aria-label', `View ${projectTitle} details. ${projectCategory} project.`);
        
        // Add role for better screen reader support
        card.setAttribute('role', 'button');
        
        // Add screen reader text for navigation context
        const srText = document.createElement('span');
        srText.className = 'project-card-sr-text';
        srText.textContent = 'Click to view project details or use the Visit Website button to go to live site';
        card.appendChild(srText);
        
        // Mark as enhanced
        card.setAttribute('data-nav-enhanced', 'true');
    }

    /**
     * Setup analytics tracking
     */
    setupAnalytics() {
        // Initialize Google Analytics if available
        if (typeof gtag !== 'undefined') {
            this.hasGoogleAnalytics = true;
        } else {
            console.log('Google Analytics not detected - using local analytics');
        }
    }

    /**
     * Track project detail view
     */
    trackDetailView(projectId, projectTitle) {
        this.analytics.detailViews++;
        
        const eventData = {
            event_category: 'Project Navigation',
            event_label: `${projectTitle} (ID: ${projectId})`,
            value: 1
        };

        // Google Analytics 4
        if (this.hasGoogleAnalytics) {
            gtag('event', 'project_detail_view', eventData);
        }

        // Custom analytics
        this.logAnalyticsEvent('detail_view', {
            projectId,
            projectTitle,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });

        console.log(`Project detail view tracked: ${projectTitle} (${projectId})`);
    }

    /**
     * Track external link click
     */
    trackExternalClick(projectId, projectTitle, externalUrl) {
        this.analytics.externalClicks++;
        
        const eventData = {
            event_category: 'External Link',
            event_label: `${projectTitle} -> ${externalUrl}`,
            value: 1
        };

        // Google Analytics 4
        if (this.hasGoogleAnalytics) {
            gtag('event', 'external_project_click', eventData);
        }

        // Custom analytics
        this.logAnalyticsEvent('external_click', {
            projectId,
            projectTitle,
            externalUrl,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });

        console.log(`External project click tracked: ${projectTitle} -> ${externalUrl}`);
    }

    /**
     * Log analytics event to local storage (for custom analytics)
     */
    logAnalyticsEvent(eventType, eventData) {
        try {
            const analyticsKey = 'project_navigation_analytics';
            const existingData = JSON.parse(localStorage.getItem(analyticsKey) || '[]');
            
            existingData.push({
                type: eventType,
                data: eventData
            });

            // Keep only last 100 events to prevent storage bloat
            if (existingData.length > 100) {
                existingData.splice(0, existingData.length - 100);
            }

            localStorage.setItem(analyticsKey, JSON.stringify(existingData));
        } catch (error) {
            console.warn('Failed to log analytics event:', error);
        }
    }

    /**
     * Get analytics summary
     */
    getAnalyticsSummary() {
        try {
            const analyticsKey = 'project_navigation_analytics';
            const events = JSON.parse(localStorage.getItem(analyticsKey) || '[]');
            
            const summary = {
                totalEvents: events.length,
                detailViews: events.filter(e => e.type === 'detail_view').length,
                externalClicks: events.filter(e => e.type === 'external_click').length,
                sessionStats: this.analytics,
                recentEvents: events.slice(-10)
            };
            
            return summary;
        } catch (error) {
            console.warn('Failed to get analytics summary:', error);
            return { error: error.message };
        }
    }

    /**
     * Clear analytics data
     */
    clearAnalytics() {
        try {
            localStorage.removeItem('project_navigation_analytics');
            this.analytics = { detailViews: 0, externalClicks: 0 };
            console.log('Analytics data cleared');
        } catch (error) {
            console.warn('Failed to clear analytics:', error);
        }
    }

    /**
     * Destroy navigation handler
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('click', this.handleProjectCardClick);
        document.removeEventListener('keydown', this.handleKeyboardNavigation);
        
        // Remove enhanced accessibility attributes
        document.querySelectorAll('.project-card[data-nav-enhanced]').forEach(card => {
            card.removeAttribute('tabindex');
            card.removeAttribute('aria-label');
            card.removeAttribute('role');
            card.removeAttribute('data-nav-enhanced');
            
            const srText = card.querySelector('.project-card-sr-text');
            if (srText) srText.remove();
        });

        console.log('Project Navigation destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on projects page
    if (document.getElementById('projectsGrid')) {
        window.projectNavigation = new ProjectNavigation();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectNavigation;
}

// Global assignment for browser usage
if (typeof window !== 'undefined') {
    window.ProjectNavigation = ProjectNavigation;
}