/* ============================================================
   guide.js — 이용안내 탭 전환 + FAQ 아코디언
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGuideTabs();
  initFaq();
});

function initGuideTabs() {
  const tabs = document.querySelectorAll('.guide-tab');
  const panels = document.querySelectorAll('.guide-panel');
  if (!tabs.length) return;

  const getTabFromHash = () => window.location.hash
    .replace(/^#(?:tab-)?/, '');

  const scrollToPanelStart = () => {
    const guideMain = document.querySelector('.guide-main');
    const tabWrap = document.getElementById('guideTabWrap');
    if (!guideMain || !tabWrap) return;

    const stickyTop = Number.parseFloat(getComputedStyle(tabWrap).top) || 0;
    const tabHeight = tabWrap.getBoundingClientRect().height;
    const targetY = guideMain.getBoundingClientRect().top + window.scrollY - stickyTop - tabHeight;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    window.scrollTo({ top: Math.max(0, targetY), behavior });
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
    /* re-observe reveal elements in the newly shown panel */
    const activePanel = document.querySelector('.guide-panel.active');
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

  tabs.forEach(tab => tab.addEventListener('click', () => {
    activate(tab);
    const scroller = tab.closest('.guide-tabs');
    if (scroller) {
      const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
      const targetLeft = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
      scroller.scrollTo({
        left: Math.min(maxScrollLeft, Math.max(0, targetLeft)),
        behavior: 'smooth'
      });
    }
    scrollToPanelStart();
  }));

  document.querySelectorAll('.guide-grade-directive-link').forEach(link => {
    link.addEventListener('click', event => {
      const nextHash = link.getAttribute('href');
      const target = Array.from(tabs).find(tab => tab.dataset.tab === 'directive');
      if (!nextHash || !target) return;

      event.preventDefault();
      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
        return;
      }

      activate(target);
      scrollToPanelStart();
    });
  });

  const hash = getTabFromHash();
  if (hash) {
    const target = document.querySelector(`.guide-tab[data-tab="${hash}"]`);
    if (target) {
      activate(target);
      requestAnimationFrame(scrollToPanelStart);
    }
  }

  window.addEventListener('hashchange', () => {
    const nextHash = getTabFromHash();
    const target = document.querySelector(`.guide-tab[data-tab="${nextHash}"]`);
    if (!target) return;
    activate(target);
    scrollToPanelStart();
  });
}

function initFaq() {
  const questions = document.querySelectorAll('.guide-faq-trigger');
  if (!questions.length) return;

  const getAnswer = button => {
    const answerId = button.getAttribute('aria-controls');
    return answerId ? document.getElementById(answerId) : null;
  };

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      /* close all others */
      questions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = getAnswer(other);
          if (otherAnswer) otherAnswer.classList.remove('is-open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      const answer = getAnswer(btn);
      if (answer) answer.classList.toggle('is-open', !expanded);
    });
  });
}
