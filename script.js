document.addEventListener("DOMContentLoaded", function () {
    const slidesContainer = document.querySelector(".slides");
    const thumbnailsContainer = document.querySelector(".thumbnails");

    if (!slidesContainer || !thumbnailsContainer) {
        console.error('Контейнеры для слайдов или миниатюр не найдены');
        return;
    }

    const images = [
        { full: "images/desktop/project1-desktop-high.jpg", thumb: "images/desktop/project1-desktop-low.jpg" },
        { full: "images/desktop/project2-desktop-high.jpg", thumb: "images/desktop/project2-desktop-low.jpg" },
        { full: "images/desktop/project3-desktop-high.jpg", thumb: "images/desktop/project3-desktop-low.jpg" }
    ];

    let currentIndex = 0;
    let startX = 0;

    function loadImages() {
        images.forEach((imgData, index) => {
            const img = new Image();
            img.src = imgData.full;
            img.classList.add("slide");
            if (index === 0) img.classList.add("active");
            slidesContainer.appendChild(img);

            const thumb = new Image();
            thumb.src = imgData.thumb;
            thumb.classList.add("thumbnail");
            if (index === 0) thumb.classList.add("active");
            thumb.addEventListener("click", () => showSlide(index));
            thumbnailsContainer.appendChild(thumb);
        });
    }

    function showSlide(index) {
        document.querySelectorAll(".slide").forEach((img, i) => {
            img.style.transform = `translateX(${(i - index) * 100}%)`;
        });

        document.querySelectorAll(".thumbnail").forEach((thumb, i) => {
            thumb.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    slidesContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slidesContainer.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            currentIndex = (currentIndex + 1) % images.length;
        } else if (startX - endX < -50) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
        }
        showSlide(currentIndex);
    });

    loadImages();
    showSlide(currentIndex);
});
