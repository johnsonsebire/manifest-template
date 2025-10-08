/**
 * Projects Data Manager
 * Handles project data loading, filtering, and pagination for infinite scroll
 */
class ProjectsDataManager {
    constructor() {
        this.data = null;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreContent = true;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.filteredProjects = [];
        this.loadedProjects = [];
        
        // Initialize data
        this.loadData();
    }

    /**
     * Load projects data (embedded data for file:// protocol compatibility)
     */
    async loadData() {
        try {
            // Use performance optimizer cache if available
            if (window.projectsPerformanceOptimizer?.cache?.data?.has('projects-data')) {
                const cachedData = window.projectsPerformanceOptimizer.cache.data.get('projects-data');
                if (Date.now() - cachedData.timestamp < 30 * 60 * 1000) { // 30 minutes
                    this.data = JSON.parse(cachedData.data);
                    console.log('📦 Loaded projects data from cache');
                    return;
                }
            }

            // Embedded data to avoid CORS issues with file:// protocol
            this.data = {
                "metadata": {
                    "totalProjects": 40,
                    "itemsPerLoad": 8,
                    "initialLoad": 12,
                    "totalPages": 5,
                    "categories": {
                        "all": 40,
                        "nonprofit": 13,
                        "business": 16,
                        "education": 5,
                        "tech": 4,
                        "health": 2
                    },
                    "subcategories": {
                        "nonprofit": 13,
                        "real_estate": 2,
                        "travel_tourism": 2,
                        "technology": 4,
                        "education": 5,
                        "business": 4,
                        "creative_agency": 1,
                        "healthcare": 2,
                        "personal_brand": 2,
                        "e_commerce": 3,
                        "digital_agency": 1,
                        "entertainment": 1
                    }
                },
                "projects": [
                    {
                        "id": 1,
                        "title": "My Help Your Help Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/myhelpyourhelp.png",
                        "url": "https://myhelpyourhelp.org",
                        "featured": true,
                        "order": 1
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
                        "order": 2
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
                        "order": 3
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
                        "order": 4
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
                        "order": 5
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
                        "order": 6
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
                        "order": 7
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
                        "order": 8
                    },
                    {
                        "id": 9,
                        "title": "Trade Growth Network",
                        "category": "business",
                        "subcategory": "business",
                        "displayCategory": "Business",
                        "image": "images/projects/tradegrowth.png",
                        "url": "https://tradegrowthnetwork.org",
                        "featured": false,
                        "order": 9
                    },
                    {
                        "id": 10,
                        "title": "The Watered Garden Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/wateredgarden.png",
                        "url": "https://thewateredgardenfoundation.org",
                        "featured": false,
                        "order": 10
                    },
                    {
                        "id": 11,
                        "title": "The Travel O Africa",
                        "category": "business",
                        "subcategory": "travel_tourism",
                        "displayCategory": "Travel & Tourism",
                        "image": "images/projects/thetraveloafrica.png",
                        "url": "https://thetraveloafrica.com",
                        "featured": false,
                        "order": 11
                    },
                    {
                        "id": 12,
                        "title": "The Push Studios",
                        "category": "business",
                        "subcategory": "creative_agency",
                        "displayCategory": "Creative Agency",
                        "image": "images/projects/thepushstudios.png",
                        "url": "https://thepushstudios.com",
                        "featured": false,
                        "order": 12
                    },
                    {
                        "id": 13,
                        "title": "The FCB Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/fcbfoundation.png",
                        "url": "https://thefcbfoundation.org",
                        "featured": false,
                        "order": 13
                    },
                    {
                        "id": 14,
                        "title": "The Alpha Health Group",
                        "category": "health",
                        "subcategory": "healthcare",
                        "displayCategory": "Healthcare",
                        "image": "images/projects/alphahealthgroup.png",
                        "url": "https://thealphahealthgroup.org",
                        "featured": false,
                        "order": 14
                    },
                    {
                        "id": 15,
                        "title": "SOVODEG",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/sovodeg.png",
                        "url": "https://sovodeg.org",
                        "featured": false,
                        "order": 15
                    },
                    {
                        "id": 16,
                        "title": "Samak Technology",
                        "category": "tech",
                        "subcategory": "technology",
                        "displayCategory": "Technology",
                        "image": "images/projects/samaktechnology.png",
                        "url": "https://samaktechnology.com",
                        "featured": false,
                        "order": 16
                    },
                    {
                        "id": 17,
                        "title": "Richard Akita",
                        "category": "business",
                        "subcategory": "personal_brand",
                        "displayCategory": "Personal Brand",
                        "image": "images/projects/richardakita.png",
                        "url": "https://richardakita.com",
                        "featured": false,
                        "order": 17
                    },
                    {
                        "id": 18,
                        "title": "Resource Interlink",
                        "category": "business",
                        "subcategory": "business",
                        "displayCategory": "Business",
                        "image": "images/projects/resourceinterlink.png",
                        "url": "https://resourceinterlink.co.uk",
                        "featured": false,
                        "order": 18
                    },
                    {
                        "id": 19,
                        "title": "Relax Airlines",
                        "category": "business",
                        "subcategory": "travel_tourism",
                        "displayCategory": "Travel & Tourism",
                        "image": "images/projects/relaxairlines.png",
                        "url": "https://relaxairlines.com",
                        "featured": false,
                        "order": 19
                    },
                    {
                        "id": 20,
                        "title": "PNMTC",
                        "category": "education",
                        "subcategory": "education",
                        "displayCategory": "Education",
                        "image": "images/projects/pnmtc.png",
                        "url": "https://pnmtc.edu.gh",
                        "featured": false,
                        "order": 20
                    },
                    {
                        "id": 21,
                        "title": "Peachera",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/peachera.png",
                        "url": "https://peachera.org",
                        "featured": false,
                        "order": 21
                    },
                    {
                        "id": 22,
                        "title": "Nkunim",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/nkunim.png",
                        "url": "https://nkunim.org",
                        "featured": false,
                        "order": 22
                    },
                    {
                        "id": 23,
                        "title": "Martha's Beauty Supply",
                        "category": "business",
                        "subcategory": "e_commerce",
                        "displayCategory": "E-Commerce",
                        "image": "images/projects/marthasbeauty.png",
                        "url": "https://marthasbeautysupply.us",
                        "featured": false,
                        "order": 23
                    },
                    {
                        "id": 24,
                        "title": "Manifest Ghana",
                        "category": "tech",
                        "subcategory": "digital_agency",
                        "displayCategory": "Digital Agency",
                        "image": "images/projects/manifestghana.png",
                        "url": "https://manifestghana.com",
                        "featured": false,
                        "order": 24
                    },
                    {
                        "id": 25,
                        "title": "Johnson Sebire",
                        "category": "business",
                        "subcategory": "personal_brand",
                        "displayCategory": "Personal Brand",
                        "image": "images/projects/johnsonsebire.png",
                        "url": "https://johnsonsebire.com",
                        "featured": false,
                        "order": 25
                    },
                    {
                        "id": 26,
                        "title": "Jaglah Sterile",
                        "category": "health",
                        "subcategory": "healthcare",
                        "displayCategory": "Healthcare",
                        "image": "images/projects/jaglahsterile.png",
                        "url": "https://jaglahsterile.com",
                        "featured": false,
                        "order": 26
                    },
                    {
                        "id": 27,
                        "title": "Jaglah Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/jaglahfoundation.png",
                        "url": "https://jaglahfoundation.com",
                        "featured": false,
                        "order": 27
                    },
                    {
                        "id": 28,
                        "title": "HF Liberia",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/hfliberia.png",
                        "url": "https://hfliberia.com",
                        "featured": false,
                        "order": 28
                    },
                    {
                        "id": 29,
                        "title": "Global HR Consulting",
                        "category": "business",
                        "subcategory": "business",
                        "displayCategory": "Business",
                        "image": "images/projects/globalhrconsulting.png",
                        "url": "https://globalhrconsulting.org",
                        "featured": false,
                        "order": 29
                    },
                    {
                        "id": 30,
                        "title": "Global AZ Services",
                        "category": "business",
                        "subcategory": "business",
                        "displayCategory": "Business",
                        "image": "images/projects/globalazservices.png",
                        "url": "https://globalazserviceslda.com",
                        "featured": false,
                        "order": 30
                    },
                    {
                        "id": 31,
                        "title": "Get The Artiste",
                        "category": "business",
                        "subcategory": "entertainment",
                        "displayCategory": "Entertainment",
                        "image": "images/projects/gettheartiste.png",
                        "url": "https://gettheartiste.com",
                        "featured": false,
                        "order": 31
                    },
                    {
                        "id": 32,
                        "title": "FMS Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/fmsfoundation.png",
                        "url": "https://fmsfoundation.org",
                        "featured": false,
                        "order": 32
                    },
                    {
                        "id": 33,
                        "title": "Everything Me",
                        "category": "business",
                        "subcategory": "e_commerce",
                        "displayCategory": "E-Commerce",
                        "image": "images/projects/everythingme.png",
                        "url": "https://everything-me.com",
                        "featured": false,
                        "order": 33
                    },
                    {
                        "id": 34,
                        "title": "Cosello Apparel",
                        "category": "business",
                        "subcategory": "e_commerce",
                        "displayCategory": "E-Commerce",
                        "image": "images/projects/coselloapparel.png",
                        "url": "https://coselloapparel.com",
                        "featured": false,
                        "order": 34
                    },
                    {
                        "id": 35,
                        "title": "Coconut Pointe",
                        "category": "business",
                        "subcategory": "real_estate",
                        "displayCategory": "Real Estate",
                        "image": "images/projects/coconutpointe.png",
                        "url": "https://coconutpointe.com",
                        "featured": false,
                        "order": 35
                    },
                    {
                        "id": 36,
                        "title": "Cliq Host",
                        "category": "tech",
                        "subcategory": "technology",
                        "displayCategory": "Technology",
                        "image": "images/projects/cliqhost.png",
                        "url": "https://cliqhost.space",
                        "featured": false,
                        "order": 36
                    },
                    {
                        "id": 37,
                        "title": "Christian Missions Online",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/christianmissions.png",
                        "url": "https://christianmissionsonline.org",
                        "featured": false,
                        "order": 37
                    },
                    {
                        "id": 38,
                        "title": "Chrissy Foundation",
                        "category": "nonprofit",
                        "subcategory": "nonprofit",
                        "displayCategory": "Nonprofit",
                        "image": "images/projects/chrissyfoundation.png",
                        "url": "https://chrissyfoundation.org",
                        "featured": false,
                        "order": 38
                    },
                    {
                        "id": 39,
                        "title": "CCEM Ghana",
                        "category": "education",
                        "subcategory": "education",
                        "displayCategory": "Education",
                        "image": "images/projects/ccemghana.png",
                        "url": "https://ccemghana.org",
                        "featured": false,
                        "order": 39
                    },
                    {
                        "id": 40,
                        "title": "Bosch School of Ministry",
                        "category": "education",
                        "subcategory": "education",
                        "displayCategory": "Education",
                        "image": "images/projects/boschschool.png",
                        "url": "https://boschschoolofministry.com",
                        "featured": false,
                        "order": 40
                    }
                ],
                "pagination": {
                    "page1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    "page2": [13, 14, 15, 16, 17, 18, 19, 20],
                    "page3": [21, 22, 23, 24, 25, 26, 27, 28],
                    "page4": [29, 30, 31, 32, 33, 34, 35, 36],
                    "page5": [37, 38, 39, 40]
                },
                "loadingStates": {
                    "skeleton": {
                        "count": 8,
                        "animation": "pulse",
                        "duration": 1200
                    },
                    "spinner": {
                        "type": "dots",
                        "color": "#ff2200",
                        "message": "Loading more projects..."
                    },
                    "error": {
                        "title": "Failed to load projects",
                        "message": "Please check your connection and try again.",
                        "retryText": "Retry"
                    },
                    "endOfContent": {
                        "title": "You've seen all projects!",
                        "message": "Browse our amazing portfolio of 40+ delivered projects.",
                        "actionText": "View Categories"
                    }
                }
            };
            
            this.filteredProjects = [...this.data.projects];
            
            // Cache the data if performance optimizer is available
            if (window.projectsPerformanceOptimizer?.cache?.data) {
                window.projectsPerformanceOptimizer.cache.data.set('projects-data', {
                    data: JSON.stringify(this.data),
                    timestamp: Date.now()
                });
                console.log('💾 Cached projects data for performance');
            }
            
            return this.data;
        } catch (error) {
            console.error('Failed to load projects data:', error);
            throw error;
        }
    }

    /**
     * Get initial batch of projects for page load
     * @returns {Array} First 12 projects
     */
    getInitialProjects() {
        if (!this.data) return [];
        
        const initialCount = this.data.metadata.initialLoad;
        const projects = this.filteredProjects.slice(0, initialCount);
        this.loadedProjects = [...projects];
        this.currentPage = 1;
        this.hasMoreContent = this.filteredProjects.length > initialCount;
        
        return projects;
    }

    /**
     * Get next batch of projects for infinite scroll
     * @returns {Promise<Array>} Next batch of projects
     */
    async getNextBatch() {
        if (this.isLoading || !this.hasMoreContent) {
            return [];
        }

        this.isLoading = true;

        // Simulate API delay for realistic loading experience
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const itemsPerLoad = this.data.metadata.itemsPerLoad;
            const startIndex = this.loadedProjects.length;
            const endIndex = startIndex + itemsPerLoad;
            
            const nextBatch = this.filteredProjects.slice(startIndex, endIndex);
            
            // Update state
            this.loadedProjects.push(...nextBatch);
            this.currentPage++;
            this.hasMoreContent = this.loadedProjects.length < this.filteredProjects.length;
            
            return nextBatch;
        } catch (error) {
            console.error('Failed to load next batch:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Filter projects by category and search term
     * @param {string} category - Filter category
     * @param {string} searchTerm - Search term
     * @returns {Array} Filtered projects
     */
    filterProjects(category = 'all', searchTerm = '') {
        if (!this.data) return [];

        this.currentFilter = category;
        this.currentSearch = searchTerm.toLowerCase();
        
        let filtered = this.data.projects;

        // Apply category filter
        if (category !== 'all') {
            filtered = filtered.filter(project => project.category === category);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.title.toLowerCase().includes(this.currentSearch) ||
                project.displayCategory.toLowerCase().includes(this.currentSearch)
            );
        }

        // Update filtered projects and reset pagination
        this.filteredProjects = filtered;
        this.loadedProjects = [];
        this.currentPage = 1;
        this.hasMoreContent = this.filteredProjects.length > this.data.metadata.initialLoad;

        return this.getInitialProjects();
    }

    /**
     * Get total count of filtered projects
     * @returns {number} Total count of filtered projects
     */
    getTotalFilteredCount() {
        return this.filteredProjects.length;
    }

    /**
     * Get project by ID
     * @param {number} id - Project ID
     * @returns {Object|null} Project data
     */
    getProjectById(id) {
        if (!this.data) return null;
        return this.data.projects.find(project => project.id === id) || null;
    }

    /**
     * Get projects by category
     * @param {string} category - Category name
     * @returns {Array} Projects in category
     */
    getProjectsByCategory(category) {
        if (!this.data) return [];
        if (category === 'all') return this.data.projects;
        return this.data.projects.filter(project => project.category === category);
    }

    /**
     * Get metadata about projects
     * @returns {Object} Metadata
     */
    getMetadata() {
        return this.data ? this.data.metadata : null;
    }

    /**
     * Get loading states configuration
     * @returns {Object} Loading states
     */
    getLoadingStates() {
        return this.data ? this.data.loadingStates : null;
    }

    /**
     * Check if more content is available
     * @returns {boolean} Has more content
     */
    hasMore() {
        return this.hasMoreContent;
    }

    /**
     * Check if currently loading
     * @returns {boolean} Is loading
     */
    isCurrentlyLoading() {
        return this.isLoading;
    }

    /**
     * Get current filter state
     * @returns {Object} Current filter and search state
     */
    getCurrentState() {
        return {
            filter: this.currentFilter,
            search: this.currentSearch,
            page: this.currentPage,
            loaded: this.loadedProjects.length,
            total: this.filteredProjects.length,
            hasMore: this.hasMoreContent
        };
    }

    /**
     * Reset pagination to beginning
     */
    reset() {
        this.currentPage = 1;
        this.loadedProjects = [];
        this.isLoading = false;
        this.hasMoreContent = true;
        this.currentFilter = 'all';
        this.currentSearch = '';
        if (this.data) {
            this.filteredProjects = [...this.data.projects];
        }
    }

    /**
     * Generate HTML for a project card
     * @param {Object} project - Project data
     * @returns {string} HTML string
     */
    generateProjectCard(project) {
        return `
            <div class="project-card" data-category="${project.category}" data-id="${project.id}">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-card-content">
                    <span class="project-category">${project.displayCategory}</span>
                    <h3>${project.title}</h3>
                    <a href="${project.url}" class="project-link" target="_blank">
                        <span>Visit Website</span>
                        <i class="fa-solid fa-up-right-from-square"></i>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Generate skeleton loading cards
     * @param {number} count - Number of skeleton cards
     * @returns {string} HTML string
     */
    generateSkeletonCards(count = 8) {
        const skeletonCard = `
            <div class="project-card skeleton-card">
                <div class="skeleton-image"></div>
                <div class="project-card-content">
                    <div class="skeleton-category"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-link"></div>
                </div>
            </div>
        `;
        return skeletonCard.repeat(count);
    }

    /**
     * Get statistics about current dataset
     * @returns {Object} Statistics
     */
    getStatistics() {
        if (!this.data) return null;

        return {
            total: this.data.metadata.totalProjects,
            byCategory: this.data.metadata.categories,
            bySubcategory: this.data.metadata.subcategories,
            currentlyLoaded: this.loadedProjects.length,
            currentlyFiltered: this.filteredProjects.length
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsDataManager;
}

// Global assignment for browser usage
if (typeof window !== 'undefined') {
    window.ProjectsDataManager = ProjectsDataManager;
}