class Gallery {
    constructor() {
        this.container = document.querySelector('.slides-container');
        this.thumbnails = document.querySelector('.thumbnails');
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        this.images = this.getImagePaths();
        this.currentIndex = 0;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
        this.startPos = { x: 0, y: 0 };
        this.touchStartX = 0;

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
        this.showSlide(0);
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

    showSlide(index) {
        if (index === this.currentIndex) return;

        const prevSlide = this.container.children[this.currentIndex];
        const newSlide = this.container.children[index];
        
        prevSlide.classList.remove('active');
        newSlide.classList.add('active');
        
        this.currentIndex = index;
        this.updateThumbnails();
        this.resetImageTransform();
    }

    updateThumbnails() {
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    resetImageTransform() {
        const img = this.getCurrentImage();
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        img.style.transform = `translate(-50%, -50%) scale(1)`;
    }

    getCurrentImage() {
        return this.container.querySelector('.active .slide-image');
    }

    handleZoom(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.scale = Math.min(3, Math.max(1, this.scale + delta));
        this.updateImageTransform();
    }

    handleDragStart(e) {
        if (this.scale <= 1) return;
        
        this.isDragging = true;
        this.startPos = {
            x: e.clientX || e.touches[0].clientX,
            y: e.clientY || e.touches[0].clientY
        };
    }

    handleDragMove(e) {
        if (!this.isDragging || this.scale <= 1) return;
        
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;
        
        this.offset.x += (currentX - this.startPos.x) / this.scale;
        this.offset.y += (currentY - this.startPos.y) / this.scale;
        this.startPos = { x: currentX, y: currentY };
        
        this.updateImageTransform();
    }

    handleDragEnd() {
        this.isDragging = false;
    }

    handleSwipeStart(e) {
        if (this.scale > 1) return;
        this.touchStartX = e.touches[0].clientX;
    }

    handleSwipeEnd(e) {
        if (this.scale > 1) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - this.touchStartX;
        
        if (Math.abs(deltaX) > 50) {
            deltaX > 0 ? this.showPrevSlide() : this.showNextSlide();
        }
    }

    updateImageTransform() {
        const img = this.getCurrentImage();
        img.style.transform = `
            translate(calc(-50% + ${this.offset.x}px), calc(-50% + ${this.offset.y}px))
            scale(${this.scale})
        `;
    }

    showNextSlide() {
        const newIndex = (this.currentIndex + 1) % this.images.length;
        this.showSlide(newIndex);
    }

    showPrevSlide() {
        const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showSlide(newIndex);
    }

    addEventListeners() {
        // Zoom
        this.container.addEventListener('wheel', (e) => this.handleZoom(e), { passive: false });
        
        // Desktop drag
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());
        
        // Mobile swipe
        this.container.addEventListener('touchstart', (e) => {
            this.handleDragStart(e);
            this.handleSwipeStart(e);
        });
        this.container.addEventListener('touchmove', (e) => this.handleDragMove(e));
        this.container.addEventListener('touchend', (e) => {
            this.handleDragEnd();
            this.handleSwipeEnd(e);
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.showPrevSlide();
            if (e.key === 'ArrowRight') this.showNextSlide();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Gallery());