/* =============================================
   MATRIX MISSIONS - Scroll Animations
   Intersection Observer Based Reveals
   ============================================= */

class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger count-up for statistics
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateNumber(entry.target);
                    }

                    // Unobserve after animation (one-time animation)
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        // Observe all elements with animate-on-scroll class
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => this.observer.observe(el));

        // Observe stat numbers for count-up
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => this.observer.observe(el));
    }

    animateNumber(element) {
        const target = parseInt(element.dataset.target) || 0;
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out curve for natural feel
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easeOut);

            element.textContent = prefix + currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = prefix + target + suffix;
            }
        };

        requestAnimationFrame(updateNumber);
    }
}

// Parallax effect for hero background
class ParallaxEffect {
    constructor() {
        this.heroBackground = document.querySelector('.hero-bg');
        if (this.heroBackground) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (this.heroBackground) {
            this.heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimator();
    new ParallaxEffect();
});

// Re-observe elements after page transitions (for SPA-like behavior)
window.observeNewElements = () => {
    const animator = new ScrollAnimator();
};
