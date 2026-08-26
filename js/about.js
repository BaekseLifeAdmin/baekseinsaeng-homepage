/* ============================================================
   about.js — 센터소개 탭 전환
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.about-tab');
  const panels = document.querySelectorAll('.about-panel');
  if (!tabs.length) return;

  let roughMapRendered = false;

  const scrollToPanelStart = () => {
    const aboutMain = document.querySelector('.about-main');
    const tabWrap = document.getElementById('aboutTabWrap');
    if (!aboutMain || !tabWrap) return;

    const stickyTop = Number.parseFloat(getComputedStyle(tabWrap).top) || 0;
    const tabHeight = tabWrap.getBoundingClientRect().height;
    const targetY = aboutMain.getBoundingClientRect().top + window.scrollY - stickyTop - tabHeight;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    window.scrollTo({ top: Math.max(0, targetY), behavior });
  };

  const initKakaoMap = () => {
    if (roughMapRendered) return;

    const mapNode = document.getElementById('daumRoughmapContainer1786493370549');
    const mapFrame = mapNode && mapNode.closest('.map-placeholder');
    const RoughMapLander = window.daum && window.daum.roughmap && window.daum.roughmap.Lander;
    if (!mapNode || !mapFrame || !RoughMapLander) return;

    const mapWidth = Math.round(mapFrame.clientWidth) || 360;
    const mapHeight = Math.round(mapFrame.clientHeight) || 360;

    new RoughMapLander({
      timestamp: '1786493370549',
      key: 'sfp9ogeobx5',
      mapWidth: String(mapWidth),
      mapHeight: String(mapHeight)
    }).render();

    roughMapRendered = true;
  };

  const activate = (targetTab) => {
    tabs.forEach(t => {
      const active = t === targetTab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    panels.forEach(p => {
      const show = p.id === 'tab-' + targetTab.dataset.tab;
      p.classList.toggle('active', show);
      p.hidden = !show;
    });
    if (targetTab.dataset.tab === 'location') {
      window.requestAnimationFrame(initKakaoMap);
    }
    /* re-trigger reveal for newly shown panel */
    const activePanel = document.querySelector('.about-panel.active');
    if (activePanel) {
      activePanel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const obs = new IntersectionObserver((entries, o) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); o.unobserve(entry.target); }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
      });
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activate(tab);
      const scroller = tab.closest('.about-tabs');
      if (scroller) {
        const targetLeft = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
        scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
      scrollToPanelStart();
    });
  });

  /* hash-based deep link (e.g. about.html#location) */
  const activateHashTab = (deferScroll = false) => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const target = document.querySelector(`.about-tab[data-tab="${hash}"]`);
    if (!target) return;

    activate(target);
    if (deferScroll) {
      window.requestAnimationFrame(scrollToPanelStart);
    } else {
      scrollToPanelStart();
    }
  };

  activateHashTab(true);
  window.addEventListener('hashchange', () => activateHashTab());
});
