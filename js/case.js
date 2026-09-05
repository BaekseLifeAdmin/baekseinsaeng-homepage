document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.case-row-media img').forEach((img) => {
    const applyFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      const wrapper = img.closest('.case-row-media');
      if (wrapper) {
        wrapper.classList.add('img-error');
      }
    };

    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }
    img.addEventListener('error', applyFallback);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('caseQuickNav');
  if (!nav) return;

  const navHint = document.getElementById('caseNavHint');
  const closingSection = document.querySelector('.case-closing');

  const links = Array.from(nav.querySelectorAll('.case-quick-link'));
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const caseList = document.querySelector('.case-list');
  const cta = document.querySelector('.cta-banner');
  let lockedId = null;
  let unlockTimer = null;

  if (!sections.length) return;

  const isMobileQuickNav = () => window.matchMedia('(max-width: 768px)').matches;

  // 모바일: nav는 position:fixed로 헤더 바로 아래 화면에 고정된 채,
  // 사례 목록(.case-list)이 화면에 보이는 동안에만 is-visible이 붙어 그 자리에서
  // 나타난다(사라질 때도 같은 자리). 데스크탑의 스크롤 퍼센트 계산 대신
  // 브라우저 표준 IntersectionObserver로 판단해 더 안정적으로 동작하게 함.
  if (isMobileQuickNav() && caseList && 'IntersectionObserver' in window) {
    const headerStack = 130; // 고정 헤더(80px) + nav 자체 높이만큼 위쪽을 제외하고 판단
    // 화면 아래쪽을 70%만큼 줄여서, 감지 영역을 헤더 바로 아래의 얇은 띠로 좁힘.
    // 즉 첫 사례(Case 01)의 제목이 헤더 바로 밑까지 올라왔을 때만 나타남.
    const mobileNavObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        nav.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { rootMargin: `-${headerStack}px 0px -70% 0px`, threshold: 0 });
    mobileNavObserver.observe(caseList);
  }

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

    // 데스크탑에서만 스크롤 퍼센트로 is-visible을 계산한다.
    // 모바일은 위의 IntersectionObserver가 이 클래스를 전담하므로 여기서 건드리지 않음.
    if (!isMobileQuickNav()) {
      const listTop = caseList ? caseList.getBoundingClientRect().top : Infinity;
      const ctaTop = cta ? cta.getBoundingClientRect().top : Infinity;
      const visible = listTop <= window.innerHeight * .72 && ctaTop > window.innerHeight * .35;

      nav.classList.toggle('is-visible', visible);

      if (navHint) {
        const closingTop = closingSection ? closingSection.getBoundingClientRect().top : Infinity;
        const hintVisible = visible && closingTop > window.innerHeight * .8;
        navHint.classList.toggle('is-visible', hintVisible);
      }
    }

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
