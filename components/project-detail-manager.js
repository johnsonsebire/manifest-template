/**
 * Project Detail Manager
 * Handles dynamic content loading for individual project detail pages
 * Integrates with projects data and URL parameters
 */
class ProjectDetailManager {
    constructor() {
        this.projectId = null;
        this.projectData = null;
        this.isLoading = false;
        this.hasError = false;
        
        // Data source - same structure as projects-data-manager.js
        this.allProjects = null;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the project detail manager
     */
    async init() {
        try {
            // Get project ID from URL parameters
            this.projectId = this.getProjectIdFromUrl();
            
            if (!this.projectId) {
                this.handleError('No project ID provided', 'MISSING_ID');
                return;
            }

            // Load project data
            await this.loadProjectData();
            
            // Populate page content
            if (this.projectData) {
                this.populatePageContent();
                this.updatePageMeta();
                this.setupEventListeners();
            } else {
                this.handleError('Project not found', 'PROJECT_NOT_FOUND');
            }
            
        } catch (error) {
            console.error('Failed to initialize project detail manager:', error);
            this.handleError('Failed to load project details', 'INITIALIZATION_ERROR');
        }
    }

    /**
     * Get project ID from URL parameters
     */
    getProjectIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        // Convert to number if it's a valid number
        if (id && !isNaN(id)) {
            return parseInt(id, 10);
        }
        
        return null;
    }

    /**
     * Load project data from embedded dataset
     */
    async loadProjectData() {
        this.isLoading = true;
        
        try {
            // Use embedded data from projects-data-manager structure
            if (!this.allProjects) {
                this.allProjects = await this.getProjectsData();
            }
            
            // Find project by ID
            this.projectData = this.allProjects.find(project => project.id === this.projectId);
            
            if (!this.projectData) {
                throw new Error(`Project with ID ${this.projectId} not found`);
            }
            
        } catch (error) {
            console.error('Failed to load project data:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get projects data (embedded to avoid CORS issues)
     */
    async getProjectsData() {
        // Embedded project data - expanded dataset with detail information
        const projects = [
            {
                "id": 1,
                "title": "My Help Your Help Foundation",
                "category": "nonprofit",
                "subcategory": "nonprofit",
                "displayCategory": "Nonprofit",
                "image": "images/projects/myhelpyourhelp.png",
                "url": "https://myhelpyourhelp.org",
                "featured": true,
                "order": 1,
                "detailData": {
                    "tagline": "Empowering communities through digital transformation and innovative outreach programs.",
                    "client": "My Help Your Help Foundation",
                    "industry": "Nonprofit / Community Service",
                    "timeline": "16 Weeks",
                    "teamSize": "8 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A comprehensive digital platform connecting volunteers with community needs across Ghana.",
                    "challenge": "The foundation needed a modern platform to coordinate volunteers, track community impact, and streamline donation processes.",
                    "solution": "We built a custom web platform with volunteer management, impact tracking, and integrated payment systems.",
                    "results": ["300% increase in volunteer registrations", "150% growth in monthly donations", "Streamlined program coordination", "Enhanced community engagement"]
                }
            },
            {
                "id": 2,
                "title": "L-Time Properties",
                "category": "business",
                "subcategory": "real_estate",
                "displayCategory": "Real Estate",
                "image": "images/ltimeproperties.png",
                "url": "https://ltimepropertiesltd.com",
                "featured": true,
                "order": 2,
                "detailData": {
                    "tagline": "Revolutionizing Ghana's real estate market with innovative property management solutions.",
                    "client": "L-Time Properties Ltd",
                    "industry": "Real Estate / Property Management",
                    "timeline": "20 Weeks",
                    "teamSize": "10 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A comprehensive real estate platform featuring property listings, virtual tours, and client management.",
                    "challenge": "Traditional real estate processes were inefficient, with limited online presence and manual property management.",
                    "solution": "We developed a full-featured real estate platform with virtual tours, CRM integration, and automated workflows.",
                    "results": ["400% increase in online inquiries", "Reduced property viewing time by 60%", "Streamlined client management", "Enhanced market visibility"]
                }
            },
            {
                "id": 3,
                "title": "Koko Plus Foundation",
                "category": "nonprofit",
                "subcategory": "nonprofit",
                "displayCategory": "Nonprofit",
                "image": "images/kokoplus.png",
                "url": "https://kokoplusfoundation.org",
                "featured": true,
                "order": 3,
                "detailData": {
                    "tagline": "Transforming coconut commerce through sustainable farming and fair trade practices.",
                    "client": "Koko Plus Foundation",
                    "industry": "Nonprofit / Agriculture", 
                    "timeline": "12 Weeks",
                    "teamSize": "6 Members",
                    "logo": "images/logos/logo.png",
                    "description": "An e-commerce platform promoting sustainable coconut farming and connecting farmers directly with consumers.",
                    "challenge": "Coconut farmers lacked direct market access and consumers couldn't trace product origins or support sustainable practices.",
                    "solution": "We created an e-commerce platform with farmer profiles, product traceability, and fair trade certification integration.",
                    "results": ["250% increase in farmer income", "Direct consumer-farmer connections", "Sustainable farming promotion", "Enhanced supply chain transparency"]
                }
            },
            {
                "id": 4,
                "title": "Good News Library",
                "category": "education",
                "subcategory": "education",
                "displayCategory": "Education",
                "image": "images/goodnewslibrary.png",
                "url": "https://goodnewslibrary.com",
                "featured": true,
                "order": 4,
                "detailData": {
                    "tagline": "Democratizing access to quality educational resources across Ghana's rural communities.",
                    "client": "Good News Library Foundation",
                    "industry": "Education / Digital Libraries",
                    "timeline": "14 Weeks",
                    "teamSize": "7 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A digital library platform providing free access to educational content, research materials, and learning resources.",
                    "challenge": "Limited access to quality educational materials in rural areas, with expensive textbooks and outdated library systems.",
                    "solution": "We developed a comprehensive digital library with offline access, mobile optimization, and community features.",
                    "results": ["10,000+ active users monthly", "500+ educational resources added", "75% improvement in student performance", "Extended reach to 50+ rural communities"]
                }
            },
            {
                "id": 5,
                "title": "Barjul Travels",
                "category": "business",
                "subcategory": "travel_tourism",
                "displayCategory": "Travel & Tourism",
                "image": "images/projects/barjultravels.png",
                "url": "https://barjultravels.com",
                "featured": false,
                "order": 5,
                "detailData": {
                    "tagline": "Connecting travelers with authentic African experiences through innovative booking solutions.",
                    "client": "Barjul Travels & Tours",
                    "industry": "Travel & Tourism",
                    "timeline": "10 Weeks",
                    "teamSize": "5 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A modern travel booking platform showcasing Ghana's tourism destinations and cultural experiences.",
                    "challenge": "Local travel agencies lacked online presence and booking systems, missing digital-savvy travelers.",
                    "solution": "We built a comprehensive travel platform with booking integration, destination guides, and payment processing.",
                    "results": ["200% increase in bookings", "Expanded to 3 West African countries", "Enhanced customer experience", "Digital transformation success"]
                }
            },
            {
                "id": 6,
                "title": "YOVI Ghana",
                "category": "nonprofit",
                "subcategory": "nonprofit",
                "displayCategory": "Nonprofit",
                "image": "images/projects/yovighana.png",
                "url": "https://yovighana.org",
                "featured": false,
                "order": 6,
                "detailData": {
                    "tagline": "Empowering youth through skills development and vocational training programs.",
                    "client": "Youth Opportunities and Vocational Institute",
                    "industry": "Nonprofit / Youth Development",
                    "timeline": "18 Weeks",
                    "teamSize": "9 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A comprehensive platform for youth skills training, mentorship, and career development.",
                    "challenge": "Youth unemployment was high due to lack of marketable skills and career guidance resources.",
                    "solution": "We created a digital platform with course management, mentorship matching, and career tracking.",
                    "results": ["85% job placement rate", "500+ youth trained annually", "50+ industry partnerships", "Sustainable skills development"]
                }
            },
            {
                "id": 7,
                "title": "Yensoft Ghana",
                "category": "tech",
                "subcategory": "technology",
                "displayCategory": "Technology",
                "image": "images/projects/yensoftgh.png",
                "url": "https://yensoftgh.com",
                "featured": false,
                "order": 7,
                "detailData": {
                    "tagline": "Innovative software solutions driving digital transformation across West Africa.",
                    "client": "Yensoft Technologies",
                    "industry": "Technology / Software Development",
                    "timeline": "24 Weeks",
                    "teamSize": "12 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A technology company website showcasing software products and development services.",
                    "challenge": "Needed a professional web presence to attract clients and showcase technical capabilities.",
                    "solution": "We developed a modern tech website with portfolio showcases, service catalogs, and client portals.",
                    "results": ["300% increase in leads", "Enhanced brand credibility", "Streamlined client onboarding", "International market expansion"]
                }
            },
            {
                "id": 8,
                "title": "VAMG Research Institute",
                "category": "education",
                "subcategory": "education",
                "displayCategory": "Education",
                "image": "images/projects/vamg.png",
                "url": "https://vamgresearchinstitute.org",
                "featured": false,
                "order": 8,
                "detailData": {
                    "tagline": "Advancing agricultural research through digital collaboration and knowledge sharing.",
                    "client": "VAMG Research Institute",
                    "industry": "Education / Agricultural Research",
                    "timeline": "16 Weeks",
                    "teamSize": "8 Members",
                    "logo": "images/logos/logo.png",
                    "description": "A research platform facilitating collaboration, publication, and knowledge sharing in agriculture.",
                    "challenge": "Researchers lacked centralized platforms for collaboration and publication of agricultural findings.",
                    "solution": "We built a comprehensive research platform with collaboration tools, publication systems, and data sharing.",
                    "results": ["200+ research papers published", "Enhanced researcher collaboration", "Improved knowledge dissemination", "International research partnerships"]
                }
            },
            // Add more projects as needed...
            {
                "id": 20,
                "title": "Samak Technology",
                "category": "tech",
                "subcategory": "technology",
                "displayCategory": "Technology",
                "image": "images/projects/samaktechnology.png",
                "url": "https://samaktechnology.com",
                "featured": false,
                "order": 20,
                "detailData": {
                    "tagline": "Cutting-edge technology solutions for enterprise digital transformation.",
                    "client": "Samak Technology Solutions",
                    "industry": "Technology / Enterprise Solutions",
                    "timeline": "28 Weeks",
                    "teamSize": "15 Members",
                    "logo": "images/logos/logo.png",
                    "description": "An enterprise technology platform providing custom software solutions and IT consulting.",
                    "challenge": "Enterprises needed scalable technology solutions but lacked access to skilled development teams.",
                    "solution": "We created a comprehensive service platform with project management, client portals, and solution catalogs.",
                    "results": ["500% revenue growth", "50+ enterprise clients", "Expanded to 5 countries", "Industry recognition awards"]
                }
            }
        ];
        
        return projects;
    }    /**
     * Populate page content with project data
     */
    populatePageContent() {
        if (!this.projectData || !this.projectData.detailData) {
            this.handleError('Project detail data not available', 'MISSING_DETAIL_DATA');
            return;
        }

        const detail = this.projectData.detailData;
        
        // Update hero section
        this.updateHeroSection(detail);
        
        // Update featured image
        this.updateFeaturedImage();
        
        // Update project overview (if elements exist)
        this.updateProjectOverview(detail);
        
        // Update breadcrumb
        this.updateBreadcrumb();
        
        // Add fade-in animation
        this.animateContentEntry();
    }

    /**
     * Update hero section content
     */
    updateHeroSection(detail) {
        // Update client logo
        const clientLogo = document.querySelector('.client-logo');
        if (clientLogo && detail.logo) {
            clientLogo.src = detail.logo;
            clientLogo.alt = `${this.projectData.title} Logo`;
        }

        // Update category
        const categoryElement = document.querySelector('.project-category');
        if (categoryElement) {
            categoryElement.textContent = this.projectData.displayCategory;
        }

        // Update title
        const titleElement = document.querySelector('.project-hero h1');
        if (titleElement) {
            titleElement.textContent = this.projectData.title;
        }

        // Update tagline
        const taglineElement = document.querySelector('.project-tagline');
        if (taglineElement) {
            taglineElement.textContent = detail.tagline;
        }

        // Update meta information
        this.updateMetaItems(detail);
    }

    /**
     * Update meta items in hero section
     */
    updateMetaItems(detail) {
        const metaItems = document.querySelectorAll('.meta-item');
        
        const metaData = [
            { label: 'Client', value: detail.client },
            { label: 'Industry', value: detail.industry },
            { label: 'Timeline', value: detail.timeline },
            { label: 'Team Size', value: detail.teamSize }
        ];

        metaItems.forEach((item, index) => {
            if (metaData[index]) {
                const labelElement = item.querySelector('.meta-label');
                const valueElement = item.querySelector('.meta-value');
                
                if (labelElement) labelElement.textContent = metaData[index].label;
                if (valueElement) valueElement.textContent = metaData[index].value;
            }
        });
    }

    /**
     * Update featured image
     */
    updateFeaturedImage() {
        const featuredImage = document.querySelector('.featured-image');
        if (featuredImage) {
            featuredImage.src = this.projectData.image;
            featuredImage.alt = `${this.projectData.title} Platform`;
        }
    }

    /**
     * Update project overview section
     */
    updateProjectOverview(detail) {
        // This would update additional sections like challenge, solution, results
        // Based on the existing HTML structure in project-detail.html
        
        // Update description if element exists
        const descriptionElement = document.querySelector('.project-description');
        if (descriptionElement && detail.description) {
            descriptionElement.textContent = detail.description;
        }
    }

    /**
     * Update breadcrumb
     */
    updateBreadcrumb() {
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = this.projectData.title;
        }
    }

    /**
     * Update page meta tags and title
     */
    updatePageMeta() {
        const detail = this.projectData.detailData;
        
        // Update page title
        document.title = `${this.projectData.title} | Case Study | Manifest Digital`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && detail.tagline) {
            metaDescription.setAttribute('content', detail.tagline);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${this.projectData.title} | Case Study`);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && detail.tagline) {
            ogDescription.setAttribute('content', detail.tagline);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            const imageUrl = `${window.location.origin}/${this.projectData.image}`;
            ogImage.setAttribute('content', imageUrl);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Add any interactive functionality here
        // For example, external link tracking, image galleries, etc.
        
        // Track page view
        this.trackProjectView();
    }

    /**
     * Animate content entry
     */
    animateContentEntry() {
        // Fade in content sections with Anime.js
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.project-hero-content',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                easing: 'easeOutCubic'
            });

            anime({
                targets: '.featured-image',
                opacity: [0, 1],
                scale: [0.95, 1],
                duration: 1000,
                delay: 200,
                easing: 'easeOutCubic'
            });
        }
    }

    /**
     * Handle errors
     */
    handleError(message, errorType) {
        this.hasError = true;
        console.error(`ProjectDetailManager Error (${errorType}):`, message);
        
        // Show error message to user
        this.showErrorMessage(message, errorType);
        
        // Track error for analytics
        this.trackError(errorType, message);
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message, errorType) {
        // Create error message element
        const errorContainer = document.createElement('div');
        errorContainer.className = 'project-detail-error';
        errorContainer.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Project Not Found</h2>
                <p>${message}</p>
                <div class="error-actions">
                    <a href="projects.html" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Back to Projects
                    </a>
                    <button onclick="window.location.reload()" class="btn btn-outline-primary">
                        <i class="fas fa-refresh"></i>
                        Try Again
                    </button>
                </div>
            </div>
        `;

        // Add error styles
        errorContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            text-align: center;
        `;

        document.body.appendChild(errorContainer);
    }

    /**
     * Track project view for analytics
     */
    trackProjectView() {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_view', {
                'project_id': this.projectId,
                'project_title': this.projectData.title,
                'project_category': this.projectData.category
            });
        }

        // Local analytics tracking
        try {
            const viewData = {
                projectId: this.projectId,
                projectTitle: this.projectData.title,
                timestamp: new Date().toISOString(),
                referrer: document.referrer
            };

            const views = JSON.parse(localStorage.getItem('projectViews') || '[]');
            views.push(viewData);
            
            // Keep only last 100 views
            if (views.length > 100) {
                views.splice(0, views.length - 100);
            }
            
            localStorage.setItem('projectViews', JSON.stringify(views));
        } catch (error) {
            console.warn('Failed to track project view locally:', error);
        }
    }

    /**
     * Track errors for analytics
     */
    trackError(errorType, message) {
        // Google Analytics error tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_detail_error', {
                'error_type': errorType,
                'error_message': message,
                'project_id': this.projectId
            });
        }

        // Console tracking for debugging
        console.error('Project Detail Error:', {
            type: errorType,
            message: message,
            projectId: this.projectId,
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Get current project data
     */
    getCurrentProject() {
        return this.projectData;
    }

    /**
     * Check if manager is ready
     */
    isReady() {
        return !this.isLoading && !this.hasError && this.projectData !== null;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.projectDetailManager = new ProjectDetailManager();
});

// Export for external use
window.ProjectDetailManager = ProjectDetailManager;