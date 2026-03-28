/* =============================================
   MATRIX MISSIONS - Main JavaScript
   Navigation, Smooth Scroll, Page Transitions
   ============================================= */

// Scroll to top on page load/refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initPageTransitions();
    initParticles();
});

/* ========== Navigation ========== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class for background
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });
}

/* ========== Smooth Scroll for Anchor Links ========== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========== Page Transitions ========== */
function initPageTransitions() {
    // Add page-transition class to main content on load
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('page-transition');
    }

    // Handle internal navigation with fade effect
    document.querySelectorAll('a:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html')) {
                e.preventDefault();

                // Fade out
                if (main) {
                    main.style.opacity = '0';
                    main.style.transform = 'translateY(10px)';
                }

                // Navigate after short delay
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            }
        });
    });
}

/* ========== Animated Particles for Hero ========== */
function initParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    // Create ambient particles
    const particleCount = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Random properties
    const size = Math.random() * 4 + 1;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.5 + 0.1;

    particle.style.cssText = `
    position: absolute;
    left: ${x}%;
    top: ${y}%;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, rgba(212, 168, 83, ${opacity}) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
  `;

    container.appendChild(particle);
}

/* ========== Form Handling ========== */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show success state (visual only for now)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            // Reset after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });
}

// Initialize form if on contact page
if (document.querySelector('.contact-form')) {
    initContactForm();
}

/* ========== Utility Functions ========== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ========== Job Card Toggle ========== */
function toggleJob(header) {
    const card = header.closest('.job-card');
    const allCards = document.querySelectorAll('.job-card');

    // Close other cards
    allCards.forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('active');
        }
    });

    // Toggle current card
    card.classList.toggle('active');
}
