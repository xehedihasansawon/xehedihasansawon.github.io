(() => {
  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  if (reducedMotionQuery?.matches || !('IntersectionObserver' in window)) {
    return;
  }

  const root = document.documentElement;
  root.classList.add('motion-system');

  const introTargets = [
    ['#home .hero-v5-topline', 40, false],
    ['#home .hero-v5-eyebrow', 90, false],
    ['#home h1', 140, false],
    ['#home .hero-v5-role', 200, false],
    ['#home .hero-v5-actions', 255, false],
    ['#home .hero-v5-meta', 310, false],
    ['#home .hero-v5-visual', 120, true]
  ];

  introTargets.forEach(([selector, delay, fromRight]) => {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.add('motion-intro');
    if (fromRight) element.classList.add('motion-from-right');
    element.style.setProperty('--motion-delay', `${delay}ms`);

    element.addEventListener('animationend', () => {
      element.classList.remove('motion-intro', 'motion-from-right');
      element.style.removeProperty('--motion-delay');
    }, { once: true });
  });

  const childSelector = [
    '.real-project-card',
    '.design-showcase-card',
    '.service-detail-card',
    '.digital-detail-card',
    '.ts-capability-card',
    '.ts-final-tool-card',
    '.experience-card',
    '.contact-channel-card',
    '.custom-cta-card'
  ].join(',');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px'
  });

  const revealSections = document.querySelectorAll(
    '[data-cms-home-section]:not(#home), #customCtaSection'
  );

  revealSections.forEach(section => {
    section.classList.add('motion-reveal');

    section.querySelectorAll(childSelector).forEach((child, index) => {
      child.classList.add('motion-child');
      child.style.setProperty(
        '--motion-child-delay',
        `${80 + Math.min(index, 8) * 45}ms`
      );
    });

    observer.observe(section);
  });
})();
