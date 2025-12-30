/**
 * Screen Sparkles System - Creates gentle ambient sparkles across the entire screen
 */

class ScreenSparklesSystem {
    constructor() {
        this.sparkles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isInitialized = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.sparkleCount = this.reducedMotion ? 0 : 12;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createCanvas();
        this.createSparkles();
        this.bindEvents();
        this.animate();
        
        this.isInitialized = true;
        console.log('✨ Screen sparkles system initialized');
    }
    
    createCanvas() {
        let canvas = document.getElementById('screen-sparkles-canvas');
        
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'screen-sparkles-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9995'; // Above floating elements, below magical effects
            canvas.style.opacity = '0.3';
            
            document.body.appendChild(canvas);
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createSparkles() {
        this.sparkles = [];
        
        for (let i = 0; i < this.sparkleCount; i++) {
            this.sparkles.push(this.createSparkle());
        }
    }
    
    createSparkle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            driftX: (Math.random() - 0.5) * 0.1,
            driftY: (Math.random() - 0.5) * 0.1,
            color: this.getSparkleColor(),
            life: Math.random() * 300 + 200, // Long life
            maxLife: 0,
            birthTime: Date.now()
        };
    }
    
    getSparkleColor() {
        const colors = [
            'rgba(255, 255, 255, 0.4)', // White
            'rgba(192, 192, 192, 0.3)', // Silver
            'rgba(139, 92, 246, 0.3)',  // Purple
            'rgba(168, 85, 247, 0.3)',  // Medium purple
            'rgba(196, 181, 253, 0.3)', // Light purple
            'rgba(220, 220, 220, 0.2)', // Light silver
            'rgba(124, 58, 237, 0.3)',  // Deep purple
            'rgba(147, 51, 234, 0.3)'   // Rich purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateSparkle(sparkle) {
        if (this.reducedMotion) return;
        
        // Update twinkle
        sparkle.twinkle += sparkle.twinkleSpeed;
        
        // Calculate twinkling opacity
        const twinkleOpacity = (Math.sin(sparkle.twinkle) + 1) * 0.3 + 0.1;
        sparkle.opacity = twinkleOpacity;
        
        // Gentle drift movement
        sparkle.x += sparkle.driftX;
        sparkle.y += sparkle.driftY;
        
        // Add subtle floating motion
        const time = (Date.now() - sparkle.birthTime) * 0.001;
        sparkle.y += Math.sin(time + sparkle.x * 0.01) * 0.05;
        sparkle.x += Math.cos(time + sparkle.y * 0.01) * 0.03;
        
        // Wrap around edges
        if (sparkle.x < -10) sparkle.x = this.canvas.width + 10;
        if (sparkle.x > this.canvas.width + 10) sparkle.x = -10;
        if (sparkle.y < -10) sparkle.y = this.canvas.height + 10;
        if (sparkle.y > this.canvas.height + 10) sparkle.y = -10;
        
        // Update life
        sparkle.life--;
        
        // Respawn sparkle when it dies
        if (sparkle.life <= 0) {
            Object.assign(sparkle, this.createSparkle());
        }
    }
    
    drawSparkle(sparkle) {
        this.ctx.save();
        this.ctx.globalAlpha = sparkle.opacity;
        this.ctx.translate(sparkle.x, sparkle.y);
        this.ctx.rotate(sparkle.twinkle);
        
        // Draw sparkle as a 4-pointed star
        this.ctx.fillStyle = sparkle.color;
        this.ctx.beginPath();
        
        // Create a 4-pointed star
        for (let i = 0; i < 4; i++) {
            this.ctx.lineTo(0, -sparkle.size * 2);
            this.ctx.rotate(Math.PI / 4);
            this.ctx.lineTo(0, -sparkle.size * 0.4);
            this.ctx.rotate(Math.PI / 4);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add a subtle glow
        this.ctx.shadowColor = sparkle.color;
        this.ctx.shadowBlur = 4;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.reducedMotion) {
            this.sparkles.forEach(sparkle => {
                this.updateSparkle(sparkle);
                this.drawSparkle(sparkle);
            });
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createSparkles();
        });
        
        // Handle reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            this.sparkleCount = this.reducedMotion ? 0 : 12;
            this.createSparkles();
        });
        
        // Add more sparkles on special interactions
        document.addEventListener('click', () => {
            if (!this.reducedMotion && this.sparkles.length < 20) {
                // Add temporary sparkles on click
                for (let i = 0; i < 3; i++) {
                    const tempSparkle = this.createSparkle();
                    tempSparkle.life = 60; // Short-lived
                    tempSparkle.twinkleSpeed *= 2; // Faster twinkling
                    this.sparkles.push(tempSparkle);
                }
                
                // Remove temporary sparkles after a while
                setTimeout(() => {
                    this.sparkles = this.sparkles.slice(0, this.sparkleCount);
                }, 3000);
            }
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

// Initialize screen sparkles system
document.addEventListener('DOMContentLoaded', () => {
    try {
        const screenSparkles = new ScreenSparklesSystem();
        window.screenSparkles = screenSparkles;
    } catch (error) {
        console.error('❌ Failed to initialize screen sparkles:', error);
    }
});

// Fallback initialization
if (document.readyState !== 'loading') {
    setTimeout(() => {
        if (!window.screenSparkles) {
            try {
                const screenSparkles = new ScreenSparklesSystem();
                window.screenSparkles = screenSparkles;
            } catch (error) {
                console.error('❌ Failed to initialize screen sparkles (fallback):', error);
            }
        }
    }, 100);
}