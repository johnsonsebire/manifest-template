let currentSlide = 0;
const indicator = document.querySelector('.progress-indicator');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const projectsContainer = document.querySelector('.projects');
const totalSlides = 4;

function updateSlider() {
    // Update progress indicator
    const maxMove = 480;
    const indicatorPosition = (currentSlide / 3) * maxMove;
    if (indicator) indicator.style.left = indicatorPosition + 'px';
    
    // Slide the projects one at a time
    if (projectsContainer) {
        const firstProject = projectsContainer.querySelector('.project');
        if (firstProject) {
            const slideWidth = firstProject.offsetWidth + 36; // card width + gap
            const translateX = -(currentSlide * slideWidth);
            projectsContainer.style.transform = `translateX(${translateX}px)`;
        }
    }
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : 3;
        updateSlider();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentSlide = currentSlide < 3 ? currentSlide + 1 : 0;
        updateSlider();
    });
}

// Initialize on load and window resize
updateSlider();
window.addEventListener('resize', updateSlider);


