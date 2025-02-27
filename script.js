class Gallery {
  constructor() {
    this.container = document.querySelector('.slides-container');
    this.thumbnails = document.querySelector('.thumbnails');
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.images = this.getImagePaths();
    this.currentIndex = 0;
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.startPos = { x: 0, y: 0 };
    this.isDragging = false;
    this.touchStartX = 0;
    this.animationInProgress = false;
    this.init();
  }

  getImagePaths() {
    const device = this.isMobile ? 'mobile' : 'desktop';
    return [
      { 
        full: `images/${device}/high/project1-${device}-high.jpg`, 
        thumb: `images/${device}/low/project1-${device}-low.jpg` 
      },
      { 
        full: `images/${device}/high/project2-${device}-high.jpg`, 
        thumb: `images/${device}/low/project2-${device}-low.jpg` 
      },
      { 
        full: `images/${device}/high/project3-${device}-high.jpg`, 
        thumb: `images/${device}/low/project3-${device}-low.jpg` 
      }
    ];
  }

  init() {
    this.createSlides();
    this.createThumbnails();
    this.addEventListeners();
    this.showSlide(0, true);
  }

  createSlides() {
    this.images.forEach((img, index) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const imgElement = new Image();
      imgElement.src = img.full;
      imgElement.className = 'slide-image';
      slide.appendChild(imgElement);
      this.container.appendChild(slide);
    });
  }

  createThumbnails() {
    this.images.forEach((img, index) => {
      const thumb = new Image();
      thumb.src = img.thumb;
      thumb.className = 'thumbnail';
      thumb.addEventListener('click', () => this.showSlide(index));
      this.thumbnails.appendChild(thumb);
    });
  }

  showSlide(index, initial = false) {
    if (initial) {
      const slide = this.container.children[index];
      slide.classList.add('active');
      slide.style.transform = 'translateX(0)';
      slide.style.zIndex = 2;
      slide.style.visibility = 'visible';
      this.currentIndex = index;
      this.updateThumbnails();
      return;
    }
    if (this.animationInProgress || index === this.currentIndex) return;
    this.animationInProgress = true;
    const currentSlide = this.container.children[this.currentIndex];
    const newSlide = this.container.children[index];
    // Обеспечим, чтобы оба слайда были видимы во время анимации
    currentSlide.style.visibility = 'visible';
    newSlide.style.visibility = 'visible';
    // Определяем направление перехода:
    // если перелистываем вперед – новое слайд справа, иначе – слева.
    const forward = (index > this.currentIndex) || (this.currentIndex === this.images.length - 1 && index === 0);
    
    // Подготовка: сброс переходов
    currentSlide.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    newSlide.style.transition = 'none';
    newSlide.style.transform = forward ? 'translateX(100%)' : 'translateX(-100%)';
    newSlide.style.zIndex = 2;
    currentSlide.style.zIndex = 1;
    // Принудительный рефлоу
    newSlide.offsetWidth;
    // Запуск анимации
    newSlide.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    newSlide.classList.add('active');
    newSlide.style.transform = 'translateX(0)';
    currentSlide.style.transform = forward ? 'translateX(-100%)' : 'translateX(100%)';
    
    newSlide.addEventListener('transitionend', () => {
      currentSlide.classList.remove('active');
      currentSlide.style.transition = '';
      currentSlide.style.transform = '';
      // Скрываем предыдущий слайд, чтобы он не был виден на заднем плане
      currentSlide.style.visibility = 'hidden';
      newSlide.style.transition = '';
      newSlide.style.transform = '';
      this.currentIndex = index;
      this.updateThumbnails();
      this.resetImageTransform();
      this.animationInProgress = false;
    }, { once: true });
  }

  updateThumbnails() {
    document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === this.currentIndex);
    });
  }

  resetImageTransform() {
    const img = this.container.querySelector('.active .slide-image');
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    if (img) img.style.transform = `translate(0, 0) scale(1)`;
  }

  handleZoom(e) {
    e.preventDefault();
    const img = this.container.querySelector('.active .slide-image');
    const rect = img.getBoundingClientRect();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const prevScale = this.scale;
    let newScale = Math.min(3, Math.max(1, this.scale + delta));
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    const scaleFactor = newScale / prevScale;
    this.offset.x = this.offset.x - (centerX - this.offset.x) * (scaleFactor - 1);
    this.offset.y = this.offset.y - (centerY - this.offset.y) * (scaleFactor - 1);
    this.scale = newScale;
    img.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
  }

  handleDragStart(e) {
    if (this.scale <= 1 || (e.button !== undefined && e.button === 2)) return;
    this.isDragging = true;
    this.startPos = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
    e.preventDefault();
  }

  handleDragMove(e) {
    if (!this.isDragging || this.scale <= 1) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const currentY = e.clientY || e.touches[0].clientY;
    this.offset.x += (currentX - this.startPos.x) / this.scale;
    this.offset.y += (currentY - this.startPos.y) / this.scale;
    this.startPos = { x: currentX, y: currentY };
    const img = this.container.querySelector('.active .slide-image');
    img.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px) scale(${this.scale})`;
  }

  handleDragEnd() {
    this.isDragging = false;
  }

  handleSwipeStart(e) {
    if (this.scale > 1) return;
    this.touchStartX = e.touches[0].clientX;
  }

  handleSwipeEnd(e) {
    if (this.scale > 1 || this.animationInProgress) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > 50) {
      deltaX > 0 ? this.showPrevSlide() : this.showNextSlide();
    }
  }

  addEventListeners() {
    this.container.addEventListener('wheel', (e) => this.handleZoom(e), { passive: false });
    this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
    document.addEventListener('mousemove', (e) => this.handleDragMove(e));
    document.addEventListener('mouseup', () => this.handleDragEnd());
    this.container.addEventListener('touchstart', (e) => {
      this.handleDragStart(e);
      this.handleSwipeStart(e);
    });
    this.container.addEventListener('touchmove', (e) => this.handleDragMove(e));
    this.container.addEventListener('touchend', (e) => {
      this.handleDragEnd();
      this.handleSwipeEnd(e);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.showPrevSlide();
      if (e.key === 'ArrowRight') this.showNextSlide();
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  showNextSlide() {
    const newIndex = (this.currentIndex + 1) % this.images.length;
    this.showSlide(newIndex);
  }

  showPrevSlide() {
    const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.showSlide(newIndex);
  }
}

document.addEventListener('DOMContentLoaded', () => new Gallery());
