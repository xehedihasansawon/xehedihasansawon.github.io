(() => {
  const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  if (reducedMotionQuery?.matches || !('IntersectionObserver' in window)) {
    return;
  }

  const root = document.documentElement;
  root.classList.add('case-motion-system');

  const introTargets = [
    ['.case-hero-copy .case-back', 30, false],
    ['.case-hero-copy .kicker', 75, false],
    ['.case-hero-copy h1', 125, false],
    ['.case-hero-copy .case-lead', 185, false],
    ['.case-hero-copy .case-tags', 240, false],
    ['.case-hero-visual', 105, true]
  ];

  introTargets.forEach(([selector, delay, fromRight]) => {
    const element = document.querySelector(selector);
    if (!element) return;

    element.classList.add('case-motion-intro');
    if (fromRight) element.classList.add('case-motion-from-right');
    element.style.setProperty('--case-motion-delay', `${delay}ms`);

    element.addEventListener('animationend', () => {
      element.classList.remove('case-motion-intro', 'case-motion-from-right');
      element.style.removeProperty('--case-motion-delay');
    }, { once: true });
  });

  const childSelector = [
    '.role-card',
    '.format-feature',
    '.case-image-button',
    '.case-summary-grid > *',
    '.dynamic-case-gallery > *'
  ].join(',');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('case-motion-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px'
  });

  const registered = new WeakSet();

  const registerReveal = element => {
    if (!(element instanceof Element) || registered.has(element)) return;
    registered.add(element);
    element.classList.add('case-motion-reveal');

    element.querySelectorAll(childSelector).forEach((child, index) => {
      child.classList.add('case-motion-child');
      child.style.setProperty(
        '--case-motion-child-delay',
        `${80 + Math.min(index, 8) * 45}ms`
      );
    });

    observer.observe(element);
  };

  const scan = scope => {
    const selector = [
      '.case-summary',
      '.case-section',
      '.case-next',
      '.case-dynamic-state:not(#caseLoading)',
      'body.case-study-page footer'
    ].join(',');

    if (scope instanceof Element && scope.matches(selector)) {
      registerReveal(scope);
    }

    scope.querySelectorAll?.(selector).forEach(registerReveal);
  };

  scan(document);

  if ('MutationObserver' in window) {
    const mutationObserver = new MutationObserver(records => {
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node instanceof Element) scan(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
