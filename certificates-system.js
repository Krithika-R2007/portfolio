/**
 * Certificates Carousel System
 * Handles the rotating certificates with hover pause functionality
 */

class CertificatesCarousel {
    constructor() {
        this.track = null;
        this.isHovered = false;
        this.currentSpeed = 1;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.track = document.getElementById('certificatesTrack');
        if (!this.track) return;

        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.addKeyboardNavigation();
    }

    setupEventListeners() {
        // Hover pause functionality
        this.track.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.track.style.animationPlayState = 'paused';
        });

        this.track.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.track.style.animationPlayState = 'running';
        });

        // Individual certificate hover effects
        const certificates = this.track.querySelectorAll('.certificate-item');
        certificates.forEach((cert, index) => {
            cert.addEventListener('mouseenter', () => {
                this.onCertificateHover(cert, index);
            });

            cert.addEventListener('mouseleave', () => {
                this.onCertificateLeave(cert, index);
            });

            // Click to view larger
            cert.addEventListener('click', () => {
                this.showCertificateModal(cert, index);
            });
        });

        // Touch support for mobile
        this.setupTouchSupport();
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.track.style.animationPlayState = 'paused';
        });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.track.style.animationPlayState = 'running';
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            // Add a subtle speed change effect on swipe
            this.track.style.animationDuration = '20s';
            setTimeout(() => {
                this.track.style.animationDuration = '30s';
            }, 2000);
        }
    }

    setupIntersectionObserver() {
        // Pause animation when not in view to save performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.track.style.animationPlayState = 'running';
                } else {
                    this.track.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.track);
    }

    onCertificateHover(cert, index) {
        // Add subtle glow effect
        cert.style.boxShadow = '0 20px 40px rgba(107, 33, 168, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)';
        
        // Add cursor pointer
        cert.style.cursor = 'pointer';
        
        // Slight rotation for visual interest
        cert.style.transform = 'scale(1.05) translateY(-10px) rotate(2deg)';
    }

    onCertificateLeave(cert, index) {
        // Reset styles
        cert.style.boxShadow = '';
        cert.style.cursor = '';
        cert.style.transform = '';
    }

    showCertificateModal(cert, index) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img src="${cert.querySelector('img').src}" alt="${cert.querySelector('img').alt}" class="modal-image">
                    <div class="modal-info">
                        <h3>Certificate ${(index % 10) + 1}</h3>
                        <p>Click outside or press ESC to close</p>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyles = `
            .certificate-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
            }
            
            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: var(--bg-card);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: scaleIn 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text);
                cursor: pointer;
                z-index: 10001;
            }
            
            .modal-image {
                width: 100%;
                height: auto;
                max-height: 70vh;
                object-fit: contain;
                border-radius: 15px;
            }
            
            .modal-info {
                text-align: center;
                margin-top: 15px;
                color: var(--text);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;

        // Add styles to head if not already present
        if (!document.querySelector('#certificate-modal-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'certificate-modal-styles';
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
        }

        // Add modal to body
        document.body.appendChild(modal);

        // Close modal functionality
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        // Close button
        modal.querySelector('.modal-close').addEventListener('click', closeModal);

        // Click outside to close
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeModal();
            }
        });

        // ESC key to close
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }

    addKeyboardNavigation() {
        // Add keyboard accessibility
        const certificates = this.track.querySelectorAll('.certificate-item');
        certificates.forEach((cert, index) => {
            cert.setAttribute('tabindex', '0');
            cert.setAttribute('role', 'button');
            cert.setAttribute('aria-label', `View Certificate ${(index % 10) + 1}`);

            cert.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showCertificateModal(cert, index);
                }
            });
        });
    }

    // Public methods for external control
    pause() {
        this.track.style.animationPlayState = 'paused';
    }

    resume() {
        if (!this.isHovered) {
            this.track.style.animationPlayState = 'running';
        }
    }

    setSpeed(speed) {
        this.currentSpeed = speed;
        const duration = 30 / speed;
        this.track.style.animationDuration = `${duration}s`;
    }
}

// Initialize certificates carousel when DOM is ready
let certificatesCarousel;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        certificatesCarousel = new CertificatesCarousel();
    });
} else {
    certificatesCarousel = new CertificatesCarousel();
}

// Export for global access
window.certificatesCarousel = certificatesCarousel;

// Handle reduced motion preference
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', () => {
        const track = document.getElementById('certificatesTrack');
        if (track) {
            track.style.animation = 'none';
            track.style.justifyContent = 'center';
            track.style.flexWrap = 'wrap';
        }
    });
}