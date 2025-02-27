const pages = document.querySelectorAll('.page');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentPage = 0;

// Показываем первую страницу
showPage(currentPage);

function showPage(index) {
    pages.forEach(page => page.classList.remove('active'));
    pages[index].classList.add('active');
}

// Листание вперед
nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
    }
});

// Листание назад
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
});

// Свайпы для мобилок
let touchStartX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentPage < pages.length - 1) {
            currentPage++;
        } else if (deltaX < 0 && currentPage > 0) {
            currentPage--;
        }
        showPage(currentPage);
    }
});