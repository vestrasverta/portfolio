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
    let startY = 0;
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isZoomed = false;

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
        scale = 1;
        translateX = 0;
        translateY = 0;
        isZoomed = false;
        document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    slidesContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    slidesContainer.addEventListener("touchmove", (e) => {
        if (isZoomed) {
            translateX += e.touches[0].clientX - startX;
            translateY += e.touches[0].clientY - startY;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });

    slidesContainer.addEventListener("touchend", (e) => {
        if (!isZoomed) {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                showNextSlide();
            } else if (startX - endX < -50) {
                showPrevSlide();
            }
        }
    });

    slidesContainer.addEventListener("wheel", (e) => {
        if (e.deltaY > 0) {
            scale -= 0.1;
        } else {
            scale += 0.1;
        }
        scale = Math.max(1, Math.min(2, scale));
        isZoomed = scale > 1;
        document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    });

    slidesContainer.addEventListener("mousemove", (e) => {
        if (isZoomed) {
            translateX += e.movementX;
            translateY += e.movementY;
            document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            if (isZoomed) {
                translateX -= 10;
                document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            } else {
                showPrevSlide();
            }
        } else if (e.key === "ArrowRight") {
            if (isZoomed) {
                translateX += 10;
                document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            } else {
                showNextSlide();
            }
        }
    });

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(currentIndex);
    }

    loadImages();
    showSlide(currentIndex);
});
