/**
 * Magical Effects System - Adds interactive magical effects throughout the page
 */

class MagicalEffectsSystem {
    constructor() {
        this.effects = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isInitialized = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseTime = 0;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createCanvas();
        this.bindEvents();
        this.animate();
        this.startAmbientSparkles(); // Add ambient sparkles
        
        this.isInitialized = true;
        console.log('✨ Magical effects system initialized');
    }
    
    createCanvas() {
        let canvas = document.getElementById('magical-effects-canvas');
        
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'magical-effects-canvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '9996'; // Above everything but below cursor
            canvas.style.opacity = '0.6'; // Reduced opacity for subtlety
            
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
    
    createMagicalTrail(x, y) {
        if (this.reducedMotion) return;
        
        const now = Date.now();
        if (now - this.lastMouseTime < 40) return; // More frequent for better visibility
        
        this.lastMouseTime = now;
        
        // Create vibrant bubble trail with dark purple, dark blue, and light blue colors
        const bubbleTrailColors = [
            'rgba(88, 28, 135, 0.9)',   // Dark purple - more opaque
            'rgba(30, 58, 138, 0.9)',   // Dark blue - more opaque
            'rgba(59, 130, 246, 0.9)',  // Light blue - more opaque
            'rgba(67, 56, 202, 0.9)',   // Medium purple-blue
            'rgba(37, 99, 235, 0.9)',   // Medium blue
            'rgba(147, 51, 234, 0.9)'   // Purple
        ];
        
        // Create more visible trailing bubbles
        for (let i = 0; i < 4; i++) { // More bubbles per frame
            const bubbleSize = Math.random() * 8 + 4; // Larger bubbles
            const offsetX = (Math.random() - 0.5) * 25;
            const offsetY = (Math.random() - 0.5) * 25;
            
            this.effects.push({
                x: x + offsetX,
                y: y + offsetY,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8 - 0.8, // More upward drift
                size: bubbleSize,
                color: bubbleTrailColors[Math.floor(Math.random() * bubbleTrailColors.length)],
                opacity: 1.0, // Full opacity for visibility
                life: 1,
                maxLife: Math.random() * 60 + 40, // Longer life
                type: 'trail-bubble',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                initialSize: bubbleSize,
                pulsePhase: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.03 + 0.02,
                sparklePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Add some sparkly trail elements for fun
        for (let i = 0; i < 2; i++) {
            this.effects.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5 - 0.6,
                size: Math.random() * 4 + 2,
                color: bubbleTrailColors[Math.floor(Math.random() * bubbleTrailColors.length)],
                opacity: 0.9,
                life: 1,
                maxLife: Math.random() * 40 + 30,
                type: 'trail-sparkle',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                twinkleSpeed: Math.random() * 0.2 + 0.1
            });
        }
        
        // Occasionally add a larger fun bubble
        if (Math.random() < 0.4) { // More frequent large bubbles
            const largeBubbleSize = Math.random() * 12 + 10;
            this.effects.push({
                x: x + (Math.random() - 0.5) * 15,
                y: y + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4 - 1.0, // Strong upward drift
                size: largeBubbleSize,
                color: bubbleTrailColors[Math.floor(Math.random() * bubbleTrailColors.length)],
                opacity: 0.9,
                life: 1,
                maxLife: Math.random() * 80 + 60, // Even longer life for large bubbles
                type: 'trail-bubble-large',
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.03,
                initialSize: largeBubbleSize,
                pulsePhase: Math.random() * Math.PI * 2,
                floatSpeed: Math.random() * 0.02 + 0.01,
                bouncePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    createClickEffect(x, y) {
        if (this.reducedMotion) return;
        
        // Clear any existing click effects first to prevent sticking
        this.effects = this.effects.filter(effect => 
            !effect.type.includes('-click')
        );
        
        // Create adorable bubble burst effect with exactly 0.5 second duration
        const bubbleColors = [
            'rgba(88, 28, 135, 0.9)',   // Dark purple
            'rgba(30, 58, 138, 0.9)',   // Dark blue
            'rgba(59, 130, 246, 0.9)',  // Light blue
            'rgba(67, 56, 202, 0.9)',   // Medium purple-blue
            'rgba(37, 99, 235, 0.9)',   // Medium blue
            'rgba(147, 51, 234, 0.9)'   // Purple
        ];
        
        // Create main bubble ring (6 bubbles for cleaner effect)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 35 + Math.random() * 15;
            const bubbleSize = 10 + Math.random() * 6;
            
            this.effects.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 2.5,
                vy: Math.sin(angle) * 2.5,
                targetX: x + Math.cos(angle) * distance,
                targetY: y + Math.sin(angle) * distance,
                size: bubbleSize,
                color: bubbleColors[i % bubbleColors.length],
                opacity: 1,
                life: 1,
                maxLife: 30, // Exactly 0.5 seconds at 60fps
                type: 'bubble-click',
                rotation: angle,
                rotationSpeed: (Math.random() - 0.5) * 0.08,
                initialSize: bubbleSize,
                pulsePhase: Math.random() * Math.PI * 2,
                bouncePhase: 0
            });
        }
        
        // Create expanding ring effect
        this.effects.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: 5,
            color: 'rgba(59, 130, 246, 0.7)',
            opacity: 1,
            life: 1,
            maxLife: 25,
            type: 'expanding-ring-click',
            rotation: 0,
            rotationSpeed: 0.1,
            maxSize: 70
        });
        
        // Create central glow
        this.effects.push({
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: 12,
            color: 'rgba(147, 51, 234, 0.5)',
            opacity: 1,
            life: 1,
            maxLife: 20,
            type: 'glow-click',
            rotation: 0,
            rotationSpeed: 0,
            pulsePhase: 0
        });
    }
    
    createHoverEffect(element) {
        if (this.reducedMotion) return;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create sparkles around the element
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const radius = Math.max(rect.width, rect.height) / 2 + 20;
            
            this.effects.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                vx: Math.cos(angle) * 0.5,
                vy: Math.sin(angle) * 0.5,
                size: Math.random() * 4 + 2,
                color: 'rgba(255, 255, 255, 0.7)', // White sparkles
                opacity: 0.8,
                life: 1,
                maxLife: 30,
                type: 'sparkle',
                rotation: angle,
                rotationSpeed: 0.1
            });
        }
    }
    
    startAmbientSparkles() {
        if (this.reducedMotion) return;
        
        // Create ambient sparkles periodically
        setInterval(() => {
            if (this.effects.length < 50) { // Limit total effects
                this.createAmbientSparkle();
            }
        }, 2000); // Every 2 seconds
        
        // Create initial sparkles
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createAmbientSparkle();
            }, i * 300);
        }
    }
    
    createAmbientSparkle() {
        if (this.reducedMotion) return;
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        this.effects.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 3 + 1,
            color: 'rgba(255, 255, 255, 0.4)', // White ambient sparkles
            opacity: 0.6,
            life: 1,
            maxLife: Math.random() * 120 + 60, // Long-lasting ambient sparkles
            type: 'ambient',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.03 + 0.01
        });
    }
    
    getRandomMagicalColor() {
        const colors = [
            'rgba(139, 92, 246, 0.4)', // Purple
            'rgba(168, 85, 247, 0.4)', // Medium purple
            'rgba(196, 181, 253, 0.4)', // Light purple
            'rgba(255, 255, 255, 0.3)', // White
            'rgba(192, 192, 192, 0.4)', // Silver
            'rgba(220, 220, 220, 0.3)', // Light silver
            'rgba(124, 58, 237, 0.4)',  // Deep purple
            'rgba(147, 51, 234, 0.4)'   // Rich purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateEffect(effect) {
        // Update position
        effect.x += effect.vx;
        effect.y += effect.vy;
        
        // Update rotation
        effect.rotation += effect.rotationSpeed;
        
        // Update life
        effect.life -= 1 / effect.maxLife;
        effect.opacity = effect.life;
        
        // Special handling for different effect types
        if (effect.type === 'bubble-click') {
            // Main click bubbles with bouncy movement toward target
            const progress = 1 - effect.life;
            const easeOut = 1 - Math.pow(1 - progress, 3); // Smooth easing
            
            // Move toward target position with bounce
            effect.bouncePhase += 0.15;
            const bounce = Math.sin(effect.bouncePhase) * 0.3 * effect.life; // Diminishing bounce
            
            effect.x = effect.x + (effect.targetX - effect.x) * 0.08;
            effect.y = effect.y + (effect.targetY - effect.y) * 0.08 + bounce;
            
            // Pulsing size effect
            effect.pulsePhase += 0.2;
            const pulse = Math.sin(effect.pulsePhase) * 0.3 + 1;
            effect.size = effect.initialSize * pulse * (0.5 + effect.life * 0.5);
            
            // Smooth fade out
            effect.opacity = effect.life * 0.95;
        } else if (effect.type === 'sparkle-bubble-click') {
            // Inner sparkle bubbles with twinkling
            const progress = 1 - effect.life;
            
            effect.x = effect.x + (effect.targetX - effect.x) * 0.06;
            effect.y = effect.y + (effect.targetY - effect.y) * 0.06;
            
            // Twinkling effect
            effect.pulsePhase += effect.twinkleSpeed;
            const twinkle = Math.sin(effect.pulsePhase) * 0.4 + 0.6;
            effect.opacity = effect.life * twinkle * 0.8;
            
            // Slight size variation
            effect.size = effect.initialSize * (0.8 + Math.sin(effect.pulsePhase * 0.5) * 0.2);
        } else if (effect.type === 'expanding-ring-click') {
            // Expanding ring with pulse waves
            const progress = 1 - effect.life;
            effect.size = 8 + (effect.maxSize - 8) * progress;
            
            // Create pulse waves
            effect.pulseCount += 0.3;
            const pulseWave = Math.sin(effect.pulseCount) * 0.2 + 0.8;
            effect.opacity = effect.life * 0.7 * pulseWave;
            
            effect.rotation += effect.rotationSpeed;
        } else if (effect.type === 'glow-click') {
            // Central glow with pulsing
            effect.pulsePhase += 0.15;
            const pulse = Math.sin(effect.pulsePhase) * 0.4 + 0.6;
            effect.size = 15 + pulse * 10;
            effect.opacity = effect.life * 0.4 * pulse;
        } else if (effect.type === 'heart-bubble-click') {
            // Floating heart bubbles
            effect.floatPhase += 0.1;
            effect.x = effect.x + (effect.targetX - effect.x) * 0.04;
            effect.y = effect.y + (effect.targetY - effect.y) * 0.04;
            
            // Add floating motion
            effect.x += Math.sin(effect.floatPhase) * 0.5;
            effect.y += Math.cos(effect.floatPhase * 0.7) * 0.3;
            
            effect.opacity = effect.life * 0.7;
        } else if (effect.type === 'bubble') {
            // Legacy bubble type (keeping for compatibility)
            effect.vy += 0.02;
            effect.vx *= 0.98;
            effect.vy *= 0.98;
            
            effect.pulsePhase += 0.1;
            const pulse = Math.sin(effect.pulsePhase) * 0.2 + 1;
            effect.size = effect.initialSize * pulse;
            
            effect.x += Math.sin(effect.pulsePhase * 0.5) * 0.5;
            effect.opacity = effect.life * 0.9;
        } else if (effect.type === 'trail-bubble' || effect.type === 'trail-bubble-large') {
            // Enhanced trail bubbles with more visible and fun effects
            effect.vy -= 0.015; // Stronger upward force
            effect.vx *= 0.98; // Less air resistance for more movement
            effect.vy *= 0.98;
            
            // Enhanced pulsing effect
            effect.pulsePhase += effect.floatSpeed;
            const pulse = Math.sin(effect.pulsePhase) * 0.25 + 1; // Bigger pulse
            effect.size = effect.initialSize * pulse;
            
            // More pronounced floating motion
            effect.x += Math.sin(effect.pulsePhase * 0.4) * 0.6;
            effect.y += Math.cos(effect.pulsePhase * 0.3) * 0.4;
            
            // Add sparkle effect to trail bubbles
            if (effect.sparklePhase !== undefined) {
                effect.sparklePhase += 0.1;
                const sparkle = Math.sin(effect.sparklePhase) * 0.3 + 0.7;
                effect.opacity = effect.life * sparkle;
            } else {
                effect.opacity = effect.life * 0.9;
            }
            
            // Add bouncing effect for large trail bubbles
            if (effect.type === 'trail-bubble-large' && effect.bouncePhase !== undefined) {
                effect.bouncePhase += 0.08;
                const bounce = Math.sin(effect.bouncePhase) * 0.8;
                effect.x += bounce;
            }
        } else if (effect.type === 'trail-sparkle') {
            // Fun twinkling trail sparkles
            effect.vy -= 0.01;
            effect.vx *= 0.99;
            effect.vy *= 0.99;
            
            // Strong twinkling effect
            const twinkle = Math.sin(Date.now() * effect.twinkleSpeed) * 0.5 + 0.5;
            effect.opacity = effect.life * twinkle;
            
            // Rotate for sparkle effect
            effect.rotation += effect.rotationSpeed;
        } else if (effect.type === 'sparkle-bubble') {
            // Sparkle bubbles have more erratic movement
            effect.vy += 0.03;
            effect.vx *= 0.97;
            effect.vy *= 0.97;
            
            // Add twinkling effect
            effect.opacity = (Math.sin(Date.now() * 0.01 + effect.rotation) + 1) * 0.3 + 0.2;
        } else if (effect.type === 'expanding-ring') {
            // Expanding ring grows outward
            const progress = 1 - effect.life;
            effect.size = 5 + (effect.maxSize - 5) * progress;
            effect.opacity = effect.life * 0.6;
        } else if (effect.type === 'ambient') {
            effect.twinkle += effect.twinkleSpeed;
            effect.opacity = (Math.sin(effect.twinkle) + 1) * 0.2 + 0.1; // Gentle twinkling
            
            // Gentle floating motion
            const time = Date.now() * 0.001;
            effect.y += Math.sin(time + effect.x * 0.01) * 0.1;
            effect.x += Math.cos(time + effect.y * 0.01) * 0.05;
        } else if (effect.type === 'burst' || effect.type === 'trail') {
            effect.vy += 0.05; // Reduced gravity
            effect.vx *= 0.99; // Less friction
            effect.vy *= 0.99;
        } else if (effect.type === 'glow') {
            effect.size *= 1.03; // Slower expansion
            effect.opacity = effect.life * 0.3; // More subtle
        }
        
        return effect.life > 0;
    }
    
    drawEffect(effect) {
        this.ctx.save();
        this.ctx.globalAlpha = effect.opacity;
        this.ctx.translate(effect.x, effect.y);
        this.ctx.rotate(effect.rotation);
        
        if (effect.type === 'bubble-click') {
            // Draw main click bubbles with enhanced bubble effect
            const gradient = this.ctx.createRadialGradient(
                -effect.size * 0.35, -effect.size * 0.35, 0,
                0, 0, effect.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); // Bright shine
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
            gradient.addColorStop(0.4, effect.color);
            gradient.addColorStop(0.8, effect.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)'); // Shadow
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Enhanced bubble outline
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            
            // Multiple highlights for extra bubble effect
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(-effect.size * 0.3, -effect.size * 0.3, effect.size * 0.25, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Secondary smaller highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(effect.size * 0.2, effect.size * 0.2, effect.size * 0.1, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (effect.type === 'sparkle-bubble-click') {
            // Draw twinkling sparkle bubbles
            const gradient = this.ctx.createRadialGradient(
                -effect.size * 0.2, -effect.size * 0.2, 0,
                0, 0, effect.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
            gradient.addColorStop(0.5, effect.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = effect.color;
            this.ctx.shadowBlur = 8;
            
            // Draw as a sparkling star
            this.ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                this.ctx.lineTo(0, -effect.size);
                this.ctx.rotate(Math.PI / 4);
                this.ctx.lineTo(0, -effect.size * 0.3);
                this.ctx.rotate(Math.PI / 4);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0; // Reset shadow
        } else if (effect.type === 'expanding-ring-click') {
            // Draw pulsing expanding ring
            this.ctx.strokeStyle = effect.color;
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([5, 3]); // Dashed line for magic effect
            this.ctx.lineDashOffset = -effect.rotation * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Inner solid ring
            this.ctx.setLineDash([]); // Reset dash
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else if (effect.type === 'glow-click') {
            // Draw magical central glow
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, effect.size);
            gradient.addColorStop(0, effect.color);
            gradient.addColorStop(0.3, effect.color + '60');
            gradient.addColorStop(0.7, effect.color + '20');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (effect.type === 'heart-bubble-click') {
            // Draw cute floating heart bubbles
            const gradient = this.ctx.createRadialGradient(
                -effect.size * 0.2, -effect.size * 0.2, 0,
                0, 0, effect.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            gradient.addColorStop(0.6, effect.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            
            this.ctx.fillStyle = gradient;
            
            // Draw heart shape
            this.ctx.beginPath();
            const size = effect.size;
            this.ctx.moveTo(0, size * 0.3);
            this.ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size, -size * 0.2, -size * 0.5, size * 0.1);
            this.ctx.bezierCurveTo(-size * 0.5, size * 0.3, 0, size * 0.6, 0, size);
            this.ctx.bezierCurveTo(0, size * 0.6, size * 0.5, size * 0.3, size * 0.5, size * 0.1);
            this.ctx.bezierCurveTo(size, -size * 0.2, size * 0.5, -size * 0.2, 0, size * 0.3);
            this.ctx.fill();
            
            // Add heart highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(-size * 0.2, -size * 0.1, size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (effect.type === 'bubble') {
            // Draw bubble with gradient and shine effect
            const gradient = this.ctx.createRadialGradient(
                -effect.size * 0.3, -effect.size * 0.3, 0,
                0, 0, effect.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Shine
            gradient.addColorStop(0.3, effect.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)'); // Shadow
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add bubble outline
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Add highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(-effect.size * 0.3, -effect.size * 0.3, effect.size * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (effect.type === 'trail-bubble' || effect.type === 'trail-bubble-large') {
            // Draw enhanced trail bubbles with more visibility and fun effects
            const gradient = this.ctx.createRadialGradient(
                -effect.size * 0.25, -effect.size * 0.25, 0,
                0, 0, effect.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // Brighter shine
            gradient.addColorStop(0.3, effect.color);
            gradient.addColorStop(0.7, effect.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)'); // Subtle shadow
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Enhanced outline for visibility
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Add highlight for all trail bubbles
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(-effect.size * 0.25, -effect.size * 0.25, effect.size * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Extra sparkle effect for large trail bubbles
            if (effect.type === 'trail-bubble-large') {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.beginPath();
                this.ctx.arc(effect.size * 0.15, effect.size * 0.15, effect.size * 0.1, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add glow effect
                this.ctx.shadowColor = effect.color;
                this.ctx.shadowBlur = 6;
                this.ctx.fill();
                this.ctx.shadowBlur = 0; // Reset shadow
            }
        } else if (effect.type === 'trail-sparkle') {
            // Draw fun twinkling trail sparkles
            this.ctx.fillStyle = effect.color;
            this.ctx.shadowColor = effect.color;
            this.ctx.shadowBlur = 10;
            
            // Draw as a 6-pointed star for more sparkle
            this.ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                this.ctx.lineTo(0, -effect.size);
                this.ctx.rotate(Math.PI / 6);
                this.ctx.lineTo(0, -effect.size * 0.4);
                this.ctx.rotate(Math.PI / 6);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.shadowBlur = 0; // Reset shadow
        } else if (effect.type === 'sparkle-bubble') {
            // Draw sparkle bubble as a star with bubble effect
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
        } else if (effect.type === 'expanding-ring') {
            // Draw expanding ring
            this.ctx.strokeStyle = effect.color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Add inner glow
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        } else if (effect.type === 'glow') {
            // Create radial gradient for glow
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, effect.size);
            gradient.addColorStop(0, effect.color);
            gradient.addColorStop(0.5, effect.color + '40');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (effect.type === 'sparkle' || effect.type === 'ambient') {
            // Draw sparkle as a star
            this.ctx.fillStyle = effect.color;
            this.ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                this.ctx.lineTo(0, -effect.size);
                this.ctx.rotate(Math.PI / 4);
                this.ctx.lineTo(0, -effect.size * 0.3);
                this.ctx.rotate(Math.PI / 4);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            // Add a subtle glow for ambient sparkles
            if (effect.type === 'ambient') {
                this.ctx.shadowColor = effect.color;
                this.ctx.shadowBlur = 8;
                this.ctx.fill();
            }
        } else {
            // Draw regular particle
            this.ctx.fillStyle = effect.color;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw effects
        this.effects = this.effects.filter(effect => {
            const alive = this.updateEffect(effect);
            if (alive) {
                this.drawEffect(effect);
            }
            return alive;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        // Mouse movement for trail effect
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createMagicalTrail(e.clientX, e.clientY);
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.btn, .project-card, .skill-tag, .experience-item, .social-link, .nav-links a'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createHoverEffect(element);
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            if (this.reducedMotion) {
                this.effects = []; // Clear all effects
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

// Initialize magical effects system
document.addEventListener('DOMContentLoaded', () => {
    try {
        const magicalEffects = new MagicalEffectsSystem();
        window.magicalEffects = magicalEffects;
    } catch (error) {
        console.error('❌ Failed to initialize magical effects:', error);
    }
});

// Fallback initialization
if (document.readyState !== 'loading') {
    setTimeout(() => {
        if (!window.magicalEffects) {
            try {
                const magicalEffects = new MagicalEffectsSystem();
                window.magicalEffects = magicalEffects;
            } catch (error) {
                console.error('❌ Failed to initialize magical effects (fallback):', error);
            }
        }
    }, 100);
}