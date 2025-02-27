class Gallery {
    constructor() {
        this.container = document.querySelector('.slides-container');
        this.thumbnails = document.querySelector('.thumbnails');
        this.images = [
            { full: 'images/desktop/project1-desktop-high.jpg', thumb: 'images/desktop/project1-desktop-low.jpg' },
            { full: 'images/desktop/project2-desktop-high.jpg', thumb: 'images/desktop/project2-desktop-low.jpg' },
            { full: 'images/desktop/project3-desktop-high.jpg', thumb: 'images/desktop/project3-desktop-low.jpg' }
        ];
        
        this.currentIndex = 0;
        this.scale = 1;
        this.pos = { x: 0, y: 0 };
        this.isDragging = false;
        this.startPos = { x: 0, y: 0 };
        this.touchStartX = 0;

        this.init();
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
            imgElement.dataset.index = index;
            
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
        // Reset zoom and position for current slide
        const currentSlide = this.getCurrentSlide();
        currentSlide.style.transform = `scale(1) translate(0, 0)`;
        
        // Update current index
        this.currentIndex = index;
        this.scale = 1;
        this.pos = { x: 0, y: 0 };
        
        // Update classes
        document.querySelectorAll('.slide').forEach(slide => 
            slide.classList.remove('active'));
        document.querySelectorAll('.thumbnail').forEach(thumb => 
            thumb.classList.remove('active'));
        
        this.getCurrentSlide().classList.add('active');
        this.thumbnails.children[index].classList.add('active');
    }

    getCurrentSlide() {
        return this.container.children[this.currentIndex];
    }

    handleZoom(event) {
        if (event.deltaY < 0) {
            this.scale = Math.min(3, this.scale + 0.1);
        } else {
            this.scale = Math.max(1, this.scale - 0.1);
        }
        
        const slide = this.getCurrentSlide();
        slide.style.transform = `scale(${this.scale}) translate(${this.pos.x}px, ${this.pos.y}px)`;
    }

    handleDragStart(event) {
        if (this.scale <= 1) return;
        
        this.isDragging = true;
        this.startPos = {
            x: event.clientX || event.touches[0].clientX,
            y: event.clientY || event.touches[0].clientY
        };
    }

    handleDragMove(event) {
        if (!this.isDragging || this.scale <= 1) return;
        
        const currentX = event.clientX || event.touches[0].clientX;
        const currentY = event.clientY || event.touches[0].clientY;
        
        this.pos.x += (currentX - this.startPos.x) / this.scale;
        this.pos.y += (currentY - this.startPos.y) / this.scale;
        
        this.startPos = { x: currentX, y: currentY };
        
        const slide = this.getCurrentSlide();
        slide.style.transform = `scale(${this.scale}) translate(${this.pos.x}px, ${this.pos.y}px)`;
    }

    handleDragEnd() {
        this.isDragging = false;
    }

    handleSwipeStart(event) {
        this.touchStartX = event.touches[0].clientX;
    }

    handleSwipeMove(event) {
        if (this.scale > 1) return;
        
        const touchEndX = event.touches[0].clientX;
        const deltaX = touchEndX - this.touchStartX;
        
        const slide = this.getCurrentSlide();
        slide.style.transform = `translateX(${deltaX}px)`;
    }

    handleSwipeEnd(event) {
        if (this.scale > 1) return;
        
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - this.touchStartX;
        
        if (Math.abs(deltaX) > 50) {
            deltaX > 0 ? this.showPrevSlide() : this.showNextSlide();
        }
        
        this.getCurrentSlide().style.transform = 'translateX(0)';
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
        // Mouse events
        this.container.addEventListener('wheel', (e) => this.handleZoom(e));
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.handleDragStart(e);
            this.handleSwipeStart(e);
        });
        this.container.addEventListener('touchmove', (e) => {
            this.handleDragMove(e);
            this.handleSwipeMove(e);
        });
        this.container.addEventListener('touchend', (e) => {
            this.handleDragEnd();
            this.handleSwipeEnd(e);
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.showPrevSlide();
            if (e.key === 'ArrowRight') this.showNextSlide();
        });
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => new Gallery());