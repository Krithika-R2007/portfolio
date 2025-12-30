/**
 * Cute Cursor System
 * Creates an adorable cursor experience with fast trails and sparkles
 */

class CuteCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.trails = [];
        this.sparkles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.isHovering = false;
        this.animationId = null;
        
        // Fast and responsive easing values
        this.followerEasing = 0.3;
        
        this.init();
    }

    init() {
        console.log('🌟 Initializing Cute Cursor System...');
        
        // Check if we're on a touch device and skip if so
        if (this.isTouchDevice()) {
            console.log('Touch device detected, skipping cursor initialization');
            this.addMobileTouchSupport();
            return;
        }
        
        // Check for reduced motion preference
        if (this.prefersReducedMotion()) {
            console.log('Reduced motion detected, simplifying cursor system');
            this.createSimplifiedCursor();
            return;
        }
        
        // Force initialization for desktop devices
        this.createCursorElements();
        this.createTrails();
        this.createSparkles();
        this.bindEvents();
        this.startAnimation();
        
        console.log('✨ Cute Cursor System initialized!');
    }

    isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    createSimplifiedCursor() {
        // Create a simple cursor without trails or complex animations for reduced motion
        this.cursor = document.createElement('div');
        this.cursor.className = 'cute-cursor-simple';
        this.cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--primary-light);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transform: translate(-10000px, -10000px);
        `;
        document.body.appendChild(this.cursor);
        
        // Bind simplified events
        document.addEventListener('mousemove', this.handleSimpleMouseMove.bind(this));
        document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        console.log('Simplified cursor created for reduced motion');
    }

    handleSimpleMouseMove(e) {
        if (this.cursor) {
            this.cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
            this.cursor.style.opacity = '0.8';
        }
    }

    createCursorElements() {
        console.log('Creating cursor elements...');
        
        // Remove any existing cursor elements first
        const existingCursor = document.querySelector('.cute-cursor');
        const existingFollower = document.querySelector('.cute-cursor-follower');
        if (existingCursor) existingCursor.remove();
        if (existingFollower) existingFollower.remove();
        
        // Create main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'cute-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            box-shadow: 
                0 0 20px rgba(139, 92, 246, 0.6),
                0 0 40px rgba(168, 85, 247, 0.4),
                0 0 60px rgba(192, 132, 252, 0.3);
            animation: cutePulse 2s ease-in-out infinite alternate;
            will-change: transform;
            transform: translate(-10000px, -10000px);
        `;
        document.body.appendChild(this.cursor);

        // Create follower
        this.follower = document.createElement('div');
        this.follower.className = 'cute-cursor-follower';
        this.follower.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid rgba(139, 92, 246, 0.5);
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2));
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
            backdrop-filter: blur(2px);
            will-change: transform;
            transform: translate(-10000px, -10000px);
        `;
        document.body.appendChild(this.follower);

        // Add animations
        this.addCuteAnimations();
        
        console.log('Cursor elements created!', {
            cursor: this.cursor,
            follower: this.follower,
            cursorInDOM: document.contains(this.cursor),
            followerInDOM: document.contains(this.follower)
        });
    }

    addCuteAnimations() {
        if (document.getElementById('cute-cursor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cute-cursor-styles';
        style.textContent = `
            @keyframes cutePulse {
                0% { 
                    transform: scale(1);
                    box-shadow: 
                        0 0 20px rgba(139, 92, 246, 0.6),
                        0 0 40px rgba(168, 85, 247, 0.4),
                        0 0 60px rgba(192, 132, 252, 0.3);
                }
                100% { 
                    transform: scale(1.1);
                    box-shadow: 
                        0 0 30px rgba(139, 92, 246, 0.8),
                        0 0 60px rgba(168, 85, 247, 0.6),
                        0 0 90px rgba(192, 132, 252, 0.5);
                }
            }

            @keyframes sparkleFloat {
                0% { 
                    transform: scale(0.5) rotate(0deg);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 1;
                }
                100% { 
                    transform: scale(0.5) rotate(360deg);
                    opacity: 0.8;
                }
            }

            @keyframes cuteRipple {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 0.9;
                    transform: translate(-50%, -50%) scale(1);
                }
                50% {
                    width: 80px;
                    height: 80px;
                    opacity: 0.6;
                    transform: translate(-50%, -50%) scale(1.2);
                }
                100% {
                    width: 150px;
                    height: 150px;
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1.5);
                }
            }

            /* Hide default cursor */
            * {
                cursor: none !important;
            }

            /* Restore cursor for form elements when focused */
            input:focus, textarea:focus, select:focus {
                cursor: text !important;
            }

            .cute-cursor.hover {
                animation: cutePulse 0.4s ease-in-out infinite alternate;
                transform: scale(1.3);
            }

            .cute-cursor-follower.hover {
                transform: scale(1.4);
                border-width: 3px;
                opacity: 0.9;
            }
        `;
        document.head.appendChild(style);
    }

    createTrails() {
        console.log('Creating trails...');
        
        // Create 8 fast-following trails
        for (let i = 0; i < 8; i++) {
            const trail = document.createElement('div');
            trail.className = 'cute-cursor-trail';
            trail.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${16 - i * 1.5}px;
                height: ${16 - i * 1.5}px;
                border-radius: 50%;
                background: linear-gradient(135deg, 
                    rgba(139, 92, 246, ${0.8 - i * 0.1}), 
                    rgba(168, 85, 247, ${0.6 - i * 0.08}));
                pointer-events: none;
                z-index: ${9997 - i};
                opacity: 0;
                box-shadow: 0 0 ${15 - i * 2}px rgba(139, 92, 246, 0.4);
                will-change: transform;
                transform: translate(-10000px, -10000px);
            `;
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                delay: i * 0.02
            });
        }
        
        console.log(`Created ${this.trails.length} trails`);
    }

    createSparkles() {
        console.log('Creating sparkles...');
        
        // Create sparkle pool
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'cute-cursor-sparkle';
            sparkle.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: radial-gradient(circle, #c084fc, transparent 70%);
                pointer-events: none;
                z-index: 9996;
                opacity: 0;
                animation: sparkleFloat 1.5s ease-in-out infinite alternate;
                will-change: transform;
            `;
            document.body.appendChild(sparkle);
            this.sparkles.push({
                element: sparkle,
                x: 0,
                y: 0,
                active: false,
                life: 0
            });
        }
        
        console.log(`Created ${this.sparkles.length} sparkles`);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Get initial mouse position
        document.addEventListener('mousemove', this.handleInitialMouseMove.bind(this), { once: true });
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        this.bindHoverElements();
        
        console.log('Events bound!');
    }

    handleInitialMouseMove(e) {
        // Set initial position for both cursor and follower
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.followerX = e.clientX;
        this.followerY = e.clientY;
        
        // Position cursor immediately
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.mouseX - 10}px, ${this.mouseY - 10}px)`;
            this.cursor.style.opacity = '1';
        }
        
        if (this.follower) {
            this.follower.style.transform = `translate(${this.followerX - 20}px, ${this.followerY - 20}px)`;
            this.follower.style.opacity = '0.8';
        }
        
        // Initialize trails at current position
        this.trails.forEach(trail => {
            trail.x = this.mouseX;
            trail.y = this.mouseY;
            trail.element.style.transform = `translate(${trail.x - 8}px, ${trail.y - 8}px)`;
            trail.element.style.opacity = '0.5';
        });
        
        console.log('Cursor initialized at position:', this.mouseX, this.mouseY);
    }

    bindHoverElements() {
        const hoverElements = {
            buttons: 'button, .btn, input[type="submit"]',
            links: 'a, .nav-links a',
            interactive: '.project-card, .skill-tag, .social-link, .project-link, .certificate-item',
            form: 'input, textarea, select'
        };

        Object.entries(hoverElements).forEach(([type, selector]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('mouseenter', () => this.handleHoverEnter(type));
                element.addEventListener('mouseleave', () => this.handleHoverLeave());
            });
        });
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Initialize follower position on first mouse move
        if (this.followerX === 0 && this.followerY === 0) {
            this.followerX = this.mouseX;
            this.followerY = this.mouseY;
        }
        
        // Update cursor position immediately and make it visible
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.mouseX - 10}px, ${this.mouseY - 10}px)`;
            this.cursor.style.opacity = '1';
        }
        
        // Update follower position with smooth following
        if (this.follower) {
            this.follower.style.opacity = '0.8';
        }
        
        // Update trails immediately
        this.updateTrails();
    }

    updateTrails() {
        this.trails.forEach((trail, index) => {
            // Initialize trail position if not set
            if (trail.x === 0 && trail.y === 0 && this.mouseX !== 0 && this.mouseY !== 0) {
                trail.x = this.mouseX;
                trail.y = this.mouseY;
            }
            
            // Only update if mouse has moved
            if (this.mouseX === 0 && this.mouseY === 0) return;
            
            const targetX = this.mouseX + (Math.random() - 0.5) * 3;
            const targetY = this.mouseY + (Math.random() - 0.5) * 3;
            
            // Very fast trail following
            const easing = 0.8 - (index * 0.05);
            
            trail.x += (targetX - trail.x) * easing;
            trail.y += (targetY - trail.y) * easing;
            
            trail.element.style.transform = `translate(${trail.x - 8}px, ${trail.y - 8}px)`;
            trail.element.style.opacity = Math.max(0.2, 0.9 - (index * 0.1));
        });
    }

    handleClick(e) {
        console.log('Click detected, creating sparkles...');
        this.createRippleEffect(e.clientX, e.clientY);
        this.createClickSparkles(e.clientX, e.clientY);
    }

    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(139, 92, 246, 0.6), 
                rgba(168, 85, 247, 0.4), 
                transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            animation: cuteRipple 800ms ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }

    createClickSparkles(x, y) {
        // Create burst of sparkles on click
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const sparkle = this.getAvailableSparkle();
                if (sparkle) {
                    const angle = (i / 6) * Math.PI * 2;
                    const distance = 30 + Math.random() * 20;
                    sparkle.x = x + Math.cos(angle) * distance;
                    sparkle.y = y + Math.sin(angle) * distance;
                    sparkle.active = true;
                    sparkle.life = 60;
                    sparkle.element.style.opacity = '1';
                    sparkle.element.style.transform = `translate(${sparkle.x}px, ${sparkle.y}px) scale(1.5)`;
                }
            }, i * 50);
        }
    }

    getAvailableSparkle() {
        return this.sparkles.find(sparkle => !sparkle.active);
    }

    handleHoverEnter(type) {
        this.isHovering = true;
        if (this.cursor) this.cursor.classList.add('hover');
        if (this.follower) this.follower.classList.add('hover');
    }

    handleHoverLeave() {
        this.isHovering = false;
        if (this.cursor) this.cursor.classList.remove('hover');
        if (this.follower) this.follower.classList.remove('hover');
    }

    handleMouseEnter() {
        if (this.cursor) this.cursor.style.opacity = '1';
        if (this.follower) this.follower.style.opacity = '0.8';
        this.trails.forEach(trail => {
            trail.element.style.opacity = '1';
        });
    }

    handleMouseLeave() {
        if (this.cursor) this.cursor.style.opacity = '0';
        if (this.follower) this.follower.style.opacity = '0';
        this.trails.forEach(trail => {
            trail.element.style.opacity = '0';
        });
    }

    startAnimation() {
        console.log('Starting animation loop...');
        
        const animate = () => {
            this.updateFollowerPosition();
            this.updateSparkles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    updateFollowerPosition() {
        if (!this.follower) return;
        
        const dx = this.mouseX - this.followerX;
        const dy = this.mouseY - this.followerY;
        
        this.followerX += dx * this.followerEasing;
        this.followerY += dy * this.followerEasing;
        
        this.follower.style.transform = `translate(${this.followerX - 20}px, ${this.followerY - 20}px)`;
    }

    updateSparkles() {
        this.sparkles.forEach(sparkle => {
            if (sparkle.active) {
                sparkle.life--;
                if (sparkle.life <= 0) {
                    sparkle.active = false;
                    sparkle.element.style.opacity = '0';
                } else {
                    sparkle.x += (Math.random() - 0.5) * 2;
                    sparkle.y += (Math.random() - 0.5) * 2;
                    sparkle.element.style.transform = `translate(${sparkle.x}px, ${sparkle.y}px) scale(${sparkle.life / 60})`;
                }
            }
        });
    }

    addMobileTouchSupport() {
        // Add touch-friendly interactions for mobile devices
        console.log('Adding mobile touch support...');
        
        // Restore normal cursor for mobile
        const style = document.createElement('style');
        style.id = 'mobile-cursor-styles';
        style.textContent = `
            /* Mobile cursor support - Requirements 3.5 */
            @media (hover: none) and (pointer: coarse) {
                * {
                    cursor: auto !important;
                }
                
                /* Touch-friendly hover effects */
                .project-card:active,
                .btn:active,
                .skill-tag:active,
                .social-link:active {
                    transform: scale(0.98) translateY(2px) !important;
                    transition: all 0.1s ease !important;
                    opacity: 0.9 !important;
                }
                
                /* Enhanced touch feedback */
                .btn:active {
                    background: linear-gradient(90deg, var(--primary-dark), var(--primary)) !important;
                }
                
                .project-card:active {
                    box-shadow: 
                        0 0 15px rgba(139, 92, 246, 0.3),
                        0 0 30px rgba(139, 92, 246, 0.15),
                        0 8px 16px rgba(107, 33, 168, 0.2) !important;
                }
                
                .skill-tag:active {
                    background-color: var(--primary-light) !important;
                    color: white !important;
                }
                
                .social-link:active {
                    background-color: var(--primary-light) !important;
                    color: white !important;
                }
                
                /* Optimize touch scrolling */
                body {
                    -webkit-overflow-scrolling: touch;
                }
                
                .skills-container,
                .projects-grid {
                    -webkit-overflow-scrolling: touch;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add touch event handlers for better mobile interaction
        this.addTouchEventHandlers();
    }
    
    addTouchEventHandlers() {
        // Add touch feedback for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.project-card, .btn, .skill-tag, .social-link, .nav-links a'
        );
        
        interactiveElements.forEach(element => {
            // Add touch start feedback
            element.addEventListener('touchstart', (e) => {
                element.classList.add('touch-active');
                
                // Add ripple effect for touch
                this.createTouchRipple(e.touches[0].clientX, e.touches[0].clientY, element);
            }, { passive: true });
            
            // Remove touch feedback
            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
            
            // Handle touch cancel
            element.addEventListener('touchcancel', (e) => {
                element.classList.remove('touch-active');
            }, { passive: true });
        });
        
        // Add touch feedback styles
        const touchStyle = document.createElement('style');
        touchStyle.id = 'touch-feedback-styles';
        touchStyle.textContent = `
            .touch-active {
                transform: scale(0.95) !important;
                opacity: 0.8 !important;
                transition: all 0.1s ease !important;
            }
            
            .touch-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(139, 92, 246, 0.3);
                pointer-events: none;
                transform: scale(0);
                animation: touchRipple 0.6s ease-out;
                z-index: 1000;
            }
            
            @keyframes touchRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(touchStyle);
    }
    
    createTouchRipple(x, y, element) {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (x - rect.left - size / 2) + 'px';
        ripple.style.top = (y - rect.top - size / 2) + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    destroy() {
        console.log('Destroying cute cursor...');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.cursor) this.cursor.remove();
        if (this.follower) this.follower.remove();
        
        this.trails.forEach(trail => {
            if (trail.element) trail.element.remove();
        });
        
        this.sparkles.forEach(sparkle => {
            if (sparkle.element) sparkle.element.remove();
        });
        
        // Clean up mobile and accessibility styles
        const stylesToRemove = [
            'cute-cursor-styles',
            'mobile-cursor-styles', 
            'touch-feedback-styles'
        ];
        
        stylesToRemove.forEach(id => {
            const style = document.getElementById(id);
            if (style) style.remove();
        });
    }
}

// Initialize cute cursor
let cuteCursor = null;

function initCuteCursor() {
    console.log('🚀 Initializing Cute Cursor...');
    
    if (cuteCursor) {
        cuteCursor.destroy();
    }
    
    cuteCursor = new CuteCursor();
    
    // Make it globally accessible for debugging
    window.cuteCursor = cuteCursor;
    
    console.log('Cursor initialized:', cuteCursor);
}

// Manual initialization function for debugging
function forceCursorInit() {
    console.log('🔧 Force initializing cursor...');
    initCuteCursor();
    
    // Also ensure cursor is visible
    setTimeout(() => {
        if (window.cuteCursor && window.cuteCursor.cursor) {
            window.cuteCursor.cursor.style.opacity = '1';
            window.cuteCursor.cursor.style.display = 'block';
            console.log('Cursor visibility forced');
        }
    }, 100);
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCuteCursor);
    } else {
        // Initialize immediately if DOM is already ready
        setTimeout(initCuteCursor, 100);
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.CuteCursor = CuteCursor;
    window.initCuteCursor = initCuteCursor;
    window.forceCursorInit = forceCursorInit;
}

console.log('📝 Cute Cursor System loaded!');