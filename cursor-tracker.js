/**
 * CursorTracker Component
 * Handles isolated cursor position tracking without interference from click effects
 * Requirements: 5.1, 5.2, 5.3
 */

class CursorTracker {
    constructor() {
        // Core position state - isolated from effects
        this.mouseX = 0;
        this.mouseY = 0;
        this.previousX = 0;
        this.previousY = 0;
        
        // Tracking state
        this.isTracking = true;
        this.isInitialized = false;
        
        // Velocity tracking for validation
        this.velocity = { x: 0, y: 0 };
        this.lastUpdateTime = 0;
        
        // State validation
        this.stateVersion = 0;
        this.lastValidState = null;
        
        console.log('CursorTracker initialized with isolated state');
    }

    /**
     * Update cursor position with validation and consistency checks
     * Requirements: 5.1 - Position variables update consistently
     */
    updatePosition(x, y) {
        if (!this.isTracking) {
            return false;
        }

        // Validate input parameters
        if (!this.isValidPosition(x, y)) {
            console.warn('Invalid position provided to CursorTracker:', x, y);
            return false;
        }

        // Store previous position before updating
        this.previousX = this.mouseX;
        this.previousY = this.mouseY;

        // Calculate velocity for validation
        const currentTime = performance.now();
        if (this.lastUpdateTime > 0) {
            const deltaTime = currentTime - this.lastUpdateTime;
            if (deltaTime > 0) {
                this.velocity.x = (x - this.mouseX) / deltaTime;
                this.velocity.y = (y - this.mouseY) / deltaTime;
            }
        }

        // Update position atomically - all variables updated together
        this.mouseX = x;
        this.mouseY = y;
        this.lastUpdateTime = currentTime;
        this.stateVersion++;
        
        // Mark as initialized on first valid update
        if (!this.isInitialized) {
            this.isInitialized = true;
            console.log('CursorTracker initialized at position:', x, y);
        }

        // Store valid state snapshot for recovery
        this.lastValidState = {
            x: this.mouseX,
            y: this.mouseY,
            previousX: this.previousX,
            previousY: this.previousY,
            velocity: { ...this.velocity },
            timestamp: currentTime,
            version: this.stateVersion
        };

        return true;
    }

    /**
     * Get current cursor position without modifying state
     * Requirements: 5.2 - Effects don't modify tracking variables
     */
    getCurrentPosition() {
        return {
            x: this.mouseX,
            y: this.mouseY,
            isValid: this.isInitialized && this.isValidPosition(this.mouseX, this.mouseY)
        };
    }

    /**
     * Get position with additional metadata for effects
     * Requirements: 5.2 - Effects don't modify tracking variables
     */
    getPositionData() {
        return {
            current: { x: this.mouseX, y: this.mouseY },
            previous: { x: this.previousX, y: this.previousY },
            velocity: { ...this.velocity },
            isTracking: this.isTracking,
            isInitialized: this.isInitialized,
            stateVersion: this.stateVersion
        };
    }

    /**
     * Validate position values
     * Requirements: 5.1 - Position variables update consistently
     */
    isValidPosition(x, y) {
        // Get window dimensions safely (handle Node.js environment)
        const maxWidth = (typeof window !== 'undefined') ? window.innerWidth * 2 : 10000;
        const maxHeight = (typeof window !== 'undefined') ? window.innerHeight * 2 : 10000;
        
        return (
            typeof x === 'number' && 
            typeof y === 'number' && 
            isFinite(x) && 
            isFinite(y) &&
            x >= 0 && 
            y >= 0 &&
            x <= maxWidth &&  // Allow some margin for edge cases
            y <= maxHeight
        );
    }

    /**
     * Validate internal state consistency
     * Requirements: 5.1 - Position variables update consistently
     */
    validateState() {
        const issues = [];

        // Check position validity
        if (!this.isValidPosition(this.mouseX, this.mouseY)) {
            issues.push('Invalid current position');
        }

        if (!this.isValidPosition(this.previousX, this.previousY)) {
            issues.push('Invalid previous position');
        }

        // Check velocity sanity (not too extreme)
        const maxVelocity = 10; // pixels per millisecond
        if (Math.abs(this.velocity.x) > maxVelocity || Math.abs(this.velocity.y) > maxVelocity) {
            issues.push('Extreme velocity detected');
        }

        // Check state version consistency
        if (this.stateVersion < 0) {
            issues.push('Invalid state version');
        }

        return {
            isValid: issues.length === 0,
            issues: issues,
            state: {
                position: { x: this.mouseX, y: this.mouseY },
                previous: { x: this.previousX, y: this.previousY },
                velocity: { ...this.velocity },
                version: this.stateVersion,
                tracking: this.isTracking,
                initialized: this.isInitialized
            }
        };
    }

    /**
     * Recover from state corruption
     * Requirements: 5.3 - Animation restart preserves position
     */
    recoverState() {
        if (!this.lastValidState) {
            console.warn('No valid state available for recovery, resetting to origin');
            this.resetToOrigin();
            return false;
        }

        console.log('Recovering CursorTracker state from last valid state');
        
        // Restore from last valid state
        this.mouseX = this.lastValidState.x;
        this.mouseY = this.lastValidState.y;
        this.previousX = this.lastValidState.previousX;
        this.previousY = this.lastValidState.previousY;
        this.velocity = { ...this.lastValidState.velocity };
        this.stateVersion = this.lastValidState.version + 1; // Increment to mark recovery
        this.lastUpdateTime = performance.now();

        return true;
    }

    /**
     * Reset to safe origin state
     * Requirements: 5.3 - Animation restart preserves position
     */
    resetToOrigin() {
        console.log('Resetting CursorTracker to origin state');
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.previousX = 0;
        this.previousY = 0;
        this.velocity = { x: 0, y: 0 };
        this.isInitialized = false;
        this.stateVersion = 0;
        this.lastUpdateTime = 0;
        this.lastValidState = null;
    }

    /**
     * Enable/disable tracking
     * Requirements: 5.2 - Effects don't modify tracking variables
     */
    setTracking(enabled) {
        const wasTracking = this.isTracking;
        this.isTracking = Boolean(enabled);
        
        if (wasTracking !== this.isTracking) {
            console.log('CursorTracker tracking state changed:', this.isTracking);
        }
        
        return this.isTracking;
    }

    /**
     * Get tracking status without modifying state
     */
    isTrackingEnabled() {
        return this.isTracking;
    }

    /**
     * Get distance moved since last update
     */
    getMovementDistance() {
        if (!this.isInitialized) {
            return 0;
        }
        
        const dx = this.mouseX - this.previousX;
        const dy = this.mouseY - this.previousY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if cursor has moved significantly
     */
    hasSignificantMovement(threshold = 1) {
        return this.getMovementDistance() > threshold;
    }

    /**
     * Get current velocity magnitude
     */
    getVelocityMagnitude() {
        return Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    }

    /**
     * Create immutable snapshot of current state
     * Requirements: 5.2 - Effects don't modify tracking variables
     */
    createStateSnapshot() {
        return Object.freeze({
            position: Object.freeze({ x: this.mouseX, y: this.mouseY }),
            previous: Object.freeze({ x: this.previousX, y: this.previousY }),
            velocity: Object.freeze({ ...this.velocity }),
            metadata: Object.freeze({
                isTracking: this.isTracking,
                isInitialized: this.isInitialized,
                stateVersion: this.stateVersion,
                timestamp: this.lastUpdateTime
            })
        });
    }

    /**
     * Debug information
     */
    getDebugInfo() {
        return {
            position: { x: this.mouseX, y: this.mouseY },
            previous: { x: this.previousX, y: this.previousY },
            velocity: { ...this.velocity },
            state: {
                tracking: this.isTracking,
                initialized: this.isInitialized,
                version: this.stateVersion,
                lastUpdate: this.lastUpdateTime
            },
            validation: this.validateState(),
            movement: {
                distance: this.getMovementDistance(),
                velocityMagnitude: this.getVelocityMagnitude()
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CursorTracker;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.CursorTracker = CursorTracker;
}

console.log('CursorTracker component loaded');