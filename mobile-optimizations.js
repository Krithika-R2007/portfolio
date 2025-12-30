/**
 * Mobile Optimization System
 * Handles mobile-specific animation optimizations, touch-friendly interactions,
 * and performance enhancements for mobile devices
 */

class MobileOptimizer {
    constructor(options = {}) {
        this.options = {
            mobileBreakpoint: 768,
            tabletBreakpoint: 992,
            touchThreshold: 10, // pixels
            animationThrottleMs: 16, // ~60fps
            reducedAnimationDuration: 0.3, // seconds
            ...options
        };
        
        this.isMobile = false;
        this.isTablet = false;
        this.isTouchDevice = false;
        this.lastScrollTime = 0;
        this.scrollThrottle = null;
        this.resizeThrottle = null;
        
        this.init();
    }
    
    init() {
        this.detectDeviceType();
        this.setupEventListeners();
        this.optimizeAnimations();
        this.setupTouchInteractions();
        this.optimizeMobileScrollAnimations();
    }
    
    detectDeviceType() {
        // Detect mobile viewport
        this.isMobile = window.innerWidth <= this.options.mobileBreakpoint;
        this.isTablet = window.innerWidth <= this.options.tabletBreakpoint && !this.isMobile;
        
        // Detect touch device capabilities
        this.isTouchDevice = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0 ||
            window.matchMedia('(hover: none) and (pointer: coarse)').matches
        );
        
        // Update body classes for CSS targeting
        document.body.classList.toggle('mobile-device', this.isMobile);
        document.body.classList.toggle('tablet-device', this.isTablet);
        document.body.classList.toggle('touch-device', this.isTouchDevice);
        
        console.log('Device detection:', {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isTouchDevice: this.isTouchDevice,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }
    
    setupEventListeners() {
        // Throttled resize handler
        window.addEventListener('resize', this.throttle(() => {
            this.detectDeviceType();
            this.optimizeAnimations();
        }, 250));
        
        // Optimized scroll handler for mobile
        if (this.isMobile || this.isTouchDevice) {
            window.addEventListener('scroll', this.throttle(() => {
                this.handleMobileScroll();
            }, this.options.animationThrottleMs), { passive: true });
        }
        
        // Touch event handlers for mobile interactions
        if (this.isTouchDevice) {
            this.setupTouchEventHandlers();
        }
    }
    
    optimizeAnimations() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.isMobile || reducedMotion) {
            // Reduce animation complexity on mobile
            this.applyMobileAnimationOptimizations();
        }
        
        // Optimize particle system for mobile
        if (window.particleSystem) {
            this.optimizeParticleSystem();
        }
        
        // Optimize scroll animations for mobile viewports
        if (window.animationController) {
            this.optimizeMobileScrollAnimations();
        }
    }
    
    applyMobileAnimationOptimizations() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const style = document.createElement('style');
        style.id = 'mobile-animation-optimizations';
        
        // Remove existing mobile optimization styles if they exist
        const existingStyle = document.getElementById('mobile-animation-optimizations');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.textContent = `
            /* Mobile Animation Optimizations - Requirement 10.1 */
            @media (max-width: ${this.options.mobileBreakpoint}px) {
                /* Optimize animations for touch devices */
                *, *::before, *::after {
                    animation-duration: ${this.options.reducedAnimationDuration}s !important;
                    transition-duration: ${this.options.reducedAnimationDuration}s !important;
                    /* Use hardware acceleration for better performance */
                    transform: translateZ(0);
                    will-change: transform, opacity;
                }
                
                /* Optimize transforms for mobile performance */
                .project-card:hover,
                .skill-tag:hover,
                .btn:hover {
                    transform: translateY(-4px) !important;
                }
                
                /* Reduce particle count and complexity for 60fps performance */
                .cursor-trail {
                    display: none !important;
                }
                
                /* Optimize scroll animations for mobile viewports */
                .animate-on-scroll {
                    transition-duration: 0.4s !important;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                
                /* Reduce shadow complexity for better performance */
                .project-card:hover,
                .btn:hover {
                    box-shadow: 
                        0 0 15px rgba(139, 92, 246, 0.3),
                        0 0 30px rgba(139, 92, 246, 0.15),
                        0 8px 16px rgba(107, 33, 168, 0.2) !important;
                }
                
                /* Optimize hero animations for mobile */
                .hero-text h1,
                .hero-text p,
                .hero-btns {
                    animation-duration: 0.6s !important;
                    animation-fill-mode: both !important;
                }
                
                /* Ensure 60fps performance by limiting expensive effects */
                .floating-shadow,
                .complex-gradient {
                    display: none !important;
                }
            }
            
            /* Touch device optimizations - Requirement 10.4 */
            @media (hover: none) and (pointer: coarse) {
                /* Convert hover effects to touch-friendly tap effects */
                .project-card:active,
                .btn:active,
                .skill-tag:active {
                    transform: translateY(-2px) scale(1.02);
                    transition: all 0.1s ease;
                }
                
                /* Optimize touch targets for accessibility */
                .btn, .nav-links a, .social-link {
                    min-height: 44px;
                    min-width: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px 16px;
                }
                
                /* Remove hover-dependent effects on touch devices */
                .project-card:hover,
                .skill-tag:hover {
                    transform: none;
                }
                
                /* Hide custom cursor on touch devices - Requirement 10.2 */
                .cursor,
                .cursor-follower,
                .cursor-trail {
                    display: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('Mobile animation optimizations applied for touch devices');
    }
    
    optimizeParticleSystem() {
        if (!window.particleSystem) return;
        
        const particleSystem = window.particleSystem;
        
        if (this.isMobile) {
            // Significantly reduce particle count on mobile for 60fps performance
            const originalCount = particleSystem.particleCount || 50;
            particleSystem.particleCount = Math.min(originalCount, 15); // Reduced from 20 to 15
            
            // Simplify particle rendering
            if (particleSystem.particles) {
                particleSystem.particles = particleSystem.particles.slice(0, 15);
            }
            
            // Reduce animation frequency to maintain 60fps
            particleSystem.animationThrottle = 33; // ~30fps for particles to save performance
            
            console.log(`Particle system optimized for mobile: ${particleSystem.particleCount} particles at 30fps`);
        }
        
        if (this.isTouchDevice) {
            // Disable particle interactions on touch devices
            particleSystem.interactionEnabled = false;
            
            // Further reduce particles on touch devices
            if (particleSystem.particles) {
                particleSystem.particles = particleSystem.particles.slice(0, 10);
                particleSystem.particleCount = 10;
            }
            
            console.log('Particle interactions disabled for touch devices');
        }
    }
    
    optimizeMobileScrollAnimations() {
        if (!window.animationController) return;
        
        const controller = window.animationController;
        
        // Adjust intersection observer options for mobile (Requirement 10.3)
        if (this.isMobile) {
            // Create new observer with mobile-optimized settings
            const mobileObserver = new IntersectionObserver(
                controller.handleIntersection.bind(controller),
                {
                    threshold: 0.1, // Appropriate threshold for mobile viewports
                    rootMargin: '0px 0px -30px 0px' // Optimized margin for mobile
                }
            );
            
            // Replace the existing observer
            if (controller.observer) {
                controller.observer.disconnect();
            }
            controller.observer = mobileObserver;
            
            // Re-observe all elements with new settings
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(element => {
                mobileObserver.observe(element);
            });
            
            console.log('Mobile scroll animations optimized with appropriate viewport thresholds');
        }
    }
    
    setupTouchInteractions() {
        if (!this.isTouchDevice) return;
        
        // Convert hover effects to touch effects
        this.convertHoverToTouch();
        
        // Add touch feedback
        this.addTouchFeedback();
        
        // Optimize touch scrolling
        this.optimizeTouchScrolling();
    }
    
    convertHoverToTouch() {
        const interactiveElements = document.querySelectorAll(
            '.project-card, .btn, .skill-tag, .social-link, .nav-links a'
        );
        
        interactiveElements.forEach(element => {
            // Add touch start/end handlers for immediate feedback
            element.addEventListener('touchstart', (e) => {
                element.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
            
            // Prevent hover effects on touch devices
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
            });
        });
    }
    
    addTouchFeedback() {
        const style = document.createElement('style');
        style.id = 'touch-feedback-styles';
        
        // Remove existing touch feedback styles if they exist
        const existingStyle = document.getElementById('touch-feedback-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.textContent = `
            /* Touch feedback styles - Requirement 10.4 */
            .touch-active {
                transform: scale(0.98) !important;
                opacity: 0.8 !important;
                transition: all 0.1s ease !important;
            }
            
            .btn.touch-active {
                background: linear-gradient(90deg, var(--primary-dark), var(--primary)) !important;
                transform: scale(0.95) translateY(1px) !important;
            }
            
            .project-card.touch-active {
                box-shadow: 0 2px 8px rgba(107, 33, 168, 0.3) !important;
                transform: scale(0.98) translateY(2px) !important;
            }
            
            .skill-tag.touch-active {
                background-color: var(--primary-light) !important;
                transform: scale(0.95) !important;
            }
            
            .social-link.touch-active {
                transform: scale(0.9) !important;
                color: var(--primary-light) !important;
            }
            
            .nav-links a.touch-active {
                color: var(--primary-light) !important;
                transform: scale(0.95) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('Touch-friendly feedback styles applied');
    }
    
    optimizeTouchScrolling() {
        // Enable momentum scrolling on iOS
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Optimize scroll performance
        const scrollElements = document.querySelectorAll('.skills-container, .projects-grid');
        scrollElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
    
    setupTouchEventHandlers() {
        let touchStartY = 0;
        let touchStartX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const touchX = e.touches[0].clientX;
            
            const deltaY = Math.abs(touchY - touchStartY);
            const deltaX = Math.abs(touchX - touchStartX);
            
            // Detect scroll direction and optimize accordingly
            if (deltaY > this.options.touchThreshold) {
                this.handleTouchScroll(deltaY);
            }
        }, { passive: true });
    }
    
    handleMobileScroll() {
        const now = performance.now();
        
        // Throttle scroll animations for better performance
        if (now - this.lastScrollTime < this.options.animationThrottleMs) {
            return;
        }
        
        this.lastScrollTime = now;
        
        // Trigger mobile-optimized scroll animations
        this.triggerMobileScrollAnimations();
    }
    
    handleTouchScroll(deltaY) {
        // Optimize scroll-based animations for touch
        if (window.animationController && deltaY > 20) {
            // Only trigger animations for significant scroll movements
            window.animationController.initializeVisibleElements();
        }
    }
    
    triggerMobileScrollAnimations() {
        // Check for elements entering viewport with mobile-optimized thresholds
        const elements = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
        
        elements.forEach(element => {
            if (this.isElementInMobileViewport(element)) {
                const animationType = element.dataset.animation || 'fadeInUp';
                
                // Apply mobile-optimized animation
                element.classList.add('animate-in', `animate-${animationType}`);
                element.style.animationDuration = `${this.options.reducedAnimationDuration}s`;
            }
        });
    }
    
    isElementInMobileViewport(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // More generous viewport detection for mobile
        const threshold = this.isMobile ? 0.1 : 0.2;
        
        return (
            rect.top < viewportHeight * (1 - threshold) &&
            rect.bottom > viewportHeight * threshold
        );
    }
    
    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance monitoring for 60fps requirement (Requirement 10.5)
    monitorPerformance() {
        if (!this.isMobile) return;
        
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsHistory = [];
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                fpsHistory.push(fps);
                
                // Keep only last 10 measurements
                if (fpsHistory.length > 10) {
                    fpsHistory.shift();
                }
                
                const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
                
                console.log(`Mobile FPS: ${fps} (avg: ${avgFPS.toFixed(1)})`);
                
                // If FPS drops below 30, apply additional optimizations (Requirement 10.5)
                if (avgFPS < 30 && fpsHistory.length >= 3) {
                    console.warn('FPS below 30, applying emergency optimizations for 60fps target');
                    this.applyEmergencyOptimizations();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    applyEmergencyOptimizations() {
        console.warn('Applying emergency optimizations to maintain 60fps performance');
        
        // Disable non-essential animations for 60fps performance
        const style = document.createElement('style');
        style.id = 'emergency-optimizations';
        
        // Remove existing emergency styles if they exist
        const existingStyle = document.getElementById('emergency-optimizations');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.textContent = `
            /* Emergency performance optimizations for 60fps */
            .cursor-trail,
            .floating-shadow,
            .project-overlay,
            .particle-canvas {
                display: none !important;
            }
            
            /* Disable complex animations */
            *, *::before, *::after {
                animation: none !important;
                transition: opacity 0.2s ease, transform 0.2s ease !important;
            }
            
            /* Keep essential scroll animations but simplify them */
            .animate-on-scroll {
                opacity: 1 !important;
                transform: none !important;
                transition: opacity 0.3s ease !important;
            }
            
            /* Simplify hover effects to basic opacity changes */
            .project-card:hover,
            .btn:hover,
            .skill-tag:hover {
                opacity: 0.8 !important;
                transform: none !important;
            }
            
            /* Disable particle system completely */
            canvas {
                display: none !important;
            }
        `;
        
        document.head.appendChild(style);
        
        // Also disable particle system programmatically
        if (window.particleSystem && window.particleSystem.stop) {
            window.particleSystem.stop();
        }
    }
    
    // Public API
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isTouchDevice: this.isTouchDevice,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
    
    destroy() {
        // Clean up event listeners and styles
        if (this.resizeThrottle) {
            clearTimeout(this.resizeThrottle);
        }
        if (this.scrollThrottle) {
            clearTimeout(this.scrollThrottle);
        }
        
        // Remove added styles
        const stylesToRemove = [
            'mobile-animation-optimizations',
            'touch-feedback-styles',
            'emergency-optimizations'
        ];
        
        stylesToRemove.forEach(id => {
            const style = document.getElementById(id);
            if (style) {
                style.remove();
            }
        });
    }
}

// Initialize mobile optimizer
let mobileOptimizer = null;

function initMobileOptimizer() {
    if (mobileOptimizer) {
        mobileOptimizer.destroy();
    }
    
    mobileOptimizer = new MobileOptimizer({
        mobileBreakpoint: 768,
        tabletBreakpoint: 992,
        animationThrottleMs: 16,
        reducedAnimationDuration: 0.3
    });
    
    // Start performance monitoring on mobile devices
    if (mobileOptimizer.isMobile) {
        mobileOptimizer.monitorPerformance();
    }
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileOptimizer);
    } else {
        // Don't auto-initialize in test environment
        if (typeof jest === 'undefined') {
            initMobileOptimizer();
        }
    }
}

// Export for testing and manual initialization
if (typeof window !== 'undefined') {
    window.MobileOptimizer = MobileOptimizer;
    window.mobileOptimizer = mobileOptimizer;
}