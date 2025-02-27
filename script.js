document.addEventListener("DOMContentLoaded", function () {
    const slidesContainer = document.querySelector(".slides");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const dotsContainer = document.querySelector(".dots");
    const loader = document.querySelector(".loader");

    const images = [
        "images/desktop/project1-desktop-high.jpg",
        "images/desktop/project2-desktop-high.jpg",
        "images/desktop/project3-desktop-high.jpg"
    ];

    let currentIndex = 0;

    function loadImages() {
        images.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.classList.add("slide");
            if (index === 0) img.classList.add("active");
            slidesContainer.appendChild(img);

            const dot = document.createElement("span");
            dot.dataset.index = index;
            dot.addEventListener("click", function () {
                showSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        loader.style.display = "none";
        updateDots();
    }

    function showSlide(index) {
        currentIndex = index;
        const offset = -index * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function updateDots() {
        document.querySelectorAll(".dots span").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    prevBtn.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showSlide(currentIndex);
    });

    nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide(currentIndex);
    });

    loadImages();
});
