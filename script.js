// Конфигурация
const projects = [
    {
        name: 'project1',
        alt: 'Жилой комплекс "Вертикаль" (2023)'
    },
    {
        name: 'project2',
        alt: 'Бизнес-центр "Горизонт" (2024)'
    }
];

// Инициализация
let currentSlide = 0;
const gallery = document.querySelector('.gallery-container');
const dotsContainer = document.querySelector('.dots-container');
const loader = document.querySelector('.loader');

// Создание навигационных точек
projects.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dotsContainer.appendChild(dot);
});

// Определение типа устройства
function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}

// Получение URL изображения
function getImageUrl(projectName) {
    const device = isMobile() ? 'mobile' : 'desktop';
    return `images/${device}/low/${projectName}-${device}-low.webp`;
}

// Загрузка высокого качества
function loadHighQuality(imageElement) {
    const project = imageElement.dataset.project;
    const device = isMobile() ? 'mobile' : 'desktop';
    const highRes = new Image();
    
    highRes.src = `images/${device}/high/${project}-${device}-high.webp`;
    highRes.onload = () => {
        imageElement.src = highRes.src;
        imageElement.removeAttribute('loading');
    };
}

// Переключение слайдов
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const images = document.querySelectorAll('.gallery-image');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (index + projects.length) % projects.length;
    
    if(!images[currentSlide].src) {
        images[currentSlide].src = getImageUrl(projects[currentSlide].name);
        images[currentSlide].loading = 'lazy';
    }
    
    loadHighQuality(images[currentSlide]);
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Обработчики событий
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
});

let touchStartX = 0;
gallery.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});

gallery.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;
    
    if (Math.abs(delta) > 50) {
        delta > 0 ? showSlide(currentSlide + 1) : showSlide(currentSlide - 1);
    }
});

// Зум изображения
document.querySelectorAll('.gallery-image').forEach(img => {
    img.addEventListener('click', () => {
        img.classList.toggle('zoomed');
    });
});

// Инициализация
window.onload = () => {
    // Загружаем первое изображение
    const firstImage = document.querySelector('.gallery-image');
    firstImage.src = getImageUrl(projects[0].name);
    loadHighQuality(firstImage);
    
    // Скрываем лоадер
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
};