document.addEventListener("DOMContentLoaded", function () {
  const images = {
    desktop: [
      "images/desktop/project1-desktop-high.jpg",
      "images/desktop/project2-desktop-high.jpg",
      "images/desktop/project3-desktop-high.jpg"
    ],
    mobile: [
      "images/mobile/project1-mobile-high.jpg",
      "images/mobile/project2-mobile-high.jpg",
      "images/mobile/project3-mobile-high.jpg"
    ]
  };

  const isMobile = window.innerWidth <= 768;
  const selectedImages = isMobile ? images.mobile : images.desktop;
  const slidesContainer = document.getElementById("slides-container");
  const dotsContainer = document.getElementById("dots-container");
  let currentIndex = 0;

  selectedImages.forEach((imgSrc, index) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    const img = document.createElement("img");
    img.src = imgSrc;
    img.addEventListener("dblclick", () => toggleZoom(img));
    slide.appendChild(img);
    slidesContainer.appendChild(slide);

    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.addEventListener("click", () => showImage(index));
    dotsContainer.appendChild(dot);
  });

  function showImage(index) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }
    slides.forEach(slide => (slide.style.display = "none"));
    dots.forEach(dot => dot.classList.remove("active"));
    slides[currentIndex].style.display = "block";
    dots[currentIndex].classList.add("active");
  }

  function toggleZoom(img) {
    if (img.classList.contains("zoomed")) {
      img.classList.remove("zoomed");
    } else {
      img.classList.add("zoomed");
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    } else if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }
  });

  // Можно добавить обработку свайпов для мобильных устройств
  let startX = null;
  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  document.addEventListener("touchend", (e) => {
    if (startX === null) return;
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      showImage(currentIndex + 1);
    } else if (endX - startX > 50) {
      showImage(currentIndex - 1);
    }
    startX = null;
  });

  showImage(currentIndex);
});
