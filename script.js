document.addEventListener('DOMContentLoaded', () => {
    // Setup infinite carousel
    const projectsContainer = document.querySelector('.projects');
    const projects = document.querySelectorAll('.project');
    const totalOriginalSlides = projects.length;
    
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
        
        const maxMove = 480;
        const indicatorPosition = (normalizedSlide / (totalOriginalSlides - 1)) * maxMove;
        if (indicator) indicator.style.left = indicatorPosition + 'px';
        
        // Slide the projects
        if (projectsContainer) {
            const slideWidth = projectsContainer.querySelector('.project').offsetWidth + 36; // card width + gap
            
            if (skipTransition) {
                projectsContainer.style.transition = 'none';
            } else {
                projectsContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            const translateX = -(currentSlide * slideWidth);
            projectsContainer.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    // Initial position
    updateSlider(true);
    
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
    
    // Handle window resize
    window.addEventListener('resize', () => updateSlider(true));
});


