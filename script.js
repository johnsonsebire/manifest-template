let currentSlide = 0;
const indicator = document.querySelector('.progress-indicator');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function updateSlider() {
    const maxMove = 480;
    const position = (currentSlide / 3) * maxMove;
    if (indicator) indicator.style.left = position + 'px';
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

updateSlider();
