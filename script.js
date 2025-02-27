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
        document.querySelectorAll('.slide').forEach(slide => 
            slide.classList.remove('active'));
        document.querySelectorAll('.thumbnail').forEach(thumb => 
            thumb.classList.remove('active'));
        
        this.currentIndex = index;
        this.scale = 1;
        this.pos = { x: 0, y: 0 };
        
        this.container.children[index].classList.add('active');
        this.thumbnails.children[index].classList.add('active');
    }

    handleZoom(e) {
        if (e.deltaY < 0) {
            this.scale = Math.min(3, this.scale + 0.1);
        } else {
            this.scale = Math.max(1, this.scale - 0.1);
        }
        
        const img = this.container.querySelector('.active .slide-image');
        img.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
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
        
        this.pos.x += (currentX - this.startPos.x)/this.scale;
        this.pos.y += (currentY - this.startPos.y)/this.scale;
        this.startPos = { x: currentX, y: currentY };
        
        const img = this.container.querySelector('.active .slide-image');
        img.style.transform = `translate(calc(-50% + ${this.pos.x}px), calc(-50% + ${this.pos.y}px)) scale(${this.scale})`;
    }

    handleDragEnd() {
        this.isDragging = false;
    }

    handleSwipeStart(e) {
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

    showNextSlide() {
        const newIndex = (this.currentIndex + 1) % this.images.length;
        this.showSlide(newIndex);
    }

    showPrevSlide() {
        const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showSlide(newIndex);
    }

    addEventListeners() {
        this.container.addEventListener('wheel', (e) => this.handleZoom(e));
        
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
    }
}

document.addEventListener('DOMContentLoaded', () => new Gallery());