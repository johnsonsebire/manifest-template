/**
 * Performance Monitoring Dashboard
 * Real-time performance metrics display for development and debugging
 */
class PerformanceMonitoringDashboard {
    constructor() {
        this.isVisible = false;
        this.updateInterval = null;
        this.performanceData = {
            metrics: [],
            vitals: {},
            resources: [],
            memory: {}
        };
        
        this.init();
    }

    /**
     * Initialize the performance dashboard
     */
    init() {
        // Only initialize in development or when explicitly requested
        if (this.shouldInitialize()) {
            this.createDashboard();
            this.startMonitoring();
            this.bindKeyboardShortcuts();
        }
    }

    /**
     * Check if dashboard should be initialized
     */
    shouldInitialize() {
        // Initialize if:
        // 1. In development mode
        // 2. URL contains ?perf-monitor=true
        // 3. localStorage has perfMonitor enabled
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('perf-monitor=true') ||
            localStorage.getItem('perfMonitor') === 'enabled'
        );
    }

    /**
     * Create the dashboard UI
     */
    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'perf-dashboard';
        dashboard.className = 'perf-dashboard hidden';
        dashboard.innerHTML = `
            <div class="perf-header">
                <h3>Performance Monitor</h3>
                <div class="perf-controls">
                    <button class="perf-btn" id="perf-clear">Clear</button>
                    <button class="perf-btn" id="perf-export">Export</button>
                    <button class="perf-btn" id="perf-close">×</button>
                </div>
            </div>
            <div class="perf-content">
                <div class="perf-section">
                    <h4>Core Web Vitals</h4>
                    <div class="perf-vitals">
                        <div class="vital-metric">
                            <label>LCP</label>
                            <span id="lcp-value">-</span>
                            <div class="vital-status" id="lcp-status"></div>
                        </div>
                        <div class="vital-metric">
                            <label>FID</label>
                            <span id="fid-value">-</span>
                            <div class="vital-status" id="fid-status"></div>
                        </div>
                        <div class="vital-metric">
                            <label>CLS</label>
                            <span id="cls-value">-</span>
                            <div class="vital-status" id="cls-status"></div>
                        </div>
                    </div>
                </div>
                
                <div class="perf-section">
                    <h4>Performance Optimizer Stats</h4>
                    <div class="optimizer-stats">
                        <div class="stat-item">
                            <label>Images Loaded:</label>
                            <span id="images-loaded">0/0</span>
                        </div>
                        <div class="stat-item">
                            <label>Cache Hit Rate:</label>
                            <span id="cache-hit-rate">0%</span>
                        </div>
                        <div class="stat-item">
                            <label>Avg Load Time:</label>
                            <span id="avg-load-time">0ms</span>
                        </div>
                    </div>
                </div>
                
                <div class="perf-section">
                    <h4>Memory Usage</h4>
                    <div class="memory-stats">
                        <div class="memory-bar">
                            <div class="memory-used" id="memory-used-bar"></div>
                        </div>
                        <div class="memory-details">
                            <span id="memory-used">0 MB</span> / <span id="memory-limit">0 MB</span>
                        </div>
                    </div>
                </div>
                
                <div class="perf-section">
                    <h4>Recent Metrics</h4>
                    <div class="metrics-log" id="metrics-log">
                        <div class="no-metrics">No metrics available</div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addDashboardStyles();
        
        // Insert dashboard into page
        document.body.appendChild(dashboard);
        
        // Bind event listeners
        this.bindDashboardEvents();
    }

    /**
     * Add CSS styles for the dashboard
     */
    addDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .perf-dashboard {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 320px;
                max-height: 600px;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                border-radius: 8px;
                border: 1px solid #333;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
                backdrop-filter: blur(10px);
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .perf-dashboard.hidden {
                opacity: 0;
                visibility: hidden;
            }
            
            .perf-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: #1a1a1a;
                border-radius: 8px 8px 0 0;
                border-bottom: 1px solid #333;
            }
            
            .perf-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
            }
            
            .perf-controls {
                display: flex;
                gap: 8px;
            }
            
            .perf-btn {
                background: #333;
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.2s ease;
            }
            
            .perf-btn:hover {
                background: #555;
            }
            
            .perf-content {
                padding: 16px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .perf-section {
                margin-bottom: 20px;
            }
            
            .perf-section h4 {
                margin: 0 0 10px 0;
                font-size: 13px;
                color: #ccc;
                border-bottom: 1px solid #333;
                padding-bottom: 4px;
            }
            
            .perf-vitals {
                display: flex;
                gap: 12px;
            }
            
            .vital-metric {
                flex: 1;
                text-align: center;
            }
            
            .vital-metric label {
                display: block;
                font-size: 10px;
                color: #999;
                margin-bottom: 4px;
            }
            
            .vital-metric span {
                display: block;
                font-weight: bold;
                margin-bottom: 4px;
            }
            
            .vital-status {
                height: 4px;
                border-radius: 2px;
                background: #333;
            }
            
            .vital-status.good { background: #4ade80; }
            .vital-status.needs-improvement { background: #fbbf24; }
            .vital-status.poor { background: #ef4444; }
            
            .optimizer-stats,
            .memory-details {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .stat-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .stat-item label {
                color: #999;
                font-size: 11px;
            }
            
            .stat-item span {
                font-weight: bold;
            }
            
            .memory-bar {
                width: 100%;
                height: 8px;
                background: #333;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .memory-used {
                height: 100%;
                background: linear-gradient(90deg, #4ade80 0%, #fbbf24 70%, #ef4444 100%);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .metrics-log {
                max-height: 150px;
                overflow-y: auto;
                background: #1a1a1a;
                border-radius: 4px;
                padding: 8px;
            }
            
            .metric-entry {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
                border-bottom: 1px solid #2a2a2a;
                font-size: 10px;
            }
            
            .metric-entry:last-child {
                border-bottom: none;
            }
            
            .metric-name {
                color: #ccc;
                flex: 1;
            }
            
            .metric-value {
                font-weight: bold;
                margin-right: 8px;
            }
            
            .metric-status {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            
            .metric-status.good { background: #4ade80; }
            .metric-status.needs-improvement { background: #fbbf24; }
            .metric-status.poor { background: #ef4444; }
            
            .no-metrics {
                text-align: center;
                color: #666;
                font-style: italic;
                padding: 20px;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .perf-dashboard {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                    max-height: 400px;
                }
                
                .perf-vitals {
                    flex-direction: column;
                    gap: 8px;
                }
                
                .vital-metric {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-align: left;
                }
                
                .vital-metric label {
                    margin-bottom: 0;
                    min-width: 30px;
                }
                
                .vital-metric span {
                    margin-bottom: 0;
                    min-width: 60px;
                }
                
                .vital-status {
                    width: 20px;
                    height: 4px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Bind dashboard event listeners
     */
    bindDashboardEvents() {
        // Close button
        document.getElementById('perf-close').addEventListener('click', () => {
            this.hide();
        });

        // Clear button
        document.getElementById('perf-clear').addEventListener('click', () => {
            this.clearMetrics();
        });

        // Export button
        document.getElementById('perf-export').addEventListener('click', () => {
            this.exportData();
        });
    }

    /**
     * Bind keyboard shortcuts
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+P or Cmd+Shift+P to toggle dashboard
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * Start monitoring performance
     */
    startMonitoring() {
        // Update dashboard every 2 seconds
        this.updateInterval = setInterval(() => {
            this.updateDashboard();
        }, 2000);

        // Listen for performance optimizer updates
        if (window.projectsPerformanceOptimizer) {
            // Hook into the performance optimizer's reporting
            const originalReportMetric = window.projectsPerformanceOptimizer.reportMetric;
            window.projectsPerformanceOptimizer.reportMetric = (name, value, rating) => {
                originalReportMetric.call(window.projectsPerformanceOptimizer, name, value, rating);
                this.addMetric(name, value, rating);
            };
        }
    }

    /**
     * Update dashboard with latest performance data
     */
    updateDashboard() {
        if (!this.isVisible) return;

        // Update performance optimizer stats
        if (window.projectsPerformanceOptimizer) {
            const stats = window.projectsPerformanceOptimizer.getPerformanceStats();
            
            // Update image loading stats
            document.getElementById('images-loaded').textContent = 
                `${stats.imagesLoaded}/${stats.totalImages}`;
            
            // Update cache hit rate
            const totalRequests = stats.cacheHits + stats.cacheMisses;
            const hitRate = totalRequests > 0 ? 
                ((stats.cacheHits / totalRequests) * 100).toFixed(1) : '0';
            document.getElementById('cache-hit-rate').textContent = `${hitRate}%`;
            
            // Update average load time
            const avgTime = stats.loadTimes.length > 0 ?
                (stats.loadTimes.reduce((a, b) => a + b, 0) / stats.loadTimes.length).toFixed(2) : '0';
            document.getElementById('avg-load-time').textContent = `${avgTime}ms`;
        }

        // Update memory usage
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(1);
            const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(1);
            const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

            document.getElementById('memory-used').textContent = `${usedMB} MB`;
            document.getElementById('memory-limit').textContent = `${limitMB} MB`;
            document.getElementById('memory-used-bar').style.width = `${percentage}%`;
        }
    }

    /**
     * Add a metric to the dashboard
     */
    addMetric(name, value, rating) {
        const metric = {
            name,
            value: typeof value === 'number' ? Math.round(value * 100) / 100 : value,
            rating,
            timestamp: Date.now()
        };

        this.performanceData.metrics.unshift(metric);
        
        // Keep only last 50 metrics
        if (this.performanceData.metrics.length > 50) {
            this.performanceData.metrics = this.performanceData.metrics.slice(0, 50);
        }

        // Update Core Web Vitals display
        if (name === 'LCP') {
            this.updateVital('lcp', value, rating);
        } else if (name === 'FID') {
            this.updateVital('fid', value, rating);
        } else if (name === 'CLS') {
            this.updateVital('cls', value, rating);
        }

        // Update metrics log
        this.updateMetricsLog();
    }

    /**
     * Update a Core Web Vital display
     */
    updateVital(vital, value, rating) {
        const valueEl = document.getElementById(`${vital}-value`);
        const statusEl = document.getElementById(`${vital}-status`);
        
        if (valueEl && statusEl) {
            valueEl.textContent = typeof value === 'number' ? 
                `${value.toFixed(2)}ms` : value;
            statusEl.className = `vital-status ${rating}`;
        }
    }

    /**
     * Update the metrics log
     */
    updateMetricsLog() {
        const logContainer = document.getElementById('metrics-log');
        if (!logContainer) return;

        if (this.performanceData.metrics.length === 0) {
            logContainer.innerHTML = '<div class="no-metrics">No metrics available</div>';
            return;
        }

        const metricsHTML = this.performanceData.metrics
            .slice(0, 10) // Show only last 10 metrics
            .map(metric => `
                <div class="metric-entry">
                    <span class="metric-name">${metric.name}</span>
                    <span class="metric-value">${metric.value}${typeof metric.value === 'number' ? 'ms' : ''}</span>
                    <div class="metric-status ${metric.rating}"></div>
                </div>
            `)
            .join('');

        logContainer.innerHTML = metricsHTML;
    }

    /**
     * Show the dashboard
     */
    show() {
        const dashboard = document.getElementById('perf-dashboard');
        if (dashboard) {
            dashboard.classList.remove('hidden');
            this.isVisible = true;
            this.updateDashboard();
        }
    }

    /**
     * Hide the dashboard
     */
    hide() {
        const dashboard = document.getElementById('perf-dashboard');
        if (dashboard) {
            dashboard.classList.add('hidden');
            this.isVisible = false;
        }
    }

    /**
     * Toggle dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Clear all metrics
     */
    clearMetrics() {
        this.performanceData.metrics = [];
        this.updateMetricsLog();
        
        // Clear Core Web Vitals
        ['lcp', 'fid', 'cls'].forEach(vital => {
            document.getElementById(`${vital}-value`).textContent = '-';
            document.getElementById(`${vital}-status`).className = 'vital-status';
        });
        
        console.log('🧹 Performance metrics cleared');
    }

    /**
     * Export performance data
     */
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.performanceData.metrics,
            performanceEntries: performance.getEntries(),
            memory: 'memory' in performance ? performance.memory : null,
            connection: 'connection' in navigator ? navigator.connection : null
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📊 Performance data exported');
    }

    /**
     * Destroy the dashboard
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        const dashboard = document.getElementById('perf-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
        
        this.isVisible = false;
    }
}

// Initialize the performance dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitoringDashboard = new PerformanceMonitoringDashboard();
    
    // Show dashboard automatically in development
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            if (window.performanceMonitoringDashboard) {
                window.performanceMonitoringDashboard.show();
            }
        }, 2000);
    }
});

// Global access
window.PerformanceMonitoringDashboard = PerformanceMonitoringDashboard;