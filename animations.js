// Enhanced Animation System
class ScrollAnimationController {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.1;
        this.rootMargin = options.rootMargin || '0px 0px -50px 0px';
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            threshold: this.threshold,
            rootMargin: this.rootMargin
        });
        this.animatedElements = new Set();
        this.isMobile = window.innerWidth <= 768;
        this.isTouchDevice = this.detectTouchDevice();
    }
    
    detectTouchDevice() {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            window.matchMedia('(hover: none) and (pointer: coarse)').matches
        );
    }
    
    observe(element, animationType) {
        element.dataset.animation = animationType;
        element.classList.add('animate-on-scroll');
        this.observer.observe(element);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                // Check for reduced motion preference
                const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                if (reducedMotion) {
                    // Apply immediate visibility without animation
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                } else {
                    this.triggerAnimation(entry.target);
                }
                
                this.animatedElements.add(entry.target);
            }
        });
    }
    
    triggerAnimation(element) {
        const animationType = element.dataset.animation;
        element.classList.add('animate-in', `animate-${animationType}`);
        
        // Apply mobile-specific animation optimizations
        if (this.isMobile || this.isTouchDevice) {
            element.style.animationDuration = '0.4s';
            element.style.transitionDuration = '0.4s';
        }
        
        // Add staggered animation for child elements
        const children = element.querySelectorAll('[data-stagger]');
        children.forEach((child, index) => {
            const delay = index * (this.isMobile ? 50 : 100); // Faster stagger on mobile
            child.style.animationDelay = `${delay}ms`;
            child.classList.add('animate-in', 'animate-stagger');
        });
    }
    
    // Initialize animations for elements already in viewport
    initializeVisibleElements() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            if (this.isElementInViewport(element)) {
                this.triggerAnimation(element);
                this.animatedElements.add(element);
            }
        });
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // More generous viewport detection for mobile
        const threshold = this.isMobile ? 0.1 : 0.2;
        
        return (
            rect.top < viewportHeight * (1 - threshold) &&
            rect.bottom > viewportHeight * threshold &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Update mobile state on resize
    updateMobileState() {
        this.isMobile = window.innerWidth <= 768;
        this.isTouchDevice = this.detectTouchDevice();
        
        // Update observer settings for mobile
        if (this.isMobile) {
            this.observer.disconnect();
            this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                threshold: 0.05, // Lower threshold for mobile
                rootMargin: '0px 0px -20px 0px' // Smaller margin for mobile
            });
            
            // Re-observe all elements
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(element => {
                this.observer.observe(element);
            });
        }
    }
}

// Initialize animation system
const animationController = new ScrollAnimationController({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Listen for resize events to update mobile state
window.addEventListener('resize', () => {
    animationController.updateMobileState();
});

// Export for use in main script
window.ScrollAnimationController = ScrollAnimationController;
window.animationController = animationController;