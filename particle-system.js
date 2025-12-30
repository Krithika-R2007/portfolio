// Particle System for Portfolio Enhancement
class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = options.count || 50;
        this.colors = options.colors || ['#8b5cf6', '#c084fc', '#d8b4fe'];
        this.isHeroHovered = false;
        this.currentTheme = 'dark';
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Adjust particle count for reduced motion
        if (this.reducedMotion) {
            this.particleCount = Math.floor(this.particleCount * 0.1); // Reduce to 10%
        }
        
        // Listen for changes in motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                this.particleCount = Math.floor((options.count || 50) * 0.1);
            } else {
                this.particleCount = options.count || 50;
            }
            this.createParticles();
        });
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particleType = Math.random();
        let particle;
        
        if (particleType < 0.7) {
            // Regular particles (70%)
            particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                originalVx: (Math.random() - 0.5) * 0.5,
                originalVy: (Math.random() - 0.5) * 0.5,
                type: 'regular',
                life: 1.0,
                maxLife: 1.0
            };
        } else if (particleType < 0.85) {
            // Glowing particles (15%)
            particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 5 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.8 + 0.4,
                originalVx: (Math.random() - 0.5) * 0.3,
                originalVy: (Math.random() - 0.5) * 0.3,
                type: 'glow',
                life: 1.0,
                maxLife: 1.0,
                glowIntensity: Math.random() * 0.5 + 0.5
            };
        } else {
            // Floating sparkles (15%)
            particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 0.5,
                color: '#ffd700',
                opacity: Math.random() * 0.6 + 0.3,
                originalVx: (Math.random() - 0.5) * 0.2,
                originalVy: (Math.random() - 0.5) * 0.2,
                type: 'sparkle',
                life: 1.0,
                maxLife: 1.0,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.05 + 0.02
            };
        }
        
        return particle;
    }
    
    updateParticle(particle) {
        // Apply scroll-based parallax movement
        const scrollY = window.scrollY;
        const parallaxFactor = 0.3;
        
        // Update position with original velocity plus parallax
        particle.x += particle.vx + (scrollY * parallaxFactor * 0.001);
        particle.y += particle.vy - (scrollY * parallaxFactor * 0.002);
        
        // Hero hover effect - make particles more active
        if (this.isHeroHovered) {
            particle.vx = particle.originalVx * 2;
            particle.vy = particle.originalVy * 2;
            particle.opacity = Math.min(particle.opacity * 1.5, 1);
        } else {
            particle.vx = particle.originalVx;
            particle.vy = particle.originalVy;
            particle.opacity = Math.max(particle.opacity / 1.5, 0.2);
        }
        
        // Update particle-specific properties
        if (particle.type === 'sparkle') {
            particle.twinkle += particle.twinkleSpeed;
            particle.opacity = (Math.sin(particle.twinkle) + 1) * 0.3 + 0.2;
        } else if (particle.type === 'glow') {
            particle.glowIntensity = Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.3 + 0.7;
        }
        
        // Add subtle floating motion
        const time = Date.now() * 0.001;
        particle.y += Math.sin(time + particle.x * 0.01) * 0.1;
        particle.x += Math.cos(time + particle.y * 0.01) * 0.05;
        
        // Wrap around screen edges
        if (particle.x < -50) particle.x = this.canvas.width + 50;
        if (particle.x > this.canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = this.canvas.height + 50;
        if (particle.y > this.canvas.height + 50) particle.y = -50;
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'glow') {
            // Create glowing effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.5, particle.color + '80');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw core
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (particle.type === 'sparkle') {
            // Draw sparkle as a star
            this.ctx.fillStyle = particle.color;
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.twinkle);
            
            this.ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                this.ctx.lineTo(0, -particle.size * 2);
                this.ctx.rotate(Math.PI / 4);
                this.ctx.lineTo(0, -particle.size * 0.5);
                this.ctx.rotate(Math.PI / 4);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            // Regular particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    animate() {
        // Only animate if reduced motion is not preferred
        if (!this.reducedMotion) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(particle => {
                this.updateParticle(particle);
                this.drawParticle(particle);
            });
        } else {
            // For reduced motion, just clear the canvas or draw static particles
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Optionally draw static particles
            this.particles.forEach(particle => {
                this.drawParticle(particle);
            });
        }
        requestAnimationFrame(() => this.animate());
    }
    
    setHeroHover(isHovered) {
        this.isHeroHovered = isHovered;
    }
    
    updateTheme(theme) {
        this.currentTheme = theme;
        // Update particle colors based on theme
        if (theme === 'light') {
            this.colors = ['#6d28d9', '#8b5cf6', '#a78bfa'];
        } else {
            this.colors = ['#8b5cf6', '#c084fc', '#d8b4fe'];
        }
        
        // Update existing particles with new colors
        this.particles.forEach(particle => {
            particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
    }
    
    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        // Handle reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                this.particleCount = Math.floor(this.particleCount * 0.3);
                this.createParticles();
            } else {
                this.particleCount = 50;
                this.createParticles();
            }
        });
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if canvas already exists (prevent duplicates)
    let canvas = document.getElementById('particle-canvas');
    
    if (!canvas) {
        // Create canvas element
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.4'; // More subtle particle effect
        
        // Insert canvas as first child of body
        document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    // Initialize particle system with error handling
    try {
        const particleSystem = new ParticleSystem(canvas);
        
        // Set up hero section hover detection
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                particleSystem.setHeroHover(true);
            });
            
            heroSection.addEventListener('mouseleave', () => {
                particleSystem.setHeroHover(false);
            });
        }
        
        // Set up theme change detection
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                setTimeout(() => {
                    const isLightMode = document.body.classList.contains('light-mode');
                    particleSystem.updateTheme(isLightMode ? 'light' : 'dark');
                }, 100);
            });
        }
        
        // Make particle system globally available
        window.particleSystem = particleSystem;
        
        console.log('✨ Particle system initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize particle system:', error);
        // Fallback: hide canvas if initialization fails
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
});

// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    // DOMContentLoaded has not fired yet, the event listener above will handle it
} else {
    // DOMContentLoaded has already fired, initialize immediately
    setTimeout(() => {
        let canvas = document.getElementById('particle-canvas');
        
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'particle-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '-1';
            canvas.style.opacity = '0.4'; // More subtle particle effect
            
            document.body.insertBefore(canvas, document.body.firstChild);
            
            try {
                const particleSystem = new ParticleSystem(canvas);
                window.particleSystem = particleSystem;
                console.log('✨ Particle system initialized (fallback)');
            } catch (error) {
                console.error('❌ Failed to initialize particle system (fallback):', error);
                canvas.style.display = 'none';
            }
        }
    }, 100);
}