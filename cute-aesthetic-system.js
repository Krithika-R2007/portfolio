/**
 * Cute Aesthetic System
 * Implements soft design language, delightful micro-interactions, and charming loading animations
 * Requirements: 11.1, 11.2, 11.6
 */

class CuteAestheticSystem {
    constructor(options = {}) {
        this.options = {
            enableMicroInteractions: true,
            enableLoadingAnimations: true,
            enableSoftDesign: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            ...options
        };
        
        this.loadingElements = new Map();
        this.microInteractionElements = new Set();
        
        // Store event listeners for cleanup
        this.eventListeners = [];
        
        this.init();
    }
    
    init() {
        // Apply soft design language to all elements
        if (this.options.enableSoftDesign) {
            this.applySoftDesignLanguage();
        }
        
        // Set up delightful micro-interactions
        if (this.options.enableMicroInteractions && !this.options.reducedMotion) {
            this.setupMicroInteractions();
        }
        
        // Initialize charming loading animations
        if (this.options.enableLoadingAnimations) {
            this.setupLoadingAnimations();
        }
        
        // Listen for reduced motion preference changes
        this.bindAccessibilityEvents();
        
        // Set up dynamic style injection
        this.injectCuteStyles();
    }
    
    applySoftDesignLanguage() {
        // Apply soft, rounded corners and gentle shadows to create friendly appearance
        const softDesignRules = `
            /* Soft Design Language - Requirement 11.1 */
            .btn, button {
                border-radius: 25px !important;
                box-shadow: 0 8px 25px rgba(107, 33, 168, 0.15), 
                           0 4px 10px rgba(107, 33, 168, 0.1) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            .project-card, .skill-category, .contact-form, .feature-card {
                border-radius: 20px !important;
                box-shadow: 0 10px 30px rgba(107, 33, 168, 0.1), 
                           0 4px 15px rgba(107, 33, 168, 0.05) !important;
            }
            
            .skill-tag {
                border-radius: 20px !important;
                box-shadow: 0 4px 12px rgba(107, 33, 168, 0.1) !important;
            }
            
            .form-control, input, textarea, select {
                border-radius: 15px !important;
                box-shadow: inset 0 2px 8px rgba(107, 33, 168, 0.05) !important;
            }
            
            .social-link, .project-link {
                border-radius: 50% !important;
                box-shadow: 0 6px 20px rgba(107, 33, 168, 0.15) !important;
            }
            
            .profile-img, .project-main-image, .section-img {
                border-radius: 25px !important;
                box-shadow: 0 15px 40px rgba(107, 33, 168, 0.2), 
                           0 8px 20px rgba(107, 33, 168, 0.1) !important;
            }
            
            .nav-links a::after {
                border-radius: 3px !important;
            }
            
            .highlight-box, .meta-item {
                border-radius: 15px !important;
                box-shadow: 0 6px 20px rgba(107, 33, 168, 0.08) !important;
            }
        `;
        
        this.addStyleSheet('soft-design', softDesignRules);
    }
    
    setupMicroInteractions() {
        // Delightful micro-interactions - Requirement 11.2
        const microInteractionRules = `
            /* Delightful Micro-Interactions */
            @keyframes gentleBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
                40% { transform: translateY(-8px) scale(1.05); }
                60% { transform: translateY(-4px) scale(1.02); }
            }
            
            @keyframes playfulWiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-3deg) scale(1.02); }
                75% { transform: rotate(3deg) scale(1.02); }
            }
            
            @keyframes softGlow {
                0%, 100% { box-shadow: 0 8px 25px rgba(107, 33, 168, 0.15); }
                50% { box-shadow: 0 12px 35px rgba(107, 33, 168, 0.25), 0 0 20px rgba(107, 33, 168, 0.1); }
            }
            
            @keyframes heartPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes sparkleFloat {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
            }
            
            /* Button Micro-Interactions */
            .btn:hover {
                animation: gentleBounce 0.6s ease !important;
                box-shadow: 0 15px 40px rgba(107, 33, 168, 0.25), 
                           0 8px 20px rgba(107, 33, 168, 0.15) !important;
            }
            
            .btn:active {
                transform: translateY(2px) scale(0.98) !important;
                animation: none !important;
            }
            
            /* Navigation Link Micro-Interactions */
            .nav-links a:hover {
                animation: playfulWiggle 0.5s ease !important;
            }
            
            /* Social Link Micro-Interactions */
            .social-link:hover {
                animation: gentleBounce 0.6s ease, softGlow 2s ease-in-out infinite !important;
            }
            
            /* Project Card Micro-Interactions */
            .project-card:hover {
                animation: gentleBounce 0.8s ease !important;
                box-shadow: 
                    0 0 30px rgba(139, 92, 246, 0.4),
                    0 0 60px rgba(139, 92, 246, 0.2),
                    0 20px 40px rgba(107, 33, 168, 0.3),
                    0 10px 20px rgba(139, 92, 246, 0.2) !important;
            }
            
            /* Skill Tag Micro-Interactions */
            .skill-tag:hover {
                animation: playfulWiggle 0.4s ease, heartPulse 1s ease-in-out infinite !important;
            }
            
            /* Form Control Micro-Interactions */
            .form-control:focus {
                animation: softGlow 0.3s ease !important;
                box-shadow: 0 0 0 3px rgba(107, 33, 168, 0.1), 
                           0 8px 25px rgba(107, 33, 168, 0.15) !important;
            }
            
            /* Profile Image Micro-Interactions */
            .profile-img:hover {
                animation: gentleBounce 1s ease, softGlow 3s ease-in-out infinite !important;
            }
            
            /* Logo Micro-Interactions */
            .logo-img:hover {
                animation: playfulWiggle 0.6s ease !important;
            }
            
            /* Theme Toggle Micro-Interactions */
            .theme-toggle:hover {
                animation: sparkleFloat 1s ease-in-out infinite !important;
            }
        `;
        
        this.addStyleSheet('micro-interactions', microInteractionRules);
        this.bindMicroInteractionEvents();
    }
    
    bindMicroInteractionEvents() {
        // Add sparkle effects on button clicks
        const clickHandler = (e) => {
            if (e.target.matches('.btn, button, .social-link, .project-link')) {
                this.createSparkleEffect(e.target, e.clientX, e.clientY);
            }
        };
        document.addEventListener('click', clickHandler);
        this.eventListeners.push({ type: 'click', handler: clickHandler, element: document });
        
        // Add gentle feedback on form interactions
        const focusHandler = (e) => {
            if (e.target.matches('.form-control, input, textarea')) {
                this.addGentleFeedback(e.target);
            }
        };
        document.addEventListener('focus', focusHandler, true);
        this.eventListeners.push({ type: 'focus', handler: focusHandler, element: document, options: true });
    }
    
    createSparkleEffect(element, x, y) {
        if (this.options.reducedMotion) return;
        
        const sparkles = ['✨', '💫', '⭐', '🌟', '💖'];
        const sparkleCount = 5;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.className = 'cute-sparkle-effect';
            
            const angle = (Math.PI * 2 * i) / sparkleCount;
            const distance = 30 + Math.random() * 20;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: 16px;
                pointer-events: none;
                z-index: 10000;
                animation: sparkleExpand 0.8s ease-out forwards;
                --target-x: ${targetX}px;
                --target-y: ${targetY}px;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 800);
        }
        
        // Add sparkle animation if not already added
        this.addSparkleAnimation();
    }
    
    addSparkleAnimation() {
        if (document.getElementById('sparkle-animation')) return;
        
        const style = document.createElement('style');
        style.id = 'sparkle-animation';
        style.textContent = `
            @keyframes sparkleExpand {
                0% {
                    transform: translate(0, 0) scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translate(calc(var(--target-x) - ${0}px), calc(var(--target-y) - ${0}px)) scale(1.2) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(calc(var(--target-x) - ${0}px), calc(var(--target-y) - ${0}px)) scale(0) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    addGentleFeedback(element) {
        if (this.options.reducedMotion) return;
        
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    setupLoadingAnimations() {
        // Charming loading animations - Requirement 11.6
        const loadingAnimationRules = `
            /* Charming Loading Animations */
            @keyframes cuteSpinner {
                0% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(90deg) scale(1.1); }
                50% { transform: rotate(180deg) scale(1); }
                75% { transform: rotate(270deg) scale(1.1); }
                100% { transform: rotate(360deg) scale(1); }
            }
            
            @keyframes bouncingDots {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }
            
            @keyframes friendlyCharacter {
                0%, 100% { transform: translateY(0px) rotate(-5deg); }
                25% { transform: translateY(-10px) rotate(5deg); }
                50% { transform: translateY(-5px) rotate(-3deg); }
                75% { transform: translateY(-8px) rotate(3deg); }
            }
            
            @keyframes heartBeat {
                0%, 100% { transform: scale(1); }
                14% { transform: scale(1.1); }
                28% { transform: scale(1); }
                42% { transform: scale(1.1); }
                70% { transform: scale(1); }
            }
            
            /* Cute Spinner */
            .cute-spinner {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 4px solid rgba(107, 33, 168, 0.1);
                border-left: 4px solid var(--primary-light);
                border-radius: 50%;
                animation: cuteSpinner 1s ease-in-out infinite;
                position: relative;
            }
            
            .cute-spinner::after {
                content: '💖';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
                animation: heartBeat 1.5s ease-in-out infinite;
            }
            
            /* Bouncing Dots */
            .bouncing-dots {
                display: inline-flex;
                gap: 8px;
                align-items: center;
            }
            
            .bouncing-dots .dot {
                width: 12px;
                height: 12px;
                background: var(--primary-light);
                border-radius: 50%;
                animation: bouncingDots 1.4s ease-in-out infinite;
            }
            
            .bouncing-dots .dot:nth-child(1) { animation-delay: 0s; }
            .bouncing-dots .dot:nth-child(2) { animation-delay: 0.2s; }
            .bouncing-dots .dot:nth-child(3) { animation-delay: 0.4s; }
            
            /* Friendly Character */
            .friendly-character {
                font-size: 32px;
                animation: friendlyCharacter 2s ease-in-out infinite;
                display: inline-block;
            }
            
            /* Loading States */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(30, 27, 46, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            
            .loading-message {
                color: var(--text);
                font-size: 1.2rem;
                margin-top: 20px;
                text-align: center;
                animation: heartBeat 2s ease-in-out infinite;
            }
            
            /* Button Loading States */
            .btn.loading {
                position: relative;
                color: transparent !important;
                pointer-events: none;
            }
            
            .btn.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-left: 2px solid white;
                border-radius: 50%;
                animation: cuteSpinner 0.8s ease-in-out infinite;
            }
        `;
        
        this.addStyleSheet('loading-animations', loadingAnimationRules);
        this.setupLoadingStates();
    }
    
    setupLoadingStates() {
        // Set up form submission loading states using event delegation
        const submitHandler = (e) => {
            if (e.target.tagName === 'FORM') {
                const submitButton = e.target.querySelector('button[type="submit"], .btn');
                if (submitButton) {
                    this.showButtonLoading(submitButton);
                }
            }
        };
        document.addEventListener('submit', submitHandler);
        this.eventListeners.push({ type: 'submit', handler: submitHandler, element: document });
        
        // Set up page loading animation
        this.setupPageLoadingAnimation();
    }
    
    showButtonLoading(button) {
        if (this.options.reducedMotion) {
            button.textContent = 'Loading...';
            return;
        }
        
        button.classList.add('loading');
        button.setAttribute('data-original-text', button.textContent);
        
        // Auto-remove loading state after 3 seconds (fallback)
        setTimeout(() => {
            this.hideButtonLoading(button);
        }, 3000);
    }
    
    hideButtonLoading(button) {
        button.classList.remove('loading');
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
            button.removeAttribute('data-original-text');
        }
    }
    
    setupPageLoadingAnimation() {
        // Show cute loading animation during page transitions
        document.addEventListener('beforeunload', () => {
            this.showPageLoading();
        });
        
        // Hide loading when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hidePageLoading();
            }, 500);
        });
    }
    
    showPageLoading(message = 'Loading something magical... ✨') {
        if (document.querySelector('.loading-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        
        const loadingType = this.options.reducedMotion ? 'simple' : 'cute';
        
        if (loadingType === 'cute') {
            overlay.innerHTML = `
                <div class="friendly-character">🌟</div>
                <div class="bouncing-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="loading-message">${message}</div>
            `;
        } else {
            overlay.innerHTML = `
                <div class="loading-message">Loading...</div>
            `;
        }
        
        document.body.appendChild(overlay);
    }
    
    hidePageLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }
    
    bindAccessibilityEvents() {
        // Listen for reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const changeHandler = (e) => {
            this.options.reducedMotion = e.matches;
            
            if (e.matches) {
                // Disable animations for reduced motion
                this.disableAnimations();
            } else {
                // Re-enable animations
                this.enableAnimations();
            }
        };
        mediaQuery.addEventListener('change', changeHandler);
        this.eventListeners.push({ type: 'change', handler: changeHandler, element: mediaQuery });
    }
    
    disableAnimations() {
        const disableAnimationsRules = `
            /* Reduced Motion Override */
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .cute-sparkle-effect {
                display: none !important;
            }
        `;
        
        this.addStyleSheet('reduced-motion', disableAnimationsRules);
    }
    
    enableAnimations() {
        const reducedMotionSheet = document.getElementById('reduced-motion-styles');
        if (reducedMotionSheet) {
            reducedMotionSheet.remove();
        }
    }
    
    addStyleSheet(id, rules) {
        // Remove existing stylesheet if it exists
        const existingSheet = document.getElementById(`${id}-styles`);
        if (existingSheet) {
            existingSheet.remove();
        }
        
        // Add new stylesheet
        const style = document.createElement('style');
        style.id = `${id}-styles`;
        style.textContent = rules;
        document.head.appendChild(style);
    }
    
    injectCuteStyles() {
        // Inject base cute aesthetic styles
        const baseStyles = `
            /* Base Cute Aesthetic Styles */
            :root {
                --cute-border-radius: 20px;
                --cute-shadow-soft: 0 8px 25px rgba(107, 33, 168, 0.1);
                --cute-shadow-medium: 0 12px 35px rgba(107, 33, 168, 0.15);
                --cute-shadow-strong: 0 20px 50px rgba(107, 33, 168, 0.2);
                --cute-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Ensure all interactive elements have cute styling */
            .cute-element {
                border-radius: var(--cute-border-radius);
                box-shadow: var(--cute-shadow-soft);
                transition: var(--cute-transition);
            }
            
            .cute-element:hover {
                box-shadow: var(--cute-shadow-medium);
                transform: translateY(-2px);
            }
            
            /* Cute focus states */
            .cute-element:focus {
                outline: none;
                box-shadow: var(--cute-shadow-medium), 0 0 0 3px rgba(107, 33, 168, 0.1);
            }
        `;
        
        this.addStyleSheet('base-cute', baseStyles);
    }
    
    // Public API methods
    showLoading(element, message) {
        if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
            this.showButtonLoading(element);
        } else {
            this.showPageLoading(message);
        }
    }
    
    hideLoading(element) {
        if (element && (element.tagName === 'BUTTON' || element.classList.contains('btn'))) {
            this.hideButtonLoading(element);
        } else {
            this.hidePageLoading();
        }
    }
    
    addCuteClass(element) {
        element.classList.add('cute-element');
    }
    
    removeCuteClass(element) {
        element.classList.remove('cute-element');
    }
    
    destroy() {
        // Clean up event listeners
        this.eventListeners.forEach(({ type, handler, element, options }) => {
            element.removeEventListener(type, handler, options);
        });
        this.eventListeners = [];
        
        // Clean up all injected styles
        const styleIds = ['soft-design', 'micro-interactions', 'loading-animations', 'base-cute', 'reduced-motion'];
        styleIds.forEach(id => {
            const sheet = document.getElementById(`${id}-styles`);
            if (sheet) {
                sheet.remove();
            }
        });
        
        // Remove sparkle animation styles
        const sparkleSheet = document.getElementById('sparkle-animation');
        if (sparkleSheet) {
            sparkleSheet.remove();
        }
        
        // Remove any loading overlays
        this.hidePageLoading();
    }
}

// Initialize cute aesthetic system when DOM is loaded
let cuteAestheticSystem = null;

function initCuteAestheticSystem() {
    if (cuteAestheticSystem) {
        cuteAestheticSystem.destroy();
    }
    
    cuteAestheticSystem = new CuteAestheticSystem({
        enableMicroInteractions: true,
        enableLoadingAnimations: true,
        enableSoftDesign: true
    });
}

// Auto-initialize if DOM is ready
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCuteAestheticSystem);
    } else {
        // Don't auto-initialize in test environment
        if (typeof jest === 'undefined') {
            initCuteAestheticSystem();
        }
    }
}

// Export for testing and manual initialization
if (typeof window !== 'undefined') {
    window.CuteAestheticSystem = CuteAestheticSystem;
    window.cuteAestheticSystem = cuteAestheticSystem;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CuteAestheticSystem;
}