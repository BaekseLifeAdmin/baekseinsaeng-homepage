document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('svcQuickNav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('.svc-quick-link'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const overview = document.querySelector('.svc-overview');
  const cta = document.querySelector('.cta-banner');
  let lockedId = null;
  let unlockTimer = null;

  if (!sections.length) return;

  const setActive = id => {
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const updateNav = () => {
    const headerOffset = 110;
    const firstTop = sections[0].getBoundingClientRect().top;
    const ctaTop = cta ? cta.getBoundingClientRect().top : Infinity;
    const overviewBottom = overview ? overview.getBoundingClientRect().bottom : firstTop;
    const visible = overviewBottom <= window.innerHeight * .72 && ctaTop > window.innerHeight * .35;

    nav.classList.toggle('is-visible', visible);

    if (lockedId) {
      setActive(lockedId);
      return;
    }

    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= headerOffset) current = section;
    });
    setActive(current.id);
  };

  links.forEach(link => {
    link.addEventListener('click', event => {
      const section = document.querySelector(link.getAttribute('href'));
      if (!section) return;
      event.preventDefault();
      lockedId = section.id;
      clearTimeout(unlockTimer);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(section.id);
      history.replaceState(null, '', `#${section.id}`);
    });
  });

  window.addEventListener('scroll', () => {
    updateNav();
    if (!lockedId) return;
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      lockedId = null;
      updateNav();
    }, 180);
  }, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();
});
