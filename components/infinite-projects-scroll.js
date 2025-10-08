/**
 * Infinite Projects Scroll Implementation
 * Handles infinite scrolling, loading states, and integration with existing filter system
 */
class InfiniteProjectsScroll {
    constructor() {
        // Core elements
        this.projectsGrid = document.getElementById('projectsGrid');
        this.loadingIndicator = document.getElementById('infiniteScrollLoading');
        this.skeletonCards = document.getElementById('skeletonCards');
        this.errorState = document.getElementById('infiniteScrollError');
        this.endOfContent = document.getElementById('endOfContent');
        this.scrollTrigger = document.getElementById('scrollTrigger');
        this.liveRegion = document.getElementById('projectsLiveRegion');
        this.retryButton = document.getElementById('retryLoadMore');
        this.viewCategoriesButton = document.getElementById('viewCategories');
        this.noResults = document.getElementById('noResults');

        // Data manager
        this.dataManager = null;
        this.isInitialized = false;

        // Intersection Observer
        this.observer = null;
        this.observerOptions = {
            root: null,
            rootMargin: '200px',
            threshold: 0.1
        };

        // State management
        this.isLoading = false;
        this.hasError = false;
        this.isEndOfContent = false;
        this.currentFilter = 'all';
        this.currentSearch = '';

        // Performance tracking
        this.loadStartTime = null;
        this.loadCount = 0;

        // Initialize
        this.init();
    }

    /**
     * Initialize the infinite scroll system
     */
    async init() {
        try {
            // Initialize data manager
            this.dataManager = new ProjectsDataManager();
            await this.dataManager.loadData();

            // Setup intersection observer
            this.setupIntersectionObserver();

            // Setup event listeners
            this.setupEventListeners();

            // Integrate with existing filter system
            this.integrateWithExistingFilters();

            // Load initial projects if grid is empty (for clean implementation)
            if (this.shouldLoadInitialProjects()) {
                await this.loadInitialProjects();
            }

            this.isInitialized = true;
            console.log('Infinite Projects Scroll initialized successfully');
        } catch (error) {
            console.error('Failed to initialize infinite scroll:', error);
            this.showError();
        }
    }

    /**
     * Check if we should load initial projects
     */
    shouldLoadInitialProjects() {
        // Only load if we're in a development environment or specifically requested
        // In production, projects are already loaded in HTML
        return window.location.search.includes('infinite-scroll-mode') || 
               this.projectsGrid.children.length === 0;
    }

    /**
     * Load initial batch of projects
     */
    async loadInitialProjects() {
        try {
            this.showSkeletonCards();
            const initialProjects = this.dataManager.getInitialProjects();
            await this.renderProjects(initialProjects, true);
            this.hideAllLoadingStates();
            this.announceToScreenReader(`Loaded ${initialProjects.length} projects initially`);
        } catch (error) {
            console.error('Failed to load initial projects:', error);
            this.showError();
        }
    }

    /**
     * Setup intersection observer for scroll detection
     */
    setupIntersectionObserver() {
        if (!this.scrollTrigger) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading && !this.isEndOfContent && !this.hasError) {
                    this.loadMoreProjects();
                }
            });
        }, this.observerOptions);

        this.observer.observe(this.scrollTrigger);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Retry button
        if (this.retryButton) {
            this.retryButton.addEventListener('click', () => {
                this.hideError();
                this.loadMoreProjects();
            });
        }

        // View categories button
        if (this.viewCategoriesButton) {
            this.viewCategoriesButton.addEventListener('click', () => {
                // Scroll to filters
                const filtersSection = document.querySelector('.projects-filters');
                if (filtersSection) {
                    filtersSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // Listen for filter changes
        document.addEventListener('projectsFiltered', (event) => {
            this.handleFilterChange(event.detail);
        });

        // Listen for search changes
        document.addEventListener('projectsSearched', (event) => {
            this.handleSearchChange(event.detail);
        });
    }

    /**
     * Integrate with existing filter system
     */
    integrateWithExistingFilters() {
        // Override the existing filterProjects function to work with infinite scroll
        if (typeof window.filterProjects === 'function') {
            const originalFilterProjects = window.filterProjects;
            
            window.filterProjects = (category, searchTerm) => {
                // Call original function for immediate UI updates
                originalFilterProjects(category, searchTerm);
                
                // Handle infinite scroll state
                if (this.isInitialized) {
                    this.handleFilterChange({ category, searchTerm });
                }
            };
        }
    }

    /**
     * Handle filter changes
     */
    async handleFilterChange(filterData) {
        const { category = 'all', searchTerm = '' } = filterData;
        
        this.currentFilter = category;
        this.currentSearch = searchTerm;
        
        // Reset infinite scroll state
        this.resetInfiniteScrollState();
        
        // Let the existing filter function handle the display
        // We just need to ensure infinite scroll is ready for the filtered results
        if (this.dataManager) {
            const filteredProjects = this.dataManager.filterProjects(category, searchTerm);
            const hasResults = filteredProjects.length > 0;
            
            if (hasResults && this.dataManager.hasMore()) {
                this.showScrollTrigger();
            } else {
                this.hideScrollTrigger();
            }
        }
    }

    /**
     * Handle search changes
     */
    handleSearchChange(searchData) {
        this.handleFilterChange({ 
            category: this.currentFilter, 
            searchTerm: searchData.searchTerm 
        });
    }

    /**
     * Load more projects via infinite scroll
     */
    async loadMoreProjects() {
        if (this.isLoading || this.isEndOfContent || this.hasError) return;

        try {
            this.loadStartTime = performance.now();
            this.isLoading = true;
            this.showLoadingIndicator();

            const nextBatch = await this.dataManager.getNextBatch();
            
            if (nextBatch.length === 0) {
                this.handleEndOfContent();
                return;
            }

            await this.renderProjects(nextBatch);
            this.hideLoadingIndicator();
            
            // Check if more content is available
            if (!this.dataManager.hasMore()) {
                this.handleEndOfContent();
            }

            // Performance tracking
            const loadTime = performance.now() - this.loadStartTime;
            this.loadCount++;
            console.log(`Loaded batch ${this.loadCount} in ${loadTime.toFixed(2)}ms`);

            // Announce to screen readers
            this.announceToScreenReader(`Loaded ${nextBatch.length} more projects`);

        } catch (error) {
            console.error('Failed to load more projects:', error);
            this.showError();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Render projects to the grid
     */
    async renderProjects(projects, clearExisting = false) {
        if (!this.projectsGrid || !projects.length) return;

        if (clearExisting) {
            this.projectsGrid.innerHTML = '';
        }

        // Create document fragment for batch DOM updates
        const fragment = document.createDocumentFragment();
        
        projects.forEach(project => {
            const projectElement = this.createProjectCard(project);
            fragment.appendChild(projectElement);
        });

        this.projectsGrid.appendChild(fragment);

        // Setup lazy loading for new images
        this.setupLazyLoading();

        // Animate in new cards
        this.animateNewCards();
    }

    /**
     * Create a project card element
     */
    createProjectCard(project) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'project-card';
        cardDiv.setAttribute('data-category', project.category);
        cardDiv.setAttribute('data-id', project.id);
        cardDiv.innerHTML = this.dataManager.generateProjectCard(project);
        return cardDiv.firstElementChild;
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            const lazyImages = this.projectsGrid.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            const lazyImages = this.projectsGrid.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Animate new cards into view
     */
    animateNewCards() {
        if (typeof anime === 'undefined') return;

        const newCards = this.projectsGrid.querySelectorAll('.project-card:not(.animated)');
        
        // Mark cards as animated to avoid duplicate animations
        newCards.forEach(card => card.classList.add('animated'));

        // Animate cards in
        anime({
            targets: newCards,
            translateY: [30, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutQuart'
        });
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        this.hideAllLoadingStates();
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'flex';
        }
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    /**
     * Show skeleton cards
     */
    showSkeletonCards() {
        this.hideAllLoadingStates();
        if (this.skeletonCards) {
            const skeletonGrid = this.skeletonCards.querySelector('.skeleton-grid');
            if (skeletonGrid) {
                skeletonGrid.innerHTML = this.dataManager.generateSkeletonCards(8);
            }
            this.skeletonCards.style.display = 'block';
        }
    }

    /**
     * Show error state
     */
    showError() {
        this.hideAllLoadingStates();
        this.hasError = true;
        if (this.errorState) {
            this.errorState.style.display = 'flex';
        }
        this.announceToScreenReader('Failed to load projects. Please try again.');
    }

    /**
     * Hide error state
     */
    hideError() {
        this.hasError = false;
        if (this.errorState) {
            this.errorState.style.display = 'none';
        }
    }

    /**
     * Handle end of content
     */
    handleEndOfContent() {
        this.hideAllLoadingStates();
        this.isEndOfContent = true;
        this.hideScrollTrigger();
        
        if (this.endOfContent) {
            this.endOfContent.style.display = 'flex';
        }
        
        this.announceToScreenReader('All projects have been loaded');
    }

    /**
     * Hide all loading states
     */
    hideAllLoadingStates() {
        const states = [this.loadingIndicator, this.skeletonCards, this.errorState, this.endOfContent];
        states.forEach(state => {
            if (state) state.style.display = 'none';
        });
    }

    /**
     * Show scroll trigger
     */
    showScrollTrigger() {
        if (this.scrollTrigger && this.observer) {
            this.scrollTrigger.style.visibility = 'hidden';
            this.observer.observe(this.scrollTrigger);
        }
    }

    /**
     * Hide scroll trigger
     */
    hideScrollTrigger() {
        if (this.scrollTrigger && this.observer) {
            this.observer.unobserve(this.scrollTrigger);
        }
    }

    /**
     * Reset infinite scroll state
     */
    resetInfiniteScrollState() {
        this.isLoading = false;
        this.hasError = false;
        this.isEndOfContent = false;
        this.hideAllLoadingStates();
        this.showScrollTrigger();
    }

    /**
     * Announce updates to screen readers
     */
    announceToScreenReader(message) {
        if (this.liveRegion && message) {
            this.liveRegion.textContent = message;
            
            // Clear the message after a delay so repeated announcements work
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Get current statistics
     */
    getStatistics() {
        if (!this.dataManager) return null;
        
        return {
            ...this.dataManager.getStatistics(),
            loadCount: this.loadCount,
            isLoading: this.isLoading,
            hasError: this.hasError,
            isEndOfContent: this.isEndOfContent
        };
    }

    /**
     * Destroy the infinite scroll instance
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove event listeners
        if (this.retryButton) {
            this.retryButton.removeEventListener('click', this.loadMoreProjects);
        }
        
        if (this.viewCategoriesButton) {
            this.viewCategoriesButton.removeEventListener('click', this.scrollToFilters);
        }

        console.log('Infinite Projects Scroll destroyed');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the projects page
    if (document.getElementById('projectsGrid') && typeof ProjectsDataManager !== 'undefined') {
        window.infiniteProjectsScroll = new InfiniteProjectsScroll();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniteProjectsScroll;
}

// Global assignment for browser usage
if (typeof window !== 'undefined') {
    window.InfiniteProjectsScroll = InfiniteProjectsScroll;
}