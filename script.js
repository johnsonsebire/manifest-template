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
            
            // Mouse enter event for tracking entry point
            button.addEventListener('mouseenter', (e) => {
                // Only apply on non-mobile
                if (window.innerWidth <= 768) return;
                
                // Get the position of mouse entry relative to the button center
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Calculate the tilt angle based on entry point (max 10 degrees)
                const tiltX = y / rect.height * 10;
                const tiltY = -x / rect.width * 10;
                
                // Apply the tilt effect with transition
                button.style.transition = 'transform 0.1s ease-out';
                button.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
            });
            
            // Mouse move for real-time updates
            button.addEventListener('mousemove', (e) => {
                // Only apply on non-mobile
                if (window.innerWidth <= 768) return;
                
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Calculate the tilt angle based on mouse position (max 10 degrees)
                const tiltX = y / rect.height * 10;
                const tiltY = -x / rect.width * 10;
                
                // Apply the tilt effect
                button.style.transition = '';
                button.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
            });
            
            // Mouse leave for reset
            button.addEventListener('mouseleave', () => {
                button.style.transition = 'transform 0.3s ease';
                button.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
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
    
    // Make progress indicator draggable too
    const progressTrack = document.querySelector('.progress-track');
    if (progressTrack && indicator) {
        progressTrack.addEventListener('mousedown', (e) => {
            if (isTransitioning) return;
            
            // Calculate position in track as percentage
            const trackRect = progressTrack.getBoundingClientRect();
            const clickPosition = e.clientX - trackRect.left;
            const trackWidth = trackRect.width;
            const percentage = Math.max(0, Math.min(1, clickPosition / trackWidth));
            
            // Calculate slide to go to
            const targetSlide = Math.round(percentage * (totalOriginalSlides - 1)) + 3;
            
            if (targetSlide !== currentSlide) {
                isTransitioning = true;
                currentSlide = targetSlide;
                updateSlider();
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate and update slider with responsive values
        updateSlider(true);
    });
});


