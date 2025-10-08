document.addEventListener('DOMContentLoaded', () => {
    // Setup infinite carousel
    const projectsContainer = document.querySelector('.projects');
    const projects = document.querySelectorAll('.project');
    const totalOriginalSlides = projects.length;
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Setup tilt effect to primary buttons
    const setupTiltEffect = () => {
        const primaryButtons = document.querySelectorAll('.btn-primary, .btn-cta');
        
        primaryButtons.forEach(button => {
            // Don't add the class if already present
            if (!button.classList.contains('tilt')) {
                button.classList.add('tilt');
            }
            
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            button = newButton;
            
            // Track the entry point of the mouse
            let entryPoint = { x: 0, y: 0 };
            let entryEdge = ''; // Store which edge the mouse entered from
            
            // Store original box-shadow if any
            const originalBoxShadow = window.getComputedStyle(button).boxShadow;
            
            // Mouse enter event for tracking entry point
            button.addEventListener('mouseenter', (e) => {
                // Only apply on non-mobile
                if (window.innerWidth <= 768) return;
                
                const rect = button.getBoundingClientRect();
                
                // Determine which edge the mouse entered from
                // Calculate distances from each edge
                const distFromTop = Math.abs(e.clientY - rect.top);
                const distFromBottom = Math.abs(e.clientY - rect.bottom);
                const distFromLeft = Math.abs(e.clientX - rect.left);
                const distFromRight = Math.abs(e.clientX - rect.right);
                
                // Find the minimum distance to determine entry edge
                const minDist = Math.min(distFromTop, distFromBottom, distFromLeft, distFromRight);
                
                if (minDist === distFromTop) entryEdge = 'top';
                else if (minDist === distFromBottom) entryEdge = 'bottom';
                else if (minDist === distFromLeft) entryEdge = 'left';
                else entryEdge = 'right';
                
                // Store exact entry coordinates
                entryPoint.x = e.clientX;
                entryPoint.y = e.clientY;
                
                // Get the position of mouse entry relative to the button center
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Calculate the tilt angle based on entry point (max 15 degrees)
                const maxTilt = 15;
                
                // Calculate tilt angles based on entry edge for more natural feel
                let tiltX, tiltY;
                
                switch(entryEdge) {
                    case 'top':
                        tiltX = -maxTilt;
                        tiltY = x / (rect.width / 2) * (maxTilt / 2);
                        break;
                    case 'bottom':
                        tiltX = maxTilt;
                        tiltY = x / (rect.width / 2) * (maxTilt / 2);
                        break;
                    case 'left':
                        tiltY = maxTilt;
                        tiltX = y / (rect.height / 2) * (maxTilt / 2);
                        break;
                    case 'right':
                        tiltY = -maxTilt;
                        tiltX = y / (rect.height / 2) * (maxTilt / 2);
                        break;
                }
                
                // Create a shadow effect based on tilt direction
                const shadowX = -tiltY * 0.5;
                const shadowY = tiltX * 0.5;
                const shadowBlur = 15;
                const shadowColor = 'rgba(0, 0, 0, 0.3)';
                
                // Apply the tilt effect with transition
                button.style.transition = 'transform 0.2s ease-out, box-shadow 0.2s ease-out';
                button.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
                button.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;
            });
            
            // Mouse move for real-time updates
            button.addEventListener('mousemove', (e) => {
                // Only apply on non-mobile
                if (window.innerWidth <= 768) return;
                
                const rect = button.getBoundingClientRect();
                
                // Get the position of mouse relative to the button center
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Calculate the distance from center as a percentage (0-1)
                const distFromCenterX = Math.abs(x) / (rect.width / 2);
                const distFromCenterY = Math.abs(y) / (rect.height / 2);
                
                // Calculate tilt based on mouse position with maximum 15 degrees
                const maxTilt = 15;
                
                // Normalize coordinates to -1 to 1 range for smooth tilt
                const normalizedX = x / (rect.width / 2);
                const normalizedY = y / (rect.height / 2);
                
                // Calculate tilt based on direction and distance from center
                const tiltY = -normalizedX * maxTilt; // Negative to tilt towards mouse
                const tiltX = normalizedY * maxTilt;
                
                // Create a shadow effect based on tilt direction
                const shadowIntensity = Math.max(distFromCenterX, distFromCenterY) * 0.7;
                const shadowX = -tiltY * shadowIntensity;
                const shadowY = tiltX * shadowIntensity;
                const shadowBlur = 15;
                const shadowColor = 'rgba(0, 0, 0, 0.3)';
                
                // Apply the tilt effect with immediate response
                button.style.transition = '';
                button.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
                button.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;
            });
            
            // Mouse leave for reset
            button.addEventListener('mouseleave', (e) => {
                button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                button.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
                button.style.boxShadow = originalBoxShadow;
            });
        });
    };
    
    // Initialize tilt effect
    setupTiltEffect();
    
    // Re-initialize tilt effect on window resize
    window.addEventListener('resize', () => {
        setupTiltEffect();
    });
    
    // Clone first and last items for the infinite loop effect
    if (projectsContainer && projects.length > 0) {
        // Clone first set of items and add to end
        for (let i = 0; i < 3; i++) {
            const clone = projects[i].cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            projectsContainer.appendChild(clone);
        }
        
        // Clone last set of items and add to beginning
        for (let i = projects.length - 1; i >= projects.length - 3; i--) {
            const clone = projects[i].cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            projectsContainer.insertBefore(clone, projectsContainer.firstChild);
        }
    }
    
    // Setup drag scroll functionality
    const slider = document.querySelector('.slider');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let startX = 0;
    
    // Initial position offset by 3 slides (the cloned ones at the beginning)
    let currentSlide = 3;
    let isTransitioning = false;
    
    const indicator = document.querySelector('.progress-indicator');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    function updateSlider(skipTransition = false) {
        // Update progress indicator - always show value between 0-3 for original slides
        const progressSlide = (currentSlide - 3) % totalOriginalSlides;
        const normalizedSlide = progressSlide < 0 ? totalOriginalSlides + progressSlide : progressSlide;
        
        // Adjust the indicator movement based on screen size
        const isMobileView = window.innerWidth <= 768;
        const maxMove = isMobileView ? 220 : 480;
        const indicatorPosition = (normalizedSlide / (totalOriginalSlides - 1)) * maxMove;
        if (indicator) indicator.style.left = indicatorPosition + 'px';
        
        // Slide the projects
        if (projectsContainer) {
            // Calculate the slide width based on the current viewport
            const slideWidth = projectsContainer.querySelector('.project').offsetWidth + 
                (isMobileView ? 20 : 36); // Smaller gap on mobile
            
            if (skipTransition) {
                projectsContainer.style.transition = 'none';
            } else {
                projectsContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            // Apply the translateX with the right offset
            const translateX = -(currentSlide * slideWidth);
            projectsContainer.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    // Position the carousel to show the first real slide with a small buffer
    function calculateInitialOffset() {
        if (projectsContainer) {
            // Position the carousel to show the first real slide completely
            updateSlider(true);
        }
    }
    
    // Initial position
    calculateInitialOffset();
    
    // Reset transition property after initial positioning
    setTimeout(() => {
        if (projectsContainer) projectsContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 10);
    
    function handleTransitionEnd() {
        // If we've gone too far right (to the clones of the first slides)
        if (currentSlide >= totalOriginalSlides + 3) {
            currentSlide = 3; // Jump back to the real first slides
            updateSlider(true); // Skip transition for the jump
        }
        
        // If we've gone too far left (to the clones of the last slides)
        if (currentSlide <= 2) {
            currentSlide = totalOriginalSlides + 2; // Jump to the real last slides
            updateSlider(true); // Skip transition for the jump
        }
        
        isTransitioning = false;
    }
    
    if (projectsContainer) {
        projectsContainer.addEventListener('transitionend', handleTransitionEnd);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentSlide--;
            updateSlider();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentSlide++;
            updateSlider();
        });
    }
    
    // Drag functionality for projects
    function touchStart(event) {
        if (isTransitioning) return;
        
        // Immediately set transition to none for smoother start
        projectsContainer.style.transition = 'none';
        
        // Add dragging class for visual feedback
        projectsContainer.classList.add('dragging');
        
        // Get touch or mouse position
        const clientX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        startX = clientX;
        isDragging = true;
        startPos = clientX;
        
        // Get current transform value
        const transform = window.getComputedStyle(projectsContainer).getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        prevTranslate = matrix.m41; // Get translateX value from matrix
        
        cancelAnimationFrame(animationID);
        
        // Add events for mouse and touch
        document.addEventListener('mousemove', touchMove);
        document.addEventListener('touchmove', touchMove, { passive: false }); // Changed to false to allow preventDefault
        document.addEventListener('mouseup', touchEnd);
        document.addEventListener('touchend', touchEnd);
        
        // Change cursor and prevent text selection
        slider.style.cursor = 'grabbing';
        slider.style.userSelect = 'none';
        
        // Prevent default to avoid page scroll while dragging on mobile
        if (event.type === 'touchstart') {
            event.preventDefault();
        }
    }
    
    function touchMove(event) {
        if (!isDragging) return;
        
        // Prevent default behavior to avoid scrolling while dragging
        if (event.cancelable) {
            event.preventDefault();
        }
        
        const clientX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        const currentX = clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;
        
        // Use requestAnimationFrame for smoother animation
        animationID = requestAnimationFrame(() => {
            // Apply transform directly for smooth dragging
            projectsContainer.style.transform = `translateX(${currentTranslate}px)`;
        });
    }
    
    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID); // Cancel any ongoing animation
        
        // Remove dragging class
        projectsContainer.classList.remove('dragging');
        
        // Check if we're on mobile or desktop for different gap values
        const isMobileView = window.innerWidth <= 768;
        const gapWidth = isMobileView ? 20 : 36;
        const slideWidth = projectsContainer.querySelector('.project').offsetWidth + gapWidth;
        const moveRatio = (prevTranslate - currentTranslate) / slideWidth;
        
        // Determine if we should move to next/prev slide based on drag distance
        if (Math.abs(moveRatio) > 0.15) { // Lowered threshold for easier slide changes
            if (moveRatio > 0) {
                // Dragged left - go to next slide
                currentSlide++;
            } else {
                // Dragged right - go to prev slide
                currentSlide--;
            }
        }
        
        // Re-enable transitions with a short delay to ensure smooth animation
        setTimeout(() => {
            projectsContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            isTransitioning = true;
            updateSlider();
        }, 10);
        
        // Reset cursor and remove event listeners
        slider.style.cursor = 'grab';
        slider.style.userSelect = '';
        document.removeEventListener('mousemove', touchMove);
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('mouseup', touchEnd);
        document.removeEventListener('touchend', touchEnd);
    }
    
    // Add touch/mouse events to projects container
    if (projectsContainer) {
        projectsContainer.addEventListener('mousedown', touchStart);
        projectsContainer.addEventListener('touchstart', touchStart, { passive: true });
        projectsContainer.style.cursor = 'grab';
    }
    
    // Make progress indicator draggable with intensity detection
    const progressTrack = document.querySelector('.progress-track');
    let isProgressDragging = false;
    let progressStartX = 0;
    let progressStartTime = 0;
    let progressDragDistance = 0;
    
    function handleProgressDrag(e) {
        if (isTransitioning || !progressTrack || !indicator) return;
        
        // Get click/touch position
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const trackRect = progressTrack.getBoundingClientRect();
        const clickPosition = clientX - trackRect.left;
        const trackWidth = trackRect.width;
        const percentage = Math.max(0, Math.min(1, clickPosition / trackWidth));
        
        if (!isProgressDragging) {
            // Start drag
            isProgressDragging = true;
            progressStartX = clientX;
            progressStartTime = Date.now();
            progressDragDistance = 0;
            
            // Add move and end listeners
            document.addEventListener('mousemove', handleProgressDragMove);
            document.addEventListener('touchmove', handleProgressDragMove, { passive: false });
            document.addEventListener('mouseup', handleProgressDragEnd);
            document.addEventListener('touchend', handleProgressDragEnd);
            
            progressTrack.style.cursor = 'grabbing';
        }
    }
    
    function handleProgressDragMove(e) {
        if (!isProgressDragging) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        progressDragDistance = Math.abs(clientX - progressStartX);
        
        // Calculate real-time position and update slider
        const trackRect = progressTrack.getBoundingClientRect();
        const clickPosition = clientX - trackRect.left;
        const trackWidth = trackRect.width;
        const percentage = Math.max(0, Math.min(1, clickPosition / trackWidth));
        
        // Convert percentage to slide index (real-time)
        const targetSlide = Math.round(percentage * (totalOriginalSlides - 1)) + 3;
        
        // Only update if different slide to avoid unnecessary transitions
        if (targetSlide !== currentSlide && targetSlide >= 3 && targetSlide <= totalOriginalSlides + 2) {
            currentSlide = targetSlide;
            updateSlider();
        }
        
        // Prevent default to avoid selection/scrolling during drag
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    
    function handleProgressDragEnd(e) {
        if (!isProgressDragging) return;
        
        isProgressDragging = false;
        
        // Final position has already been set in handleProgressDragMove
        // Just ensure we're at a valid slide position
        if (currentSlide < 3) {
            currentSlide = 3;
            updateSlider();
        } else if (currentSlide > totalOriginalSlides + 2) {
            currentSlide = totalOriginalSlides + 2;
            updateSlider();
        }
        
        // Clean up event listeners
        document.removeEventListener('mousemove', handleProgressDragMove);
        document.removeEventListener('touchmove', handleProgressDragMove);
        document.removeEventListener('mouseup', handleProgressDragEnd);
        document.removeEventListener('touchend', handleProgressDragEnd);
        
        progressTrack.style.cursor = 'grab';
    }
    
    if (progressTrack && indicator) {
        progressTrack.addEventListener('mousedown', handleProgressDrag);
        progressTrack.addEventListener('touchstart', handleProgressDrag, { passive: true });
        progressTrack.style.cursor = 'grab';
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate and update slider with responsive values
        updateSlider(true);
    });
    
    // ========================
    // Testimonials Carousel
    // ========================
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const carouselTrack = document.querySelector('.carousel-track');
    let currentTestimonial = 0;
    let testimonialInterval;
    let isDraggingTestimonial = false;
    let testimonialStartPos = 0;
    let testimonialStartPosY = 0;
    let testimonialCurrentTranslate = 0;
    let testimonialPrevTranslate = 0;
    let testimonialAnimationID = 0;
    let testimonialDragDirection = null; // 'horizontal' or 'vertical'
    
    function showTestimonial(index) {
        // Remove active class from all cards and dots
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current card and dot
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        // Update carousel track position
        if (carouselTrack) {
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        }
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function startTestimonialAutoScroll() {
        // Auto-scroll every 5 seconds
        testimonialInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopTestimonialAutoScroll() {
        clearInterval(testimonialInterval);
    }
    
    // Drag/swipe functions for testimonials
    function testimonialTouchStart(event) {
        if (!carouselTrack) return;
        
        // Stop auto-scroll during drag
        stopTestimonialAutoScroll();
        
        testimonialStartPos = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        testimonialStartPosY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
        isDraggingTestimonial = true;
        
        carouselTrack.style.transition = 'none';
        carouselTrack.style.cursor = 'grabbing';
        
        // Get current transform value
        const transform = window.getComputedStyle(carouselTrack).getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        testimonialPrevTranslate = matrix.m41;
        
        // Add event listeners
        document.addEventListener('mousemove', testimonialTouchMove);
        document.addEventListener('touchmove', testimonialTouchMove, { passive: false });
        document.addEventListener('mouseup', testimonialTouchEnd);
        document.addEventListener('touchend', testimonialTouchEnd);
    }
    
    function testimonialTouchMove(event) {
        if (!isDraggingTestimonial) return;
        
        const currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
        const currentY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
        
        const diffX = Math.abs(currentX - testimonialStartPos);
        const diffY = Math.abs(currentY - testimonialStartPosY);
        
        // Determine drag direction on first significant movement
        if (testimonialDragDirection === null && (diffX > 10 || diffY > 10)) {
            testimonialDragDirection = diffX > diffY ? 'horizontal' : 'vertical';
        }
        
        // Only prevent default and handle testimonial drag if moving horizontally
        if (testimonialDragDirection === 'horizontal') {
            if (event.cancelable) {
                event.preventDefault();
            }
            
            const diff = currentX - testimonialStartPos;
            testimonialCurrentTranslate = testimonialPrevTranslate + diff;
            
            testimonialAnimationID = requestAnimationFrame(() => {
                if (carouselTrack) {
                    carouselTrack.style.transform = `translateX(${testimonialCurrentTranslate}px)`;
                }
            });
        } else if (testimonialDragDirection === 'vertical') {
            // Allow vertical scrolling by not preventing default and ending drag
            testimonialTouchEnd();
        }
    }
    
    function testimonialTouchEnd() {
        if (!isDraggingTestimonial) return;
        
        isDraggingTestimonial = false;
        cancelAnimationFrame(testimonialAnimationID);
        
        // Only handle slide change if we were dragging horizontally
        if (testimonialDragDirection === 'horizontal') {
            // Calculate swipe threshold
            const movedBy = testimonialCurrentTranslate - testimonialPrevTranslate;
            const containerWidth = carouselTrack ? carouselTrack.offsetWidth : 0;
            
            // If moved more than 20% of container width, change slide
            if (Math.abs(movedBy) > containerWidth * 0.2) {
                if (movedBy > 0) {
                    // Swiped right - go to previous
                    prevTestimonial();
                } else {
                    // Swiped left - go to next
                    nextTestimonial();
                }
            } else {
                // Snap back to current slide
                showTestimonial(currentTestimonial);
            }
        }
        
        // Reset drag direction for next interaction
        testimonialDragDirection = null;
        
        // Re-enable transitions and reset cursor
        if (carouselTrack) {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            carouselTrack.style.cursor = 'grab';
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', testimonialTouchMove);
        document.removeEventListener('touchmove', testimonialTouchMove);
        document.removeEventListener('mouseup', testimonialTouchEnd);
        document.removeEventListener('touchend', testimonialTouchEnd);
        
        // Restart auto-scroll after a delay
        setTimeout(() => {
            startTestimonialAutoScroll();
        }, 1000);
    }
    
    // Initialize testimonials carousel if elements exist
    if (testimonialCards.length > 0 && dots.length > 0) {
        // Show first testimonial
        showTestimonial(0);
        
        // Start auto-scrolling
        startTestimonialAutoScroll();
        
        // Add click handlers to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
                
                // Restart auto-scroll timer when user clicks a dot
                stopTestimonialAutoScroll();
                startTestimonialAutoScroll();
            });
        });
        
        // Add drag/swipe functionality
        if (carouselTrack) {
            carouselTrack.addEventListener('mousedown', testimonialTouchStart);
            carouselTrack.addEventListener('touchstart', testimonialTouchStart, { passive: true });
            carouselTrack.style.cursor = 'grab';
            carouselTrack.style.userSelect = 'none';
        }
        
        // Pause auto-scroll on hover
        const testimonialCarousel = document.querySelector('.testimonials-carousel');
        if (testimonialCarousel) {
            testimonialCarousel.addEventListener('mouseenter', stopTestimonialAutoScroll);
            testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoScroll);
        }
    }

    // ========================
    // Header Scroll Effect
    // ========================
    const header = document.querySelector('.primary-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add 'scrolled' class when scrolled down more than 50px
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========================
    // Pricing Tabs
    // ========================
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingContents = document.querySelectorAll('.pricing-content');

    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Add brief loading state for smooth transition
            const container = document.querySelector('.pricing-tabs-container');
            if (container) {
                container.classList.add('loading');
                setTimeout(() => container.classList.remove('loading'), 200);
            }

            // Remove active class from all tabs and contents
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // ========================
    // Scrollable Pricing Tabs Navigation
    // ========================
    
    // Performance: Throttle utility function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Cache DOM elements for better performance
    const pricingTabsContainer = document.querySelector('.pricing-tabs-container');
    const pricingNavLeft = document.querySelector('.pricing-tabs-nav-left');
    const pricingNavRight = document.querySelector('.pricing-tabs-nav-right');
    const pricingTabsWrapper = document.querySelector('.pricing-tabs-wrapper');
    
    if (pricingTabsContainer && pricingNavLeft && pricingNavRight) {
        // Calculate scroll amount (approximately 2-3 tabs width)
        function calculateScrollAmount() {
            const containerWidth = pricingTabsContainer.clientWidth;
            return Math.max(containerWidth * 0.6, 200); // Minimum 200px scroll
        }
        
        // Update arrow states and scroll indicators based on scroll position
        function updateArrowStates() {
            const container = pricingTabsContainer;
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            
            // Left arrow state and scroll indicator
            if (scrollLeft <= 0) {
                pricingNavLeft.disabled = true;
                pricingNavLeft.setAttribute('aria-disabled', 'true');
                container.classList.remove('can-scroll-left');
            } else {
                pricingNavLeft.disabled = false;
                pricingNavLeft.setAttribute('aria-disabled', 'false');
                container.classList.add('can-scroll-left');
            }
            
            // Right arrow state and scroll indicator
            if (scrollLeft >= maxScroll - 1) { // Small buffer for rounding errors
                pricingNavRight.disabled = true;
                pricingNavRight.setAttribute('aria-disabled', 'true');
                container.classList.remove('can-scroll-right');
            } else {
                pricingNavRight.disabled = false;
                pricingNavRight.setAttribute('aria-disabled', 'false');
                container.classList.add('can-scroll-right');
            }
        }
        
        // Scroll left function with enhanced feedback
        function scrollLeft() {
            if (!pricingNavLeft.disabled) {
                // Add visual feedback
                pricingNavLeft.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    pricingNavLeft.style.transform = '';
                }, 150);
                
                const scrollAmount = calculateScrollAmount();
                pricingTabsContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
        
        // Scroll right function with enhanced feedback
        function scrollRight() {
            if (!pricingNavRight.disabled) {
                // Add visual feedback
                pricingNavRight.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    pricingNavRight.style.transform = '';
                }, 150);
                
                const scrollAmount = calculateScrollAmount();
                pricingTabsContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
        
        // Event listeners for arrow buttons
        pricingNavLeft.addEventListener('click', scrollLeft);
        pricingNavRight.addEventListener('click', scrollRight);
        
        // Throttled scroll handler for better performance
        const throttledArrowUpdate = throttle(updateArrowStates, 16); // 60fps (1000/60 ≈ 16ms)
        
        // Update arrow states on scroll with throttling
        pricingTabsContainer.addEventListener('scroll', throttledArrowUpdate, { passive: true });
        
        // Update arrow states on window resize
        window.addEventListener('resize', () => {
            // Debounced resize handler
            clearTimeout(window.pricingTabsResizeTimeout);
            window.pricingTabsResizeTimeout = setTimeout(updateArrowStates, 150);
        });
        
        // Initial update of arrow states
        setTimeout(updateArrowStates, 100); // Small delay to ensure layout is complete
        
        // Keyboard navigation for tabs
        const pricingTabsInner = document.querySelector('.pricing-tabs');
        if (pricingTabsInner) {
            pricingTabsInner.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    
                    const focusedTab = document.activeElement;
                    if (focusedTab && focusedTab.classList.contains('pricing-tab')) {
                        const allTabs = Array.from(pricingTabs);
                        const currentIndex = allTabs.indexOf(focusedTab);
                        
                        let nextIndex;
                        if (e.key === 'ArrowLeft') {
                            nextIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
                        } else {
                            nextIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
                        }
                        
                        const nextTab = allTabs[nextIndex];
                        nextTab.focus();
                        
                        // Ensure the focused tab is visible
                        const tabRect = nextTab.getBoundingClientRect();
                        const containerRect = pricingTabsContainer.getBoundingClientRect();
                        
                        if (tabRect.left < containerRect.left) {
                            // Tab is to the left, scroll left
                            pricingTabsContainer.scrollBy({
                                left: tabRect.left - containerRect.left - 20,
                                behavior: 'smooth'
                            });
                        } else if (tabRect.right > containerRect.right) {
                            // Tab is to the right, scroll right
                            pricingTabsContainer.scrollBy({
                                left: tabRect.right - containerRect.right + 20,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        }
    }

    // ========================
    // Mobile Pricing Dropdown
    // ========================
    const mobileDropdown = document.querySelector('.pricing-tabs-mobile-dropdown');
    const dropdownSelected = document.querySelector('.pricing-dropdown-selected');
    const dropdownOptions = document.querySelector('.pricing-dropdown-options');
    const dropdownItems = document.querySelectorAll('.pricing-dropdown-option');
    
    if (mobileDropdown && dropdownSelected && dropdownOptions) {
        // Toggle dropdown
        function toggleDropdown() {
            const isOpen = dropdownSelected.getAttribute('aria-expanded') === 'true';
            
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
        
        // Open dropdown
        function openDropdown() {
            dropdownSelected.setAttribute('aria-expanded', 'true');
            dropdownOptions.classList.add('show');
            
            // Focus first option
            const firstOption = dropdownOptions.querySelector('.pricing-dropdown-option');
            if (firstOption) {
                setTimeout(() => firstOption.focus(), 100);
            }
        }
        
        // Close dropdown
        function closeDropdown() {
            dropdownSelected.setAttribute('aria-expanded', 'false');
            dropdownOptions.classList.remove('show');
        }
        
        // Select option
        function selectOption(option) {
            const targetTab = option.getAttribute('data-tab');
            const optionText = option.textContent;
            
            // Update selected text
            const selectedText = dropdownSelected.querySelector('.selected-text');
            if (selectedText) {
                selectedText.textContent = optionText;
            }
            
            // Update active states
            dropdownItems.forEach(item => item.classList.remove('active'));
            option.classList.add('active');
            
            // Update tab content (reuse existing logic)
            pricingTabs.forEach(t => t.classList.remove('active'));
            pricingContents.forEach(c => c.classList.remove('active'));
            
            // Find corresponding desktop tab to mark as active
            const correspondingTab = document.querySelector(`.pricing-tab[data-tab="${targetTab}"]`);
            if (correspondingTab) {
                correspondingTab.classList.add('active');
            }
            
            document.getElementById(targetTab).classList.add('active');
            
            closeDropdown();
        }
        
        // Event listeners
        dropdownSelected.addEventListener('click', toggleDropdown);
        
        dropdownItems.forEach(option => {
            option.addEventListener('click', () => selectOption(option));
            
            // Keyboard navigation for dropdown options
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(option);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeDropdown();
                    dropdownSelected.focus();
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const allOptions = Array.from(dropdownItems);
                    const currentIndex = allOptions.indexOf(option);
                    
                    let nextIndex;
                    if (e.key === 'ArrowDown') {
                        nextIndex = currentIndex < allOptions.length - 1 ? currentIndex + 1 : 0;
                    } else {
                        nextIndex = currentIndex > 0 ? currentIndex - 1 : allOptions.length - 1;
                    }
                    
                    allOptions[nextIndex].focus();
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileDropdown.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdownSelected.getAttribute('aria-expanded') === 'true') {
                closeDropdown();
                dropdownSelected.focus();
            }
        });
    }

    // Smooth scroll to pricing section with header offset
    const viewPricingBtn = document.getElementById('view-pricing-btn');
    if (viewPricingBtn) {
        viewPricingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                const headerHeight = 80; // Adjust this value based on your header height
                const sectionTop = pricingSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = sectionTop - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

