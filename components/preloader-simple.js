/**
 * SIMPLE PRELOADER JAVASCRIPT
 * Lightweight preloader animations with Anime.js
 * Dependencies: Anime.js
 */

class SimplePreloader {
    constructor(options = {}) {
        this.options = {
            selector: '.preloader-simple',
            logoPath: '../images/logos/favicon.png',
            loadingText: 'Loading',
            duration: 5000,
            autoHide: true,
            ...options
        };
        
        this.preloader = null;
        this.isInitialized = false;
    }

    init() {
        if (typeof anime === 'undefined') {
            console.warn('Anime.js is required for Simple Preloader animations');
            return false;
        }

        this.preloader = document.querySelector(this.options.selector);
        if (!this.preloader) {
            console.warn('Simple Preloader element not found');
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
        // Background elements rotation
        anime({
            targets: this.preloader.querySelectorAll('.bg-element-1'),
            rotate: 360,
            duration: 15000,
            loop: true,
            easing: 'linear'
        });

        anime({
            targets: this.preloader.querySelectorAll('.bg-element-2'),
            rotate: -360,
            duration: 20000,
            loop: true,
            easing: 'linear'
        });

        anime({
            targets: this.preloader.querySelectorAll('.bg-element-3'),
            rotate: 360,
            duration: 25000,
            loop: true,
            easing: 'linear'
        });

        // Logo container animation
        anime({
            targets: this.preloader.querySelectorAll('.loader-logo'),
            scale: [0.9, 1],
            rotateY: [0, 360],
            duration: 3000,
            easing: 'easeInOutQuad',
            loop: true,
            direction: 'alternate'
        });

        // Logo image reveal
        setTimeout(() => {
            const logoImage = this.preloader.querySelector('.logo-image');
            if (logoImage) {
                logoImage.classList.add('loaded');
            }
        }, 500);

        // Logo image pulse
        anime({
            targets: this.preloader.querySelectorAll('.logo-image'),
            scale: [1, 1.1, 1],
            duration: 2000,
            delay: 1000,
            loop: true,
            easing: 'easeInOutQuad'
        });

        // Loading dots animation
        anime({
            targets: this.preloader.querySelectorAll('.loading-dots .dot'),
            opacity: [0.3, 1],
            scale: [1, 1.2],
            duration: 600,
            delay: anime.stagger(100),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad'
        });

        // Loading text fade in
        anime({
            targets: this.preloader.querySelectorAll('.loading-text'),
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: 1000,
            easing: 'easeOutQuad'
        });

        // Progress bar fill
        anime({
            targets: this.preloader.querySelectorAll('.progress-fill'),
            width: ['0%', '100%'],
            duration: 3000,
            delay: 1500,
            easing: 'easeInOutQuad'
        });
    }

    show() {
        if (this.preloader) {
            this.preloader.style.display = 'flex';
            anime({
                targets: this.preloader,
                opacity: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    hide(callback) {
        if (this.preloader) {
            anime({
                targets: this.preloader,
                opacity: 0,
                duration: 500,
                easing: 'easeOutQuad',
                complete: () => {
                    this.preloader.style.display = 'none';
                    if (callback) callback();
                }
            });
        }
    }

    updateText(text) {
        const textElement = this.preloader?.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }

    updateProgress(percentage) {
        const progressFill = this.preloader?.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
    }
}

// Auto-initialize if DOM is ready
function initSimplePreloader(options) {
    const preloader = new SimplePreloader(options);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => preloader.init());
    } else {
        preloader.init();
    }
    
    return preloader;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimplePreloader, initSimplePreloader };
}

// Global namespace
window.SimplePreloader = SimplePreloader;
window.initSimplePreloader = initSimplePreloader;