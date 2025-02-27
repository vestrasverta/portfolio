const images = [
  "images/project1-desktop-high.jpg",
  "images/project1-desktop-low.jpg",
  "images/project2-desktop-high.jpg",
  "images/project2-desktop-low.jpg",
  "images/project3-desktop-high.jpg",
  "images/project3-desktop-low.jpg"
];

const slidesContainer = document.getElementById("slides-container");
const dotsContainer = document.getElementById("dots-container");
let currentIndex = 0;

images.forEach((imgSrc, index) => {
  const slide = document.createElement("div");
  slide.classList.add("slide");
  const img = document.createElement("img");
  img.src = imgSrc;
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

showImage(currentIndex);
