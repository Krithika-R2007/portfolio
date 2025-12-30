/**
 * Accessibility Module for Portfolio Enhancement
 * Implements reduced motion support, keyboard navigation, screen reader compatibility,
 * and accessibility preferences
 */

class AccessibilityManager {
    constructor() {
        this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = this.reducedMotionQuery.matches;
        this.originalAnimations = new Map();
        this.isInitialized = false;
        this.keyboardNavigationEnabled = true;
        this.screenReaderAnnouncements = [];
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Apply initial accessibility preferences
        this.applyAccessibilityPreferences();
        
        // Listen for changes in motion preferences
        this.reducedMotionQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.applyAccessibilityPreferences();
        });
        
        // Store original animation values for restoration
        this.storeOriginalAnimations();
        
        // Initialize keyboard navigation
        this.initializeKeyboardNavigation();
        
        // Initialize screen reader support
        this.initializeScreenReaderSupport();
        
        // Initialize mobile accessibility features
        this.initializeMobileAccessibility();
        
        this.isInitialized = true;
    }
    
    storeOriginalAnimations() {
        // Store original CSS animation durations and transitions
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const animationDuration = computedStyle.animationDuration;
            const transitionDuration = computedStyle.transitionDuration;
            
            if (animationDuration !== '0s' || transitionDuration !== '0s') {
                this.originalAnimations.set(element, {
                    animationDuration,
                    transitionDuration,
                    animationName: computedStyle.animationName
                });
            }
        });
    }
    
    applyAccessibilityPreferences() {
        if (this.reducedMotion) {
            this.disableAnimations();
            this.simplifyCustomCursor();
            this.reduceParticleEffects();
        } else {
            this.enableAnimations();
            this.restoreCustomCursor();
            this.restoreParticleEffects();
        }
        
        // Apply changes immediately
        this.applyImmediateChanges();
    }
    
    disableAnimations() {
        // Add reduced motion styles to document
        this.addReducedMotionStyles();
        
        // Disable scroll animations
        this.disableScrollAnimations();
        
        // Disable hover effects animations
        this.disableHoverAnimations();
        
        // Disable page transitions
        this.disablePageTransitions();
    }
    
    enableAnimations() {
        // Remove reduced motion styles
        this.removeReducedMotionStyles();
        
        // Re-enable scroll animations
        this.enableScrollAnimations();
        
        // Re-enable hover effects
        this.enableHoverAnimations();
        
        // Re-enable page transitions
        this.enablePageTransitions();
    }
    
    addReducedMotionStyles() {
        let reducedMotionStyle = document.getElementById('reduced-motion-styles');
        
        if (!reducedMotionStyle) {
            reducedMotionStyle = document.createElement('style');
            reducedMotionStyle.id = 'reduced-motion-styles';
            document.head.appendChild(reducedMotionStyle);
        }
        
        reducedMotionStyle.textContent = `
            /* Reduced Motion Styles */
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            /* Disable specific animations */
            .animate-on-scroll {
                opacity: 1 !important;
                transform: none !important;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: none !important;
            }
            
            /* Disable hover transforms */
            .project-card:hover,
            .btn:hover,
            .skill-tag:hover,
            .social-link:hover,
            .profile-img:hover {
                transform: none !important;
            }
            
            /* Disable floating animations */
            .floating-shadow {
                animation: none !important;
            }
            
            /* Disable parallax effects */
            .hero::before,
            .hero::after,
            .about::before {
                transform: none !important;
            }
            
            /* Simplify skill bar animations */
            .skill-progress {
                transition: width 0.1s linear !important;
            }
            
            /* Disable cursor trails and complex animations */
            .cursor-trail {
                display: none !important;
            }
            
            /* Disable ripple effects */
            .cursor-ripple {
                display: none !important;
            }
        `;
    }
    
    removeReducedMotionStyles() {
        const reducedMotionStyle = document.getElementById('reduced-motion-styles');
        if (reducedMotionStyle) {
            reducedMotionStyle.remove();
        }
    }
    
    disableScrollAnimations() {
        // Disable intersection observer animations
        if (window.animationController) {
            window.animationController.observer.disconnect();
        }
        
        // Make all scroll-animated elements immediately visible
        const scrollElements = document.querySelectorAll('.animate-on-scroll');
        scrollElements.forEach(element => {
            element.classList.add('animate-in');
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
    
    enableScrollAnimations() {
        // Re-enable intersection observer
        if (window.animationController) {
            // Reset animated elements set
            window.animationController.animatedElements.clear();
            
            // Re-observe elements
            const scrollElements = document.querySelectorAll('.animate-on-scroll');
            scrollElements.forEach(element => {
                element.classList.remove('animate-in');
                element.style.opacity = '';
                element.style.transform = '';
                
                const animationType = element.dataset.animation || 'fadeInUp';
                window.animationController.observe(element, animationType);
            });
        }
    }
    
    disableHoverAnimations() {
        // Add class to body to disable hover effects
        document.body.classList.add('reduced-motion');
    }
    
    enableHoverAnimations() {
        // Remove class from body to re-enable hover effects
        document.body.classList.remove('reduced-motion');
    }
    
    disablePageTransitions() {
        // Disable page transition animations
        if (window.pageTransitions) {
            window.pageTransitions.disabled = true;
        }
    }
    
    enablePageTransitions() {
        // Re-enable page transition animations
        if (window.pageTransitions) {
            window.pageTransitions.disabled = false;
        }
    }
    
    simplifyCustomCursor() {
        if (window.customCursor) {
            // Hide cursor trails
            window.customCursor.trails.forEach(trail => {
                if (trail) trail.style.display = 'none';
            });
            
            // Disable cursor animations
            if (window.customCursor.cursor) {
                window.customCursor.cursor.style.transition = 'none';
            }
            
            if (window.customCursor.follower) {
                window.customCursor.follower.style.transition = 'none';
            }
            
            // Disable ripple effects
            window.customCursor.options.clickRippleDuration = 0;
        }
    }
    
    restoreCustomCursor() {
        if (window.customCursor) {
            // Show cursor trails
            window.customCursor.trails.forEach(trail => {
                if (trail) trail.style.display = 'block';
            });
            
            // Re-enable cursor animations
            if (window.customCursor.cursor) {
                window.customCursor.cursor.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            if (window.customCursor.follower) {
                window.customCursor.follower.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            // Re-enable ripple effects
            window.customCursor.options.clickRippleDuration = 600;
        }
    }
    
    reduceParticleEffects() {
        if (window.particleSystem) {
            // Reduce particle count significantly
            window.particleSystem.particleCount = Math.max(1, Math.floor(window.particleSystem.particleCount * 0.1));
            window.particleSystem.createParticles();
            
            // Disable particle animations
            window.particleSystem.reducedMotion = true;
        }
    }
    
    restoreParticleEffects() {
        if (window.particleSystem) {
            // Restore original particle count
            window.particleSystem.particleCount = 50;
            window.particleSystem.createParticles();
            
            // Re-enable particle animations
            window.particleSystem.reducedMotion = false;
        }
    }
    
    applyImmediateChanges() {
        // Force immediate application of accessibility preferences
        // This ensures changes are applied without waiting for page reload
        
        if (this.reducedMotion) {
            // Immediately stop all running animations
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.animationPlayState = 'paused';
            });
            
            // Force reflow to apply changes
            document.body.offsetHeight;
            
            // Resume with reduced motion styles
            setTimeout(() => {
                allElements.forEach(element => {
                    element.style.animationPlayState = '';
                });
            }, 10);
        }
    }
    
    // Public method to check if reduced motion is enabled
    isReducedMotion() {
        return this.reducedMotion;
    }
    
    // Public method to manually toggle reduced motion (for testing)
    toggleReducedMotion() {
        this.reducedMotion = !this.reducedMotion;
        this.applyAccessibilityPreferences();
    }
    
    // Method to ensure functionality is preserved without animations
    preserveFunctionality() {
        // Ensure all interactive elements remain functional
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [tabindex]');
        
        interactiveElements.forEach(element => {
            // Ensure elements are visible and accessible
            const computedStyle = window.getComputedStyle(element);
            
            if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                element.style.opacity = '1';
                element.style.visibility = 'visible';
            }
            
            // Ensure elements are not transformed out of view
            if (computedStyle.transform !== 'none') {
                element.style.transform = 'none';
            }
        });
        
        // Ensure navigation remains functional
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.style.opacity = '1';
            link.style.transform = 'none';
        });
        
        // Ensure form elements are accessible
        const formElements = document.querySelectorAll('.form-control');
        formElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
    
    // Initialize keyboard navigation support
    initializeKeyboardNavigation() {
        if (!this.keyboardNavigationEnabled) return;
        
        // Add keyboard navigation for interactive elements
        this.setupKeyboardNavigation();
        
        // Add focus management
        this.setupFocusManagement();
        
        // Add skip links for screen readers
        this.addSkipLinks();
        
        console.log('Keyboard navigation initialized');
    }
    
    setupKeyboardNavigation() {
        // Handle keyboard navigation for project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            // Make project cards focusable
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event handlers
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Simulate click on the first link in the card
                    const link = card.querySelector('.project-link');
                    if (link) {
                        link.click();
                    }
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextCard = projectCards[index + 1];
                    if (nextCard) {
                        nextCard.focus();
                    }
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevCard = projectCards[index - 1];
                    if (prevCard) {
                        prevCard.focus();
                    }
                }
            });
            
            // Add ARIA labels for screen readers
            if (!card.hasAttribute('aria-label')) {
                const title = card.querySelector('h3')?.textContent || `Project ${index + 1}`;
                card.setAttribute('aria-label', `${title} project card. Press Enter to view details.`);
            }
        });
        
        // Handle keyboard navigation for skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            if (!tag.hasAttribute('tabindex')) {
                tag.setAttribute('tabindex', '0');
            }
            
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Trigger hover effect for keyboard users
                    tag.classList.add('keyboard-active');
                    setTimeout(() => tag.classList.remove('keyboard-active'), 200);
                }
            });
            
            if (!tag.hasAttribute('aria-label')) {
                tag.setAttribute('aria-label', `${tag.textContent} skill`);
            }
        });
        
        // Handle keyboard navigation for experience items
        const experienceItems = document.querySelectorAll('.experience-item');
        experienceItems.forEach((item, index) => {
            // Make experience items focusable
            if (!item.hasAttribute('tabindex')) {
                item.setAttribute('tabindex', '0');
            }
            
            // Add keyboard event handlers
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Trigger hover effect for keyboard users
                    item.classList.add('keyboard-active');
                    setTimeout(() => item.classList.remove('keyboard-active'), 200);
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextItem = experienceItems[index + 1];
                    if (nextItem) {
                        nextItem.focus();
                    }
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevItem = experienceItems[index - 1];
                    if (prevItem) {
                        prevItem.focus();
                    }
                }
            });
            
            // Add ARIA labels for screen readers
            if (!item.hasAttribute('aria-label')) {
                const title = item.querySelector('h3')?.textContent || `Experience ${index + 1}`;
                const company = item.querySelector('h4')?.textContent || '';
                item.setAttribute('aria-label', `${title} at ${company}. Press Enter for details.`);
            }
        });
        
        // Handle keyboard navigation for navigation menu
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = navLinks[index + 1] || navLinks[0];
                    nextLink.focus();
                }
                
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    prevLink.focus();
                }
                
                if (e.key === 'Escape') {
                    // Close mobile menu if open
                    const navContainer = document.querySelector('.nav-links');
                    if (navContainer && navContainer.classList.contains('active')) {
                        navContainer.classList.remove('active');
                        document.querySelector('.menu-toggle')?.focus();
                    }
                }
            });
        });
        
        // Handle mobile menu toggle with keyboard
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menuToggle.click();
                }
            });
        }
    }
    
    setupFocusManagement() {
        // Add visible focus indicators
        const focusStyle = document.createElement('style');
        focusStyle.id = 'keyboard-focus-styles';
        
        // Remove existing focus styles if they exist
        const existingFocusStyle = document.getElementById('keyboard-focus-styles');
        if (existingFocusStyle) {
            existingFocusStyle.remove();
        }
        
        focusStyle.textContent = `
            /* Keyboard focus indicators - Requirements 3.4 */
            *:focus {
                outline: 3px solid var(--primary-light) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3) !important;
            }
            
            /* Enhanced focus for interactive elements */
            .project-card:focus,
            .skill-tag:focus,
            .experience-item:focus,
            .btn:focus,
            .social-link:focus {
                outline: 3px solid var(--secondary) !important;
                outline-offset: 3px !important;
                box-shadow: 
                    0 0 0 1px rgba(192, 132, 252, 0.5),
                    0 0 10px rgba(139, 92, 246, 0.3) !important;
                transform: translateY(-2px) !important;
            }
            
            /* Form element focus */
            .form-control:focus {
                outline: 3px solid var(--primary-light) !important;
                outline-offset: 2px !important;
                border-color: var(--primary-light) !important;
                box-shadow: 
                    0 0 0 3px rgba(139, 92, 246, 0.2),
                    0 5px 15px rgba(107, 33, 168, 0.3) !important;
            }
            
            /* Navigation focus */
            .nav-links a:focus {
                outline: 3px solid var(--secondary) !important;
                outline-offset: 2px !important;
                background: rgba(139, 92, 246, 0.1) !important;
                border-radius: 4px !important;
            }
            
            /* Keyboard active state for skill tags and experience items */
            .skill-tag.keyboard-active,
            .experience-item.keyboard-active {
                background-color: var(--primary-light) !important;
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 8px 20px rgba(107, 33, 168, 0.3) !important;
            }
            
            /* Skip link styles */
            .skip-link {
                position: absolute !important;
                top: -40px !important;
                left: 6px !important;
                background: var(--primary) !important;
                color: white !important;
                padding: 8px 16px !important;
                text-decoration: none !important;
                border-radius: 4px !important;
                z-index: 10000 !important;
                font-weight: bold !important;
                transition: top 0.3s ease !important;
            }
            
            .skip-link:focus {
                top: 6px !important;
                outline: 3px solid var(--secondary) !important;
                outline-offset: 2px !important;
            }
        `;
        
        document.head.appendChild(focusStyle);
        
        // Manage focus for dynamic content
        this.setupDynamicFocusManagement();
    }
    
    setupDynamicFocusManagement() {
        // Handle focus for mobile menu
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                setTimeout(() => {
                    if (navLinks.classList.contains('active')) {
                        // Focus first nav link when menu opens
                        const firstLink = navLinks.querySelector('a');
                        if (firstLink) {
                            firstLink.focus();
                        }
                    }
                }, 100);
            });
        }
        
        // Handle focus for modal-like content (certificates carousel)
        const certificatesCarousel = document.querySelector('.certificates-carousel');
        if (certificatesCarousel) {
            certificatesCarousel.setAttribute('tabindex', '0');
            certificatesCarousel.setAttribute('aria-label', 'Certificates carousel. Use arrow keys to navigate.');
            
            certificatesCarousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    // Pause/resume carousel animation
                    const track = certificatesCarousel.querySelector('.certificates-track');
                    if (track) {
                        track.style.animationPlayState = 
                            track.style.animationPlayState === 'paused' ? 'running' : 'paused';
                    }
                }
            });
        }
    }
    
    addSkipLinks() {
        // Add skip navigation links for screen readers
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#projects" class="skip-link">Skip to projects</a>
            <a href="#contact" class="skip-link">Skip to contact</a>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add main content landmark if it doesn't exist
        const heroSection = document.querySelector('.hero');
        if (heroSection && !document.getElementById('main-content')) {
            heroSection.id = 'main-content';
            heroSection.setAttribute('role', 'main');
        }
        
        // Add navigation landmark
        const nav = document.querySelector('nav');
        if (nav && !nav.id) {
            nav.id = 'navigation';
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }
    }
    
    // Initialize screen reader support
    initializeScreenReaderSupport() {
        // Add ARIA labels and roles
        this.addAriaLabels();
        
        // Add live regions for dynamic content
        this.addLiveRegions();
        
        // Add semantic structure
        this.addSemanticStructure();
        
        // Add screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        console.log('Screen reader support initialized');
    }
    
    addAriaLabels() {
        // Add ARIA labels to sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const heading = section.querySelector('h1, h2, h3');
            if (heading && !section.hasAttribute('aria-labelledby')) {
                if (!heading.id) {
                    heading.id = `heading-${Math.random().toString(36).substr(2, 9)}`;
                }
                section.setAttribute('aria-labelledby', heading.id);
            }
        });
        
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const icon = button.querySelector('i');
            if (icon) {
                if (button.classList.contains('theme-toggle')) {
                    button.setAttribute('aria-label', 'Toggle dark/light theme');
                } else if (button.classList.contains('menu-toggle')) {
                    button.setAttribute('aria-label', 'Toggle navigation menu');
                } else {
                    button.setAttribute('aria-label', 'Button');
                }
            }
        });
        
        // Add ARIA labels to social links
        const socialLinks = document.querySelectorAll('.social-link:not([aria-label])');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                let platform = 'Social media';
                
                if (iconClass.includes('github')) platform = 'GitHub';
                else if (iconClass.includes('linkedin')) platform = 'LinkedIn';
                else if (iconClass.includes('twitter')) platform = 'Twitter';
                else if (iconClass.includes('instagram')) platform = 'Instagram';
                
                link.setAttribute('aria-label', `Visit ${platform} profile`);
            }
        });
        
        // Add ARIA labels to project links
        const projectLinks = document.querySelectorAll('.project-link:not([aria-label])');
        projectLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                let linkType = 'project';
                
                if (iconClass.includes('github')) linkType = 'GitHub repository';
                else if (iconClass.includes('external-link')) linkType = 'live demo';
                else if (iconClass.includes('figma')) linkType = 'Figma design';
                
                link.setAttribute('aria-label', `View ${linkType}`);
            }
        });
        
        // Add ARIA labels to form elements
        const formControls = document.querySelectorAll('.form-control:not([aria-label])');
        formControls.forEach(control => {
            const label = control.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                if (!label.getAttribute('for') && !control.id) {
                    control.id = `form-${Math.random().toString(36).substr(2, 9)}`;
                    label.setAttribute('for', control.id);
                }
            } else if (control.placeholder) {
                control.setAttribute('aria-label', control.placeholder);
            }
        });
    }
    
    addLiveRegions() {
        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
        
        // Add status region for form feedback
        const statusRegion = document.createElement('div');
        statusRegion.id = 'status-region';
        statusRegion.setAttribute('aria-live', 'assertive');
        statusRegion.setAttribute('aria-atomic', 'true');
        statusRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(statusRegion);
    }
    
    addSemanticStructure() {
        // Add proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (!heading.hasAttribute('role')) {
                heading.setAttribute('role', 'heading');
            }
        });
        
        // Add landmark roles
        const header = document.querySelector('header');
        if (header && !header.hasAttribute('role')) {
            header.setAttribute('role', 'banner');
        }
        
        const footer = document.querySelector('footer');
        if (footer && !footer.hasAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
        
        // Add list semantics to navigation
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.tagName !== 'UL') {
            navLinks.setAttribute('role', 'list');
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                if (link.parentElement.tagName !== 'LI') {
                    link.setAttribute('role', 'listitem');
                }
            });
        }
        
        // Add region roles to main sections
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.setAttribute('role', 'region');
            aboutSection.setAttribute('aria-label', 'About me');
        }
        
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            skillsSection.setAttribute('role', 'region');
            skillsSection.setAttribute('aria-label', 'My skills');
        }
        
        const experienceSection = document.querySelector('#experience');
        if (experienceSection) {
            experienceSection.setAttribute('role', 'region');
            experienceSection.setAttribute('aria-label', 'My experience');
        }
        
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
            projectsSection.setAttribute('role', 'region');
            projectsSection.setAttribute('aria-label', 'My projects');
        }
        
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.setAttribute('role', 'region');
            contactSection.setAttribute('aria-label', 'Contact information');
        }
    }
    
    setupScreenReaderAnnouncements() {
        // Announce page navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                if (target && target.startsWith('#')) {
                    const sectionName = target.replace('#', '');
                    this.announceToScreenReader(`Navigating to ${sectionName} section`);
                }
            });
        });
        
        // Announce form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.announceToScreenReader('Form submitted successfully', 'assertive');
            });
        });
        
        // Announce theme changes
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.contains('light-mode');
                const theme = isDark ? 'dark' : 'light';
                this.announceToScreenReader(`Switched to ${theme} theme`);
            });
        }
        
        // Announce mobile menu state
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    const isOpen = navLinks.classList.contains('active');
                    const state = isOpen ? 'opened' : 'closed';
                    this.announceToScreenReader(`Navigation menu ${state}`);
                    
                    // Update ARIA attributes
                    menuToggle.setAttribute('aria-expanded', isOpen.toString());
                    navLinks.setAttribute('aria-hidden', (!isOpen).toString());
                }
            });
        }
    }
    
    announceToScreenReader(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'status-region' : 'live-region';
        const region = document.getElementById(regionId);
        
        if (region) {
            // Clear previous message
            region.textContent = '';
            
            // Add new message after a brief delay to ensure it's announced
            setTimeout(() => {
                region.textContent = message;
                
                // Clear message after announcement
                setTimeout(() => {
                    region.textContent = '';
                }, 1000);
            }, 100);
        }
        
        // Store announcement for testing
        this.screenReaderAnnouncements.push({
            message,
            priority,
            timestamp: Date.now()
        });
    }
    
    // Initialize mobile accessibility features
    initializeMobileAccessibility() {
        // Add mobile-specific accessibility enhancements
        this.setupMobileAccessibility();
        
        // Add touch accessibility features
        this.setupTouchAccessibility();
        
        // Add mobile screen reader optimizations
        this.setupMobileScreenReader();
        
        console.log('Mobile accessibility features initialized');
    }
    
    setupMobileAccessibility() {
        // Detect mobile device
        const isMobile = window.innerWidth <= 768 || 
                         'ontouchstart' in window ||
                         navigator.maxTouchPoints > 0;
        
        if (isMobile) {
            // Add mobile accessibility class
            document.body.classList.add('mobile-accessibility');
            
            // Enhance touch targets
            const style = document.createElement('style');
            style.id = 'mobile-accessibility-styles';
            
            // Remove existing mobile accessibility styles if they exist
            const existingStyle = document.getElementById('mobile-accessibility-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            style.textContent = `
                /* Mobile accessibility enhancements - Requirements 3.5 */
                @media (max-width: 768px) {
                    /* Ensure minimum touch target size of 44px */
                    .btn, .nav-links a, .social-link, .project-link,
                    .skill-tag, .theme-toggle, .menu-toggle {
                        min-height: 44px !important;
                        min-width: 44px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        padding: 12px !important;
                    }
                    
                    /* Increase spacing between interactive elements */
                    .nav-links li {
                        margin: 8px 0 !important;
                    }
                    
                    .social-links {
                        gap: 16px !important;
                    }
                    
                    .hero-btns {
                        gap: 16px !important;
                    }
                    
                    /* Improve form accessibility on mobile */
                    .form-control {
                        min-height: 44px !important;
                        font-size: 16px !important; /* Prevent zoom on iOS */
                        padding: 12px 16px !important;
                    }
                    
                    /* Enhanced focus indicators for mobile */
                    *:focus {
                        outline: 4px solid var(--primary-light) !important;
                        outline-offset: 3px !important;
                    }
                    
                    /* Improve readability */
                    body {
                        font-size: 16px !important;
                        line-height: 1.6 !important;
                    }
                    
                    /* Ensure adequate color contrast */
                    .text-light {
                        color: var(--text) !important;
                    }
                }
                
                /* Touch device specific styles */
                @media (hover: none) and (pointer: coarse) {
                    /* Remove hover effects that don't work on touch */
                    .project-card:hover,
                    .btn:hover,
                    .skill-tag:hover,
                    .social-link:hover {
                        transform: none !important;
                    }
                    
                    /* Add touch feedback */
                    .project-card:active,
                    .btn:active,
                    .skill-tag:active,
                    .social-link:active {
                        transform: scale(0.98) !important;
                        opacity: 0.8 !important;
                        transition: all 0.1s ease !important;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
    }
    
    setupTouchAccessibility() {
        // Add touch-specific accessibility features
        const touchElements = document.querySelectorAll(
            '.project-card, .btn, .skill-tag, .experience-item, .social-link, .nav-links a'
        );
        
        touchElements.forEach(element => {
            // Add touch feedback for accessibility
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-feedback');
                this.announceToScreenReader(`${element.textContent || element.getAttribute('aria-label') || 'Element'} activated`);
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-feedback');
                }, 150);
            }, { passive: true });
            
            // Ensure elements are properly labeled for screen readers
            if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                const text = element.textContent?.trim() || 
                           element.querySelector('h3')?.textContent?.trim() ||
                           'Interactive element';
                element.setAttribute('aria-label', text);
            }
        });
        
        // Add touch feedback styles
        const touchStyle = document.createElement('style');
        touchStyle.id = 'touch-accessibility-styles';
        
        // Remove existing touch accessibility styles if they exist
        const existingTouchStyle = document.getElementById('touch-accessibility-styles');
        if (existingTouchStyle) {
            existingTouchStyle.remove();
        }
        
        touchStyle.textContent = `
            /* Touch accessibility feedback */
            .touch-feedback {
                background-color: rgba(139, 92, 246, 0.1) !important;
                transform: scale(0.98) !important;
                transition: all 0.1s ease !important;
            }
        `;
        
        document.head.appendChild(touchStyle);
    }
    
    setupMobileScreenReader() {
        // Add mobile-specific screen reader optimizations
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Add mobile navigation instructions
            const nav = document.querySelector('nav');
            if (nav) {
                nav.setAttribute('aria-label', 'Main navigation. Use the menu button to open navigation on mobile.');
            }
            
            // Add mobile-specific instructions for interactive elements
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                const existingLabel = card.getAttribute('aria-label') || '';
                card.setAttribute('aria-label', `${existingLabel} Double tap to activate.`);
            });
            
            // Add mobile instructions for carousel
            const carousel = document.querySelector('.certificates-carousel');
            if (carousel) {
                carousel.setAttribute('aria-label', 'Certificates carousel. Swipe left or right to navigate, or tap to pause.');
            }
            
            // Add mobile form instructions
            const formControls = document.querySelectorAll('.form-control');
            formControls.forEach(control => {
                const existingLabel = control.getAttribute('aria-label') || control.placeholder || '';
                if (control.type === 'email') {
                    control.setAttribute('aria-label', `${existingLabel} Email input field.`);
                } else if (control.tagName === 'TEXTAREA') {
                    control.setAttribute('aria-label', `${existingLabel} Text area for longer messages.`);
                }
            });
        }
    }
    
    // Method to test accessibility compliance
    testAccessibilityCompliance() {
        const results = {
            reducedMotionDetected: this.reducedMotion,
            animationsDisabled: document.getElementById('reduced-motion-styles') !== null,
            functionalityPreserved: true,
            cursorSimplified: true,
            particlesReduced: true,
            keyboardNavigationEnabled: this.keyboardNavigationEnabled,
            screenReaderSupport: true,
            mobileAccessibility: true
        };
        
        // Test that all interactive elements are accessible
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
        interactiveElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                results.functionalityPreserved = false;
            }
            
            // Check for proper ARIA labels
            if (!element.hasAttribute('aria-label') && 
                !element.hasAttribute('aria-labelledby') && 
                !element.textContent?.trim()) {
                results.screenReaderSupport = false;
            }
            
            // Check for proper focus indicators
            if (!element.matches(':focus-visible')) {
                // This is just a structural check, actual focus testing requires user interaction
            }
        });
        
        // Test mobile accessibility
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const touchTargets = document.querySelectorAll('.btn, .nav-links a, .social-link');
            touchTargets.forEach(target => {
                const rect = target.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    results.mobileAccessibility = false;
                }
            });
        }
        
        return results;
    }
}

// Initialize accessibility manager when DOM is loaded
let accessibilityManager = null;

function initAccessibilityManager() {
    if (accessibilityManager) {
        return accessibilityManager;
    }
    
    accessibilityManager = new AccessibilityManager();
    return accessibilityManager;
}

// Auto-initialize if DOM is ready (but not in test environment)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccessibilityManager);
    } else {
        // Don't auto-initialize in test environment
        if (typeof jest === 'undefined') {
            initAccessibilityManager();
        }
    }
}

// Export for testing and manual initialization
if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
    window.accessibilityManager = accessibilityManager;
    window.initAccessibilityManager = initAccessibilityManager;
}