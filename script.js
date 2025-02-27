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
    let scale = 1;

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

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(currentIndex);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    }

    slidesContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slidesContainer.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            nextSlide();
        } else if (startX - endX < -50) {
            prevSlide();
        }
    });

    slidesContainer.addEventListener("wheel", (e) => {
        if (e.deltaY > 0) {
            scale -= 0.1;
        } else {
            scale += 0.1;
        }
        scale = Math.max(0.5, Math.min(2, scale));
        document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale})`;
    });

    slidesContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("slide")) {
            if (scale === 1) {
                scale = 2;
            } else {
                scale = 1;
            }
            document.querySelector(".slide.active").style.transform = `translateX(0) scale(${scale})`;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "ArrowRight") {
            nextSlide();
        }
    });

    loadImages();
    showSlide(currentIndex);
});
