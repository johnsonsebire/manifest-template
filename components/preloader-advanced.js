/**
 * ADVANCED PRELOADER JAVASCRIPT
 * Feature-rich preloader with sophisticated animations
 * Dependencies: Anime.js
 */

class AdvancedPreloader {
    constructor(options = {}) {
        this.options = {
            selector: '.preloader-advanced',
            logoPath: '../images/logos/logo.png',
            loadingText: 'Loading amazing experiences...',
            duration: 3500,
            autoHide: true,
            ...options
        };
        
        this.preloader = null;
        this.isInitialized = false;
        this.progressValue = 0;
    }

    init() {
        if (typeof anime === 'undefined') {
            console.warn('Anime.js is required for Advanced Preloader animations');
            return false;
        }

        this.preloader = document.querySelector(this.options.selector);
        if (!this.preloader) {
            console.warn('Advanced Preloader element not found');
            return false;
        }

        this.startAnimations();
        
        if (this.options.autoHide) {
            setTimeout(() => {
                this.hide();
            }, this.options.duration);
        }

        this.isInitialized = true;
        return true;
    }

    startAnimations() {
        // Animate progress bar
        anime({
            targets: this.preloader.querySelectorAll('.preloader-progress-bar'),
            width: '100%',
            duration: 3000,
            easing: 'easeInOutQuad',
            update: (anim) => {
                this.progressValue = Math.round(anim.progress);
            }
        });

        // Animate logo with elastic effect
        anime({
            targets: this.preloader.querySelectorAll('.preloader-logo'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)',
            delay: 500
        });

        // Animate dots with staggered timing
        anime({
            targets: this.preloader.querySelectorAll('.preloader-dot'),
            scale: [0, 1],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100, { start: 800 }),
            easing: 'easeOutElastic(1, .8)'
        });

        // Animate text
        anime({
            targets: this.preloader.querySelectorAll('.preloader-text'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: 1200,
            easing: 'easeOutQuad'
        });

        // Logo scaling pulse
        setTimeout(() => {
            anime({
                targets: this.preloader.querySelectorAll('.preloader-logo'),
                scale: [1, 1.05, 1],
                duration: 2000,
                loop: true,
                easing: 'easeInOutSine'
            });
        }, 1000);
    }

    show() {
        if (this.preloader) {
            this.preloader.style.display = 'flex';
            anime({
                targets: this.preloader,
                opacity: 1,
                scale: [0.9, 1],
                duration: 400,
                easing: 'easeOutBack(1.7)'
            });
        }
    }

    hide(callback) {
        if (this.preloader) {
            anime({
                targets: this.preloader,
                opacity: 0,
                scale: 0.9,
                duration: 800,
                easing: 'easeInBack(1.7)',
                complete: () => {
                    this.preloader.style.display = 'none';
                    if (callback) callback();
                }
            });
        }
    }

    updateText(text) {
        const textElement = this.preloader?.querySelector('.preloader-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }

    setProgress(percentage) {
        const progressBar = this.preloader?.querySelector('.preloader-progress-bar');
        if (progressBar) {
            anime({
                targets: progressBar,
                width: percentage + '%',
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    // Advanced features
    addCustomMessage(message, duration = 2000) {
        const originalText = this.preloader?.querySelector('.preloader-text')?.textContent;
        this.updateText(message);
        
        setTimeout(() => {
            if (originalText) {
                this.updateText(originalText);
            }
        }, duration);
    }

    simulateLoading(steps = [], callback) {
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                this.updateText(step.text);
                this.setProgress(step.progress);
                currentStep++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 500);
    }

    getProgress() {
        return this.progressValue;
    }
}

// Auto-initialize if DOM is ready
function initAdvancedPreloader(options) {
    const preloader = new AdvancedPreloader(options);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => preloader.init());
    } else {
        preloader.init();
    }
    
    return preloader;
}

// Example usage with loading steps
function createLoadingSequence() {
    const preloader = new AdvancedPreloader();
    
    const loadingSteps = [
        { text: 'Initializing...', progress: 20 },
        { text: 'Loading assets...', progress: 50 },
        { text: 'Preparing interface...', progress: 80 },
        { text: 'Almost ready...', progress: 100 }
    ];
    
    preloader.init();
    preloader.simulateLoading(loadingSteps, () => {
        setTimeout(() => preloader.hide(), 500);
    });
    
    return preloader;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedPreloader, initAdvancedPreloader, createLoadingSequence };
}

// Global namespace
window.AdvancedPreloader = AdvancedPreloader;
window.initAdvancedPreloader = initAdvancedPreloader;
window.createLoadingSequence = createLoadingSequence;