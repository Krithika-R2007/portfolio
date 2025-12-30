/**
 * EffectManager Component
 * Handles ripple and sparkle effects without interfering with cursor tracking
 * Requirements: 2.1, 2.2, 4.4, 5.2
 */

class EffectManager {
    constructor(cursorTracker) {
        // Dependency injection - cursor tracker for position data
        this.cursorTracker = cursorTracker;
        
        // Effect state management
        this.activeEffects = [];
        this.effectIdCounter = 0;
        this.maxEffects = 50; // Limit for performance
        
        // Canvas for rendering effects
        this.canvas = null;
        this.ctx = null;
        
        // Animation state
        this.animationId = null;
        this.isAnimating = false;
        
        // Performance monitoring
        this.lastCleanupTime = 0;
        this.cleanupInterval = 1000; // Cleanup every second
        
        // Accessibility
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
        console.log('EffectManager initialized with isolated state');
    }

    /**
     * Initialize the effect manager
     * Requirements: 2.1, 2.2 - Effect isolation
     */
    init() {
        this.createCanvas();
        this.bindEvents();
        this.startAnimation();
        
        console.log('EffectManager ready for effect creation');
    }

    /**
     * Create canvas for effect rendering
     * Requirements: 2.1 - Ripple effects don't interfere with position updates
     */
    createCanvas() {
        // Remove existing canvas if present
        const existingCanvas = document.getElementById('effect-manager-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'effect-manager-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
            opacity: 0.8;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    /**
     * Resize canvas to match window dimensions
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // Handle reduced motion preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                this.clearAllEffects();
            }
        });
    }

    /**
     * Create ripple effect at specified position
     * Requirements: 2.1 - Ripple effects don't interfere with position updates
     */
    createRippleEffect(x, y, options = {}) {
        if (this.reducedMotion) return null;

        // Use cursor position if not provided, but don't modify it
        const position = this.cursorTracker ? this.cursorTracker.getCurrentPosition() : { x, y };
        const effectX = x !== undefined ? x : position.x;
        const effectY = y !== undefined ? y : position.y;

        // Validate position
        if (!this.isValidPosition(effectX, effectY)) {
            console.warn('Invalid position for ripple effect:', effectX, effectY);
            return null;
        }

        const effectId = this.generateEffectId();
        const rippleEffect = {
            id: effectId,
            type: 'ripple',
            x: effectX,
            y: effectY,
            startTime: performance.now(),
            duration: options.duration || 800,
            maxRadius: options.maxRadius || 150,
            color: options.color || 'rgba(139, 92, 246, 0.6)',
            lineWidth: options.lineWidth || 3,
            isActive: true,
            
            // Animation properties
            currentRadius: 0,
            opacity: 1,
            
            // Cleanup tracking
            lastUpdateTime: performance.now()
        };

        this.addEffect(rippleEffect);
        return effectId;
    }

    /**
     * Create sparkle effects at specified position
     * Requirements: 2.2 - Sparkle effects are independent of trail positioning
     */
    createSparkleEffect(x, y, options = {}) {
        if (this.reducedMotion) return [];

        // Use cursor position if not provided, but don't modify it
        const position = this.cursorTracker ? this.cursorTracker.getCurrentPosition() : { x, y };
        const effectX = x !== undefined ? x : position.x;
        const effectY = y !== undefined ? y : position.y;

        // Validate position
        if (!this.isValidPosition(effectX, effectY)) {
            console.warn('Invalid position for sparkle effect:', effectX, effectY);
            return [];
        }

        const sparkleCount = options.count || 6;
        const sparkleIds = [];

        // Create burst of sparkles
        for (let i = 0; i < sparkleCount; i++) {
            const angle = (i / sparkleCount) * Math.PI * 2;
            const distance = options.distance || (30 + Math.random() * 20);
            const sparkleSize = options.size || (4 + Math.random() * 4);
            
            const effectId = this.generateEffectId();
            const sparkleEffect = {
                id: effectId,
                type: 'sparkle',
                x: effectX,
                y: effectY,
                targetX: effectX + Math.cos(angle) * distance,
                targetY: effectY + Math.sin(angle) * distance,
                startTime: performance.now(),
                duration: options.duration || 600,
                size: sparkleSize,
                color: options.color || this.getRandomSparkleColor(),
                isActive: true,
                
                // Animation properties
                currentX: effectX,
                currentY: effectY,
                opacity: 1,
                rotation: angle,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                
                // Movement properties
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                
                // Cleanup tracking
                lastUpdateTime: performance.now()
            };

            this.addEffect(sparkleEffect);
            sparkleIds.push(effectId);
        }

        return sparkleIds;
    }

    /**
     * Create click effect combining ripple and sparkles
     * Requirements: 2.1, 2.2 - Combined effects maintain independence
     */
    createClickEffect(x, y, options = {}) {
        if (this.reducedMotion) return { ripple: null, sparkles: [] };

        // Create ripple effect
        const rippleId = this.createRippleEffect(x, y, {
            duration: options.rippleDuration || 800,
            maxRadius: options.rippleRadius || 150,
            color: options.rippleColor || 'rgba(139, 92, 246, 0.6)'
        });

        // Create sparkle effects
        const sparkleIds = this.createSparkleEffect(x, y, {
            count: options.sparkleCount || 6,
            duration: options.sparkleDuration || 600,
            distance: options.sparkleDistance || 40,
            color: options.sparkleColor
        });

        return {
            ripple: rippleId,
            sparkles: sparkleIds
        };
    }

    /**
     * Add effect to active effects list
     * Requirements: 4.4 - Automatic cleanup for unused effect elements
     */
    addEffect(effect) {
        // Check if we're at the limit
        if (this.activeEffects.length >= this.maxEffects) {
            // Remove oldest effect
            const oldestEffect = this.activeEffects.shift();
            console.log('Removed oldest effect due to limit:', oldestEffect.id);
        }

        this.activeEffects.push(effect);
        console.log(`Added ${effect.type} effect:`, effect.id);
    }

    /**
     * Update all active effects
     * Requirements: 5.2 - Effects don't modify tracking variables
     */
    updateEffects() {
        const currentTime = performance.now();
        
        // Update each effect without modifying cursor tracking variables
        this.activeEffects = this.activeEffects.filter(effect => {
            if (!effect.isActive) {
                return false;
            }

            const elapsed = currentTime - effect.startTime;
            const progress = Math.min(elapsed / effect.duration, 1);

            // Update effect based on type
            if (effect.type === 'ripple') {
                this.updateRippleEffect(effect, progress);
            } else if (effect.type === 'sparkle') {
                this.updateSparkleEffect(effect, progress);
            }

            // Update last update time for cleanup tracking
            effect.lastUpdateTime = currentTime;

            // Remove completed effects
            if (progress >= 1) {
                effect.isActive = false;
                return false;
            }

            return true;
        });

        // Perform periodic cleanup
        if (currentTime - this.lastCleanupTime > this.cleanupInterval) {
            this.performCleanup();
            this.lastCleanupTime = currentTime;
        }
    }

    /**
     * Update ripple effect animation
     * Requirements: 2.1 - Ripple effects don't interfere with position updates
     */
    updateRippleEffect(effect, progress) {
        // Smooth easing for ripple expansion
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        effect.currentRadius = effect.maxRadius * easeOut;
        effect.opacity = 1 - progress;
    }

    /**
     * Update sparkle effect animation
     * Requirements: 2.2 - Sparkle effects are independent of trail positioning
     */
    updateSparkleEffect(effect, progress) {
        // Smooth movement toward target
        const easeOut = 1 - Math.pow(1 - progress, 2);
        
        effect.currentX = effect.x + (effect.targetX - effect.x) * easeOut;
        effect.currentY = effect.y + (effect.targetY - effect.y) * easeOut;
        
        // Update rotation
        effect.rotation += effect.rotationSpeed;
        
        // Fade out
        effect.opacity = 1 - progress;
    }

    /**
     * Render all active effects
     * Requirements: 2.1, 2.2 - Effects render independently
     */
    renderEffects() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render each effect
        this.activeEffects.forEach(effect => {
            if (effect.isActive) {
                if (effect.type === 'ripple') {
                    this.renderRippleEffect(effect);
                } else if (effect.type === 'sparkle') {
                    this.renderSparkleEffect(effect);
                }
            }
        });
    }

    /**
     * Render ripple effect
     * Requirements: 2.1 - Ripple effects don't interfere with position updates
     */
    renderRippleEffect(effect) {
        this.ctx.save();
        this.ctx.globalAlpha = effect.opacity;
        
        // Draw expanding ring
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = effect.lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(effect.x, effect.y, effect.currentRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Add inner glow
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    /**
     * Render sparkle effect
     * Requirements: 2.2 - Sparkle effects are independent of trail positioning
     */
    renderSparkleEffect(effect) {
        this.ctx.save();
        this.ctx.globalAlpha = effect.opacity;
        this.ctx.translate(effect.currentX, effect.currentY);
        this.ctx.rotate(effect.rotation);
        
        // Draw sparkle as a star
        this.ctx.fillStyle = effect.color;
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 8;
        
        this.ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            this.ctx.lineTo(0, -effect.size);
            this.ctx.rotate(Math.PI / 4);
            this.ctx.lineTo(0, -effect.size * 0.3);
            this.ctx.rotate(Math.PI / 4);
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.updateEffects();
            this.renderEffects();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
        console.log('EffectManager animation started');
    }

    /**
     * Stop animation loop
     */
    stopAnimation() {
        this.isAnimating = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        console.log('EffectManager animation stopped');
    }

    /**
     * Perform automatic cleanup of unused effects
     * Requirements: 4.4 - Unused effects are cleaned up automatically
     */
    performCleanup() {
        const currentTime = performance.now();
        const cleanupThreshold = 5000; // 5 seconds
        
        const beforeCount = this.activeEffects.length;
        
        // Remove effects that haven't been updated recently
        this.activeEffects = this.activeEffects.filter(effect => {
            const timeSinceUpdate = currentTime - effect.lastUpdateTime;
            return timeSinceUpdate < cleanupThreshold;
        });
        
        const afterCount = this.activeEffects.length;
        const cleanedCount = beforeCount - afterCount;
        
        if (cleanedCount > 0) {
            console.log(`EffectManager cleaned up ${cleanedCount} unused effects`);
        }
    }

    /**
     * Clear all effects
     * Requirements: 4.4 - Automatic cleanup
     */
    clearAllEffects() {
        const clearedCount = this.activeEffects.length;
        this.activeEffects = [];
        
        if (clearedCount > 0) {
            console.log(`EffectManager cleared ${clearedCount} effects`);
        }
    }

    /**
     * Get effect by ID
     */
    getEffect(effectId) {
        return this.activeEffects.find(effect => effect.id === effectId);
    }

    /**
     * Remove specific effect
     */
    removeEffect(effectId) {
        const index = this.activeEffects.findIndex(effect => effect.id === effectId);
        if (index !== -1) {
            const removedEffect = this.activeEffects.splice(index, 1)[0];
            console.log('Removed effect:', removedEffect.id);
            return true;
        }
        return false;
    }

    /**
     * Generate unique effect ID
     */
    generateEffectId() {
        return `effect_${++this.effectIdCounter}_${Date.now()}`;
    }

    /**
     * Get random sparkle color
     */
    getRandomSparkleColor() {
        const colors = [
            'rgba(139, 92, 246, 0.8)',   // Purple
            'rgba(168, 85, 247, 0.8)',   // Medium purple
            'rgba(59, 130, 246, 0.8)',   // Blue
            'rgba(147, 51, 234, 0.8)',   // Rich purple
            'rgba(255, 255, 255, 0.8)',  // White
            'rgba(192, 132, 252, 0.8)'   // Light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Validate position coordinates
     */
    isValidPosition(x, y) {
        return (
            typeof x === 'number' && 
            typeof y === 'number' && 
            isFinite(x) && 
            isFinite(y) &&
            x >= 0 && 
            y >= 0 &&
            x <= window.innerWidth * 2 &&  // Allow some margin
            y <= window.innerHeight * 2
        );
    }

    /**
     * Get current effect statistics
     */
    getStats() {
        const stats = {
            totalEffects: this.activeEffects.length,
            rippleEffects: this.activeEffects.filter(e => e.type === 'ripple').length,
            sparkleEffects: this.activeEffects.filter(e => e.type === 'sparkle').length,
            isAnimating: this.isAnimating,
            reducedMotion: this.reducedMotion,
            maxEffects: this.maxEffects
        };
        
        return stats;
    }

    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            stats: this.getStats(),
            effects: this.activeEffects.map(effect => ({
                id: effect.id,
                type: effect.type,
                position: { x: effect.x, y: effect.y },
                isActive: effect.isActive,
                age: performance.now() - effect.startTime
            })),
            canvas: {
                width: this.canvas?.width,
                height: this.canvas?.height,
                exists: !!this.canvas
            }
        };
    }

    /**
     * Destroy the effect manager
     * Requirements: 4.4 - Cleanup
     */
    destroy() {
        console.log('Destroying EffectManager...');
        
        this.stopAnimation();
        this.clearAllEffects();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.canvas = null;
        this.ctx = null;
        this.cursorTracker = null;
        
        console.log('EffectManager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.EffectManager = EffectManager;
}

console.log('EffectManager component loaded');