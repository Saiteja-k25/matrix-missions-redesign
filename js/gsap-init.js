/* =============================================
   MATRIX MISSIONS - GSAP Premium Animations
   Lenis + ScrollTrigger + Advanced Effects
   ============================================= */

// Mobile detection
const isMobile = window.matchMedia('(max-width: 767px)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGSAP();
  initScrollProgress();

  // Only enable complex interactions on desktop
  if (!isMobile && !isTouch) {
    initMagneticButtons();
    init3DCards();
  }
});

/* ========== Lenis Smooth Scroll ========== */
let lenis;

function initLenis() {
  // Skip Lenis on reduced motion preference
  if (prefersReducedMotion) {
    return;
  }

  lenis = new Lenis({
    duration: isMobile ? 0.8 : 1.2, // Faster on mobile
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false, // Native scroll on touch
    touchMultiplier: 2,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* ========== GSAP Initialization ========== */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero animations (kept)
  animateHero();

  // Hero scroll-away effect (kept)
  animateHeroScrollAway();

  // Non-hero animations DISABLED to prevent invisible text issue.
  // These used fromTo with opacity:0 which hid content if ScrollTrigger didn't fire.
  // animateSections();
  // animateServiceCards();
  // animateTrustSection();
  // animateCTA();
  // animateGenericContent();

  // Parallax effects (kept - hero only)
  initParallax();
}

/* ========== Hero Scroll Away Animation ========== */
function animateHeroScrollAway() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent || isMobile) return; // Skip on mobile for performance

  gsap.to('.hero-content', {
    y: -100,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '80% top',
      scrub: 1
    }
  });

  // Parallax on hero background elements
  gsap.to('.cinematic-mesh, .hero-gradient-orb', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ========== Cinematic Hero Animation ========== */
/* ========== Cinematic Hero Animation ========== */
function animateHero() {
  // Master Timeline
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power2.out' }
  });

  // 1. Intro Logo Reveal Sequence
  const introLogo = document.querySelector('.intro-logo');
  const introContainer = document.querySelector('.intro-logo-container');

  if (introLogo && introContainer) {
    // Reveal Logo
    heroTimeline.to(introLogo, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out'
    })
      .to(introLogo, {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.in',
        delay: 0.5
      })
      .to(introContainer, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(introContainer, { display: 'none' });
          initLogoEffects(); // Trigger navbar/footer logo effects after intro
        }
      });
  } else {
    // If no intro (e.g. removed or not found), trigger effects immediately
    initLogoEffects();
  }

  // 2. Hero Elements Reveal (Starts slightly before logo fade out ends)
  // Fix: Define hasIntro based on existence of intro container
  const hasIntro = document.querySelector('.intro-logo-container') !== null;
  const revealDelay = hasIntro ? '-=0.3' : 0;

  try {
      // Background elements fade in
      heroTimeline.fromTo('.hero-gradient-mesh, .hero-gradient-orb, .hero-trading-line, .hero-particles',
        { opacity: 0 },
        { opacity: 1, duration: 1.5, stagger: 0.2 },
        revealDelay
      );
  } catch (error) {
      console.warn("GSAP Animation Error:", error);
  }

  // Badge
  heroTimeline.fromTo('.hero-badge',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    '-=1.2'
  );

  // Title with Stagger
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    // Ensure visibility
    gsap.set('.hero-title', { opacity: 1 });

    // High-end simple reveal: Slide up with opacity
    heroTimeline.fromTo('.hero-title',
      {
        opacity: 0,
        y: 40,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      },
      '-=0.8'
    );
  }

  // Subtitle
  heroTimeline.fromTo('.hero-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=1.0'
  );

  // CTA
  heroTimeline.fromTo('.hero-cta',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.6'
  );

  // 3. Scroll Effects (Parallax & Scale)

  // Text Scale on Scroll
  gsap.to('.hero-title', {
    scale: 1.05,
    transformOrigin: 'center center',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Start ambient animations
  animateAmbient();
}

/* ========== Logo Effects (Laser & Periodic) ========== */
function initLogoEffects() {
  const logoWrappers = document.querySelectorAll('.logo-wrapper');

  logoWrappers.forEach(wrapper => {
    // 1. Trigger Laser Scan (One-time)
    wrapper.classList.add('logo-laser-sweep');

    // 2. Remove Laser after animation & Add Periodic Scan
    setTimeout(() => {
      wrapper.classList.remove('logo-laser-sweep');
      wrapper.classList.add('logo-periodic-sweep');
    }, 800); // 0.6s animation + buffer
  });
}

/* ========== Ambient Animations ========== */
function animateAmbient() {
  // Ambient Gradient Orb Animations
  gsap.to('.hero-gradient-orb-1', {
    y: -80,
    x: 50,
    duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  gsap.to('.hero-gradient-orb-2', {
    y: 60,
    x: -40,
    duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  gsap.to('.hero-gradient-orb-3', {
    y: -40,
    x: 60,
    scale: 1.15,
    duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  // Mesh rotation
  gsap.to('.hero-gradient-mesh', {
    rotation: 3, duration: 30, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  // Shapes
  gsap.to('.hero-shape-1', {
    y: -30, rotation: 10, duration: 15, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  gsap.to('.hero-shape-2', {
    y: 25, rotation: -5, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  gsap.to('.hero-shape-3', {
    y: -20, x: 15, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
}

/* ========== Consistent Animation Config ========== */
const ANIMATION_CONFIG = {
  // Timing (faster on mobile for responsiveness)
  duration: {
    fast: isMobile ? 0.4 : 0.6,
    normal: isMobile ? 0.6 : 0.9,
    slow: isMobile ? 0.8 : 1.2,
    verySlow: isMobile ? 1 : 1.5
  },
  // Stagger delays (reduced on mobile)
  stagger: {
    fast: isMobile ? 0.05 : 0.08,
    normal: isMobile ? 0.08 : 0.12,
    slow: isMobile ? 0.1 : 0.18
  },
  // Easing
  ease: {
    smooth: 'power2.out',
    bounce: isMobile ? 'power2.out' : 'back.out(1.4)', // Simpler on mobile
    premium: 'power3.out'
  },
  // Scroll trigger defaults (earlier trigger on mobile)
  scroll: {
    start: isMobile ? 'top 90%' : 'top 85%',
    startCards: isMobile ? 'top 88%' : 'top 80%'
  }
};

/* ========== Section Reveals ========== */
function animateSections() {
  // Generic sections - fade + slide
  gsap.utils.toArray('.section').forEach(section => {
    // Skip hero section
    if (section.classList.contains('hero')) return;

    const header = section.querySelector('.section-header');
    const label = section.querySelector('.section-label');
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');

    // Create section timeline for coordinated animations
    const sectionTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: ANIMATION_CONFIG.scroll.start,
        toggleActions: 'play none none none'
      }
    });

    // Section label - first element
    if (label) {
      sectionTl.fromTo(label,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: ANIMATION_CONFIG.duration.normal,
          ease: ANIMATION_CONFIG.ease.bounce
        },
        0
      );
    }

    // Section title - follows label
    if (title) {
      sectionTl.fromTo(title,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.duration.slow,
          ease: ANIMATION_CONFIG.ease.premium
        },
        0.15
      );
    }

    // Section subtitle - follows title
    if (subtitle) {
      sectionTl.fromTo(subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.duration.normal,
          ease: ANIMATION_CONFIG.ease.smooth
        },
        0.3
      );
    }
  });

  // Page headers (for subpages)
  gsap.utils.toArray('.page-header').forEach(header => {
    const content = header.querySelector('.page-header-content');
    if (!content) return;

    const elements = content.children;

    gsap.fromTo(elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.slow,
        stagger: ANIMATION_CONFIG.stagger.slow,
        ease: ANIMATION_CONFIG.ease.premium,
        scrollTrigger: {
          trigger: header,
          start: 'top 90%'
        }
      }
    );
  });

  // Standalone section headers (for consistency)
  gsap.utils.toArray('.section-header').forEach(header => {
    // Skip if already in a .section (handled above)
    if (header.closest('.section')) return;

    gsap.fromTo(header.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.normal,
        stagger: ANIMATION_CONFIG.stagger.normal,
        ease: ANIMATION_CONFIG.ease.premium,
        scrollTrigger: {
          trigger: header,
          start: ANIMATION_CONFIG.scroll.start
        }
      }
    );
  });
}

/* ========== Service Cards Animation ========== */
function animateServiceCards() {
  gsap.utils.toArray('.services-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.service-card');

    gsap.fromTo(cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.duration.slow,
        stagger: ANIMATION_CONFIG.stagger.slow,
        ease: ANIMATION_CONFIG.ease.premium,
        scrollTrigger: {
          trigger: grid,
          start: ANIMATION_CONFIG.scroll.startCards,
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ========== Trust Section Animation ========== */
function animateTrustSection() {
  // Trust cards with subtle 3D reveal
  gsap.utils.toArray('.trust-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.trust-card');

    gsap.fromTo(cards,
      {
        opacity: 0,
        y: 50,
        rotateY: -10,
        transformPerspective: 1000
      },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: ANIMATION_CONFIG.duration.slow,
        stagger: ANIMATION_CONFIG.stagger.slow,
        ease: ANIMATION_CONFIG.ease.premium,
        scrollTrigger: {
          trigger: grid,
          start: ANIMATION_CONFIG.scroll.startCards,
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Animate stat numbers (count up)
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.target) || parseInt(stat.textContent) || 100;
    const suffix = stat.dataset.suffix || '+';

    gsap.fromTo(stat,
      { textContent: 0 },
      {
        textContent: target,
        duration: 2.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: stat,
          start: ANIMATION_CONFIG.scroll.start,
        },
        onUpdate: function () {
          stat.textContent = Math.round(this.targets()[0].textContent) + suffix;
        }
      }
    );
  });
}

/* ========== CTA Section Animation ========== */
function animateCTA() {
  gsap.utils.toArray('.cta-section').forEach(cta => {
    const content = cta.querySelector('.cta-content');
    if (!content) return;

    // Animate all children of CTA content
    const children = content.children;

    gsap.fromTo(children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.slow,
        stagger: ANIMATION_CONFIG.stagger.normal,
        ease: ANIMATION_CONFIG.ease.premium,
        scrollTrigger: {
          trigger: cta,
          start: ANIMATION_CONFIG.scroll.startCards,
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ========== Generic Content Animations ========== */
function animateGenericContent() {
  // Animate any element with data-animate attribute
  gsap.utils.toArray('[data-animate]').forEach(el => {
    const animationType = el.dataset.animate || 'fade-up';
    const delay = parseFloat(el.dataset.delay) || 0;

    let fromVars = { opacity: 0, y: 40 };

    switch (animationType) {
      case 'fade-left':
        fromVars = { opacity: 0, x: -40 };
        break;
      case 'fade-right':
        fromVars = { opacity: 0, x: 40 };
        break;
      case 'scale':
        fromVars = { opacity: 0, scale: 0.9 };
        break;
      case 'fade':
        fromVars = { opacity: 0 };
        break;
      default:
        fromVars = { opacity: 0, y: 40 };
    }

    gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.duration.normal,
      delay: delay,
      ease: ANIMATION_CONFIG.ease.premium,
      scrollTrigger: {
        trigger: el,
        start: ANIMATION_CONFIG.scroll.start,
        toggleActions: 'play none none none'
      }
    });
  });

  // Animate feature lists, bullet points, etc.
  gsap.utils.toArray('.policy-section, .feature-list, .benefits-list').forEach(container => {
    const items = container.querySelectorAll('li, .feature-item, .benefit-item');
    if (items.length === 0) return;

    gsap.fromTo(items,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_CONFIG.duration.normal,
        stagger: ANIMATION_CONFIG.stagger.fast,
        ease: ANIMATION_CONFIG.ease.smooth,
        scrollTrigger: {
          trigger: container,
          start: ANIMATION_CONFIG.scroll.start,
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Animate images with reveal effect
  gsap.utils.toArray('.img-reveal, .about-image, .team-image').forEach(img => {
    gsap.fromTo(img,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.duration.verySlow,
        ease: ANIMATION_CONFIG.ease.smooth,
        scrollTrigger: {
          trigger: img,
          start: ANIMATION_CONFIG.scroll.start,
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ========== Parallax Effects ========== */
function initParallax() {
  // Hero background parallax
  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Parallax layers
  gsap.utils.toArray('.parallax-layer').forEach(layer => {
    const speed = layer.dataset.speed || 0.5;

    gsap.to(layer, {
      yPercent: speed * 50,
      ease: 'none',
      scrollTrigger: {
        trigger: layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/* ========== Scroll Progress Bar ========== */
function initScrollProgress() {
  // Create progress bar if not exists
  if (!document.querySelector('.scroll-progress')) {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
  }

  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });

  // Set initial state
  gsap.set('.scroll-progress', { scaleX: 0 });
}

/* ========== Magnetic Buttons ========== */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

/* ========== 3D Card Tilt ========== */
function init3DCards() {
  const cards = document.querySelectorAll('.service-card, .trust-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}

/* ========== Page Transition ========== */
function pageTransition(url) {
  gsap.to('main', {
    opacity: 0,
    y: -30,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      window.location.href = url;
    }
  });
}

// Smooth scroll to anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, {
        offset: -80,
        duration: 1.2
      });
    }
  });
});
