/**
 * Floating Elements System - Adds geometric shapes and decorative elements
 * that float around the page for enhanced visual appeal
 */

class FloatingElementsSystem {
    constructor() {
        this.elements = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isInitialized = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createCanvas();
        this.createElements();
        this.bindEvents();
        this.animate();
        
        this.isInitialized = true;
        console.log('✨ Floating elements system initialized');
    }
    
    createCanvas() {
        // Check if canvas already exists
        let canvas = document.getElementById('floating-elements-canvas');
        
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'floating-elements-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '-2'; // Behind particles but above background
            canvas.style.opacity = '0.3';
            
            document.body.insertBefore(canvas, document.body.firstChild);
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createElements() {
        this.elements = [];
        const elementCount = this.reducedMotion ? 3 : 8;
        
        for (let i = 0; i < elementCount; i++) {
            this.elements.push(this.createElement());
        }
    }
    
    createElement() {
        const shapes = ['circle', 'triangle', 'square', 'hexagon', 'diamond'];
        const colors = [
            'rgba(139, 92, 246, 0.3)',  // Purple
            'rgba(168, 85, 247, 0.3)',  // Medium purple
            'rgba(196, 181, 253, 0.3)', // Light purple
            'rgba(255, 255, 255, 0.2)', // White
            'rgba(192, 192, 192, 0.3)', // Silver
            'rgba(220, 220, 220, 0.2)', // Light silver
            'rgba(124, 58, 237, 0.3)',  // Deep purple
            'rgba(147, 51, 234, 0.3)'   // Rich purple
        ];
        
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 40 + 20,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.2 + 0.1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.01 + 0.005,
            originalSize: 0
        };
    }
    
    updateElement(element) {
        if (this.reducedMotion) return;
        
        // Update position
        element.x += element.vx;
        element.y += element.vy;
        
        // Update rotation
        element.rotation += element.rotationSpeed;
        
        // Update pulse
        element.pulsePhase += element.pulseSpeed;
        element.size = element.originalSize + Math.sin(element.pulsePhase) * 5;
        
        // Scroll-based movement
        const scrollY = window.scrollY;
        element.y -= scrollY * 0.0001;
        
        // Wrap around edges
        if (element.x < -element.size) element.x = this.canvas.width + element.size;
        if (element.x > this.canvas.width + element.size) element.x = -element.size;
        if (element.y < -element.size) element.y = this.canvas.height + element.size;
        if (element.y > this.canvas.height + element.size) element.y = -element.size;
    }
    
    drawElement(element) {
        this.ctx.save();
        this.ctx.globalAlpha = element.opacity;
        this.ctx.translate(element.x, element.y);
        this.ctx.rotate(element.rotation);
        this.ctx.fillStyle = element.color;
        this.ctx.strokeStyle = element.color;
        this.ctx.lineWidth = 2;
        
        const size = element.size;
        
        switch (element.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
                
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -size / 2);
                this.ctx.lineTo(-size / 2, size / 2);
                this.ctx.lineTo(size / 2, size / 2);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
                
            case 'square':
                this.ctx.strokeRect(-size / 2, -size / 2, size, size);
                break;
                
            case 'hexagon':
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * size / 2;
                    const y = Math.sin(angle) * size / 2;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
                break;
                
            case 'diamond':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -size / 2);
                this.ctx.lineTo(size / 2, 0);
                this.ctx.lineTo(0, size / 2);
                this.ctx.lineTo(-size / 2, 0);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
        }
        
        this.ctx.restore();
    }
    
    animate() {
        if (!this.reducedMotion) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.elements.forEach(element => {
                this.updateElement(element);
                this.drawElement(element);
            });
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createElements();
        });
        
        // Handle reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.createElements();
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
    }
}

// Initialize floating elements system
document.addEventListener('DOMContentLoaded', () => {
    try {
        const floatingElements = new FloatingElementsSystem();
        window.floatingElements = floatingElements;
    } catch (error) {
        console.error('❌ Failed to initialize floating elements:', error);
    }
});

// Fallback initialization
if (document.readyState !== 'loading') {
    setTimeout(() => {
        if (!window.floatingElements) {
            try {
                const floatingElements = new FloatingElementsSystem();
                window.floatingElements = floatingElements;
            } catch (error) {
                console.error('❌ Failed to initialize floating elements (fallback):', error);
            }
        }
    }, 100);
}