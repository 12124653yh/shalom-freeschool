/**
 * Shalom Free School - Modern Scroll Animation System
 * Features:
 * - Fluid scroll reveal animations with staggered card entries
 * - Reading progress bar at top of window
 * - Sleek floating Back-to-Top button
 * - Header shadow dynamics on scroll
 * - Dynamic gallery re-observation support
 * - Prefers-reduced-motion compliant
 */

(function () {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark HTML element as JS animated
  if (!prefersReducedMotion) {
    document.documentElement.classList.add('js-scroll-anim');
  }

  // Inject Scroll Progress Bar
  function setupProgressBar() {
    if (document.querySelector('.scroll-progress-container')) return;
    const container = document.createElement('div');
    container.className = 'scroll-progress-container';
    container.setAttribute('aria-hidden', 'true');

    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    container.appendChild(bar);
    document.body.prepend(container);
    return bar;
  }

  // Inject Back to Top Button
  function setupScrollTopBtn() {
    if (document.querySelector('.scroll-top-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', '맨 위로 스크롤');
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    `;

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    document.body.appendChild(btn);
    return btn;
  }

  let observer = null;

  function initObserver() {
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  // Automatically assign reveal and stagger classes to semantic elements
  function attachRevealClasses() {
    if (prefersReducedMotion || !observer) return;

    // 1. Section headers
    document.querySelectorAll('.section-header, .page-header-simple').forEach(el => {
      if (!el.classList.contains('reveal') && !el.classList.contains('is-revealed')) {
        el.classList.add('reveal');
        observer.observe(el);
      }
    });

    // 2. Highlight/Banner cards & Intro essays
    document.querySelectorAll('.action-banner, .philo-intro-card, .curr-intro-card, .community-pledge-card, .intro-banner-card, .philo-intro-essay').forEach(el => {
      if (!el.classList.contains('reveal-scale') && !el.classList.contains('is-revealed')) {
        el.classList.add('reveal-scale');
        observer.observe(el);
      }
    });

    // 3. Grids and card collections (staggered reveal)
    const gridSelectors = [
      '.philo-cards-grid',
      '.curr-grid-preview',
      '.daily-grid',
      '.community-grid',
      '.yt-grid',
      '#gallery-grid',
      '.core-values-grid',
      '.projects-grid',
      '.subjects-grid',
      '.growth-grid',
      '.pillars-container',
      '.curr-intro-grid',
      '.pillar-points-list',
      '.overview-facts-grid'
    ];

    gridSelectors.forEach(gridSel => {
      const grids = document.querySelectorAll(gridSel);
      grids.forEach(grid => {
        const children = Array.from(grid.children);
        children.forEach((child, idx) => {
          if (!child.classList.contains('reveal-card') && !child.classList.contains('is-revealed')) {
            child.classList.add('reveal-card');
            // Stagger classes up to 6
            const staggerIdx = (idx % 6) + 1;
            child.classList.add(`stagger-${staggerIdx}`);
            observer.observe(child);
          }
        });
      });
    });

    // 4. Standalone cards or items
    document.querySelectorAll('.philo-pillar-card, .trimester-card, .trimester-large-card, .daily-flow-item').forEach((el, idx) => {
      if (!el.classList.contains('reveal-card') && !el.classList.contains('is-revealed')) {
        el.classList.add('reveal-card');
        const staggerIdx = (idx % 3) + 1;
        el.classList.add(`stagger-${staggerIdx}`);
        observer.observe(el);
      }
    });

    // 5. Explicitly marked elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-card').forEach(el => {
      if (!el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });
  }

  // Public helper to re-scan elements (e.g. after gallery images render)
  window.refreshScrollAnimations = function () {
    setTimeout(attachRevealClasses, 50);
  };

  // Scroll listener for progress bar, top button, and header
  function initScrollListener(progressBar, scrollTopBtn) {
    const header = document.querySelector('header');
    let ticking = false;

    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Update progress bar
      if (progressBar && docHeight > 0) {
        const progress = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
        progressBar.style.width = progress + '%';
      }

      // Update Back to Top button visibility
      if (scrollTopBtn) {
        if (scrollY > 350) {
          scrollTopBtn.classList.add('is-visible');
        } else {
          scrollTopBtn.classList.remove('is-visible');
        }
      }

      // Update Header styling
      if (header) {
        if (scrollY > 30) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    onScroll();
  }

  // Bootstrap when DOM is ready
  function init() {
    const progressBar = setupProgressBar();
    const scrollTopBtn = setupScrollTopBtn();

    initObserver();
    attachRevealClasses();
    initScrollListener(progressBar, scrollTopBtn);

    // Initial trigger for elements already in viewport
    setTimeout(() => {
      attachRevealClasses();
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
