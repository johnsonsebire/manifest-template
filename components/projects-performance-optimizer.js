/**
 * Projects Performance Optimizer
 * Implements image lazy loading, content caching, and performance monitoring
 * for optimal user experience on the projects page
 */
class ProjectsPerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.performanceMetrics = {
            startTime: performance.now(),
            imagesLoaded: 0,
            totalImages: 0,
            cacheHits: 0,
            cacheMisses: 0,
            loadTimes: []
        };
        
        // Cache configuration
        this.cache = {
            images: new Map(),
            data: new Map(),
            maxAge: 30 * 60 * 1000, // 30 minutes
            maxSize: 50 // Maximum cached items
        };
        
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupOptimizations());
        } else {
            this.setupOptimizations();
        }
    }

    /**
     * Set up all performance optimizations
     */
    setupOptimizations() {
        this.setupImageLazyLoading();
        this.setupContentCaching();
        this.setupPerformanceMonitoring();
        this.setupResourceHints();
        this.optimizeCriticalPath();
        
        // Log initialization
        console.log('🚀 Projects Performance Optimizer initialized');
    }

    /**
     * Set up native image lazy loading with intersection observer fallback
     */
    setupImageLazyLoading() {
        // Check for native lazy loading support
        const supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;
        
        if (supportsNativeLazyLoading) {
            this.setupNativeLazyLoading();
        } else {
            this.setupIntersectionObserverLazyLoading();
        }
        
        // Track image loading performance
        this.trackImagePerformance();
    }

    /**
     * Set up native lazy loading for supported browsers
     */
    setupNativeLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');
        
        images.forEach((img, index) => {
            // Load first 3 images immediately (above fold)
            if (index < 3) {
                img.loading = 'eager';
            } else {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.onerror = () => this.handleImageError(img);
            img.onload = () => this.handleImageLoad(img);
        });
        
        this.performanceMetrics.totalImages = images.length;
    }

    /**
     * Set up Intersection Observer lazy loading for older browsers
     */
    setupIntersectionObserverLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            this.loadAllImages();
            return;
        }

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });

        // Observe all images except the first 3 (above fold)
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index < 3) {
                this.loadImage(img); // Load immediately
            } else {
                // Set up lazy loading
                img.dataset.src = img.src;
                img.src = this.generatePlaceholder(img);
                img.classList.add('lazy-loading');
                this.imageObserver.observe(img);
            }
        });
        
        this.performanceMetrics.totalImages = images.length;
    }

    /**
     * Load image with caching and error handling
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;
        
        // Check cache first
        if (this.cache.images.has(src)) {
            const cachedData = this.cache.images.get(src);
            if (Date.now() - cachedData.timestamp < this.cache.maxAge) {
                img.src = cachedData.url;
                this.performanceMetrics.cacheHits++;
                this.handleImageLoad(img);
                return;
            }
        }
        
        // Load image
        const startTime = performance.now();
        img.onload = () => {
            this.handleImageLoad(img);
            this.cacheImage(src, img.src);
            this.performanceMetrics.loadTimes.push(performance.now() - startTime);
        };
        
        img.onerror = () => this.handleImageError(img);
        
        if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
        
        this.performanceMetrics.cacheMisses++;
    }

    /**
     * Generate a placeholder for lazy-loaded images
     */
    generatePlaceholder(img) {
        const width = img.width || 350;
        const height = img.height || 250;
        
        // Create a simple SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ccc" font-family="Arial" font-size="14">
                    Loading...
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Handle successful image load
     */
    handleImageLoad(img) {
        this.performanceMetrics.imagesLoaded++;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        
        // Fade in animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: img,
                opacity: [0.5, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
        }
    }

    /**
     * Handle image load error
     */
    handleImageError(img) {
        img.classList.add('lazy-error');
        
        // Create fallback placeholder
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.innerHTML = `
            <i class="fas fa-image" style="font-size: 48px; color: #ccc;"></i>
            <p style="margin-top: 10px; color: #999; font-size: 12px;">Image not available</p>
        `;
        fallback.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 250px;
            background: #f8f8f8;
            border-radius: 8px;
        `;
        
        img.parentNode.replaceChild(fallback, img);
    }

    /**
     * Cache image URL
     */
    cacheImage(originalSrc, loadedSrc) {
        // Implement LRU cache
        if (this.cache.images.size >= this.cache.maxSize) {
            const firstKey = this.cache.images.keys().next().value;
            this.cache.images.delete(firstKey);
        }
        
        this.cache.images.set(originalSrc, {
            url: loadedSrc,
            timestamp: Date.now()
        });
    }

    /**
     * Set up content caching for project data
     */
    setupContentCaching() {
        // Cache API responses if available
        if ('caches' in window) {
            this.setupServiceWorkerCache();
        }
        
        // Memory caching for component data
        this.setupMemoryCache();
    }

    /**
     * Set up Service Worker caching
     */
    async setupServiceWorkerCache() {
        try {
            const cache = await caches.open('projects-cache-v1');
            
            // Cache static assets
            const assetsToCache = [
                'components/projects-data-manager.js',
                'components/infinite-projects-scroll.js',
                'components/project-navigation.js',
                'components/project-detail-manager.js'
            ];
            
            await cache.addAll(assetsToCache);
            console.log('📦 Static assets cached successfully');
        } catch (error) {
            console.warn('Service Worker caching not supported:', error);
        }
    }

    /**
     * Set up memory caching for frequently accessed data
     */
    setupMemoryCache() {
        // Override fetch requests to add caching
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const url = args[0];
            
            // Check cache first
            if (this.cache.data.has(url)) {
                const cachedData = this.cache.data.get(url);
                if (Date.now() - cachedData.timestamp < this.cache.maxAge) {
                    this.performanceMetrics.cacheHits++;
                    return new Response(cachedData.data);
                }
            }
            
            // Fetch and cache
            try {
                const response = await originalFetch(...args);
                const clonedResponse = response.clone();
                const data = await clonedResponse.text();
                
                this.cache.data.set(url, {
                    data: data,
                    timestamp: Date.now()
                });
                
                this.performanceMetrics.cacheMisses++;
                return response;
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        };
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Core Web Vitals monitoring
        this.monitorCoreWebVitals();
        
        // Custom performance metrics
        this.monitorCustomMetrics();
        
        // Set up performance observer
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }
        
        // Report performance metrics periodically
        setInterval(() => this.reportPerformanceMetrics(), 30000); // Every 30 seconds
    }

    /**
     * Monitor Core Web Vitals
     */
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeMetric('largest-contentful-paint', (entry) => {
            const lcp = entry.startTime;
            this.reportMetric('LCP', lcp, lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor');
        });

        // First Input Delay (FID)
        this.observeMetric('first-input', (entry) => {
            const fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', fid, fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor');
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        this.observeMetric('layout-shift', (entry) => {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                this.reportMetric('CLS', clsValue, clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor');
            }
        });
    }

    /**
     * Observe specific performance metric
     */
    observeMetric(type, callback) {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        callback(entry);
                    }
                });
                observer.observe({ entryTypes: [type] });
            } catch (error) {
                console.warn(`Cannot observe ${type}:`, error);
            }
        }
    }

    /**
     * Monitor custom performance metrics
     */
    monitorCustomMetrics() {
        // Time to Interactive (TTI)
        this.measureTimeToInteractive();
        
        // Resource loading times
        this.measureResourceLoadTimes();
        
        // Memory usage
        this.monitorMemoryUsage();
    }

    /**
     * Measure Time to Interactive
     */
    measureTimeToInteractive() {
        let interactiveTime = null;
        
        const checkInteractive = () => {
            if (document.readyState === 'complete' && !interactiveTime) {
                interactiveTime = performance.now();
                this.reportMetric('TTI', interactiveTime, interactiveTime < 3800 ? 'good' : 'needs-improvement');
            }
        };
        
        if (document.readyState === 'complete') {
            checkInteractive();
        } else {
            window.addEventListener('load', checkInteractive);
        }
    }

    /**
     * Measure resource load times
     */
    measureResourceLoadTimes() {
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                if (resource.name.includes('images/') || resource.name.includes('.js') || resource.name.includes('.css')) {
                    this.reportMetric(`Resource: ${resource.name.split('/').pop()}`, resource.duration, 
                        resource.duration < 1000 ? 'good' : 'needs-improvement');
                }
            });
        });
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.reportMetric('Memory Usage', memory.usedJSHeapSize / 1048576, // Convert to MB
                    memory.usedJSHeapSize < 50 * 1048576 ? 'good' : 'needs-improvement');
            }, 60000); // Every minute
        }
    }

    /**
     * Set up Performance Observer
     */
    setupPerformanceObserver() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    this.handleNavigationTiming(entry);
                } else if (entry.entryType === 'resource') {
                    this.handleResourceTiming(entry);
                }
            }
        });

        observer.observe({ entryTypes: ['navigation', 'resource'] });
    }

    /**
     * Handle navigation timing
     */
    handleNavigationTiming(entry) {
        const metrics = {
            'DNS Lookup': entry.domainLookupEnd - entry.domainLookupStart,
            'TCP Connection': entry.connectEnd - entry.connectStart,
            'DOM Content Loaded': entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            'Page Load': entry.loadEventEnd - entry.loadEventStart
        };

        Object.entries(metrics).forEach(([name, value]) => {
            if (value > 0) {
                this.reportMetric(name, value, value < 1000 ? 'good' : 'needs-improvement');
            }
        });
    }

    /**
     * Handle resource timing
     */
    handleResourceTiming(entry) {
        // Only log slow resources
        if (entry.duration > 1000) {
            console.warn(`⚠️ Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
        }
    }

    /**
     * Set up resource hints for better performance
     */
    setupResourceHints() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Prefetch likely next resources
        this.prefetchLikelyResources();
        
        // DNS prefetch for external domains
        this.setupDnsPrefetch();
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'https://fonts.googleapis.com/css2?family=Anybody:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap', as: 'style' },
            { href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css', as: 'style' },
            { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * Prefetch likely next resources
     */
    prefetchLikelyResources() {
        // Prefetch project detail page when hovering over project cards
        document.addEventListener('mouseover', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard && !projectCard.dataset.prefetched) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = 'project-detail.html';
                document.head.appendChild(link);
                projectCard.dataset.prefetched = 'true';
            }
        }, { passive: true });
    }

    /**
     * Set up DNS prefetch
     */
    setupDnsPrefetch() {
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'cdn.jsdelivr.net',
            'cdnjs.cloudflare.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }

    /**
     * Optimize critical rendering path
     */
    optimizeCriticalPath() {
        // Inline critical CSS if not already done
        this.inlineCriticalCSS();
        
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Optimize font loading
        this.optimizeFontLoading();
    }

    /**
     * Inline critical CSS
     */
    inlineCriticalCSS() {
        // This would typically be done at build time
        // Here we just ensure CSS is loaded efficiently
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }

    /**
     * Defer non-critical JavaScript
     */
    deferNonCriticalJS() {
        const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
        scripts.forEach(script => {
            if (!script.src.includes('anime') && !script.src.includes('bootstrap')) {
                script.defer = true;
            }
        });
    }

    /**
     * Optimize font loading
     */
    optimizeFontLoading() {
        // Add font-display: swap to improve loading performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Anybody';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Track image loading performance
     */
    trackImagePerformance() {
        const imageEntries = performance.getEntriesByType('resource')
            .filter(entry => entry.name.includes('images/'));
        
        imageEntries.forEach(entry => {
            this.performanceMetrics.loadTimes.push(entry.duration);
        });
    }

    /**
     * Load all images (fallback for unsupported browsers)
     */
    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            delete img.dataset.src;
        });
    }

    /**
     * Report performance metric
     */
    reportMetric(name, value, rating) {
        const metric = {
            name,
            value: typeof value === 'number' ? Math.round(value * 100) / 100 : value,
            rating,
            timestamp: Date.now()
        };

        // Log to console in development
        if (process?.env?.NODE_ENV === 'development' || !process) {
            const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
            console.log(`${emoji} ${name}: ${metric.value}${typeof value === 'number' ? 'ms' : ''}`);
        }

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: metric.value,
                metric_rating: rating
            });
        }

        // Store in local storage for debugging
        try {
            const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
            metrics.push(metric);
            
            // Keep only last 100 metrics
            if (metrics.length > 100) {
                metrics.splice(0, metrics.length - 100);
            }
            
            localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
        } catch (error) {
            console.warn('Could not store performance metrics:', error);
        }
    }

    /**
     * Report comprehensive performance metrics
     */
    reportPerformanceMetrics() {
        const report = {
            totalRuntime: performance.now() - this.performanceMetrics.startTime,
            imagesLoaded: this.performanceMetrics.imagesLoaded,
            totalImages: this.performanceMetrics.totalImages,
            imageLoadSuccess: this.performanceMetrics.totalImages > 0 ? 
                (this.performanceMetrics.imagesLoaded / this.performanceMetrics.totalImages * 100).toFixed(1) + '%' : '0%',
            cacheHitRate: this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses > 0 ?
                (this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) * 100).toFixed(1) + '%' : '0%',
            averageImageLoadTime: this.performanceMetrics.loadTimes.length > 0 ?
                (this.performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / this.performanceMetrics.loadTimes.length).toFixed(2) + 'ms' : 'N/A'
        };

        console.log('📊 Performance Report:', report);
        
        // Send comprehensive report to analytics
        this.reportMetric('Performance Report', JSON.stringify(report), 'info');
    }

    /**
     * Get current performance statistics
     */
    getPerformanceStats() {
        return {
            ...this.performanceMetrics,
            cacheSize: this.cache.images.size + this.cache.data.size,
            runtime: performance.now() - this.performanceMetrics.startTime
        };
    }

    /**
     * Clear performance cache
     */
    clearCache() {
        this.cache.images.clear();
        this.cache.data.clear();
        console.log('🧹 Performance cache cleared');
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.projectsPerformanceOptimizer = new ProjectsPerformanceOptimizer();
});

// Export for external use
window.ProjectsPerformanceOptimizer = ProjectsPerformanceOptimizer;