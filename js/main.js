/* ============================================================
   main.js — 공통 기능
   백세인생 방문간호센터
   ============================================================ */

const PHONE = '042-719-1350';
const PHONE_HREF = 'tel:0427191350';
const KAKAO_CHANNEL_URL = '';
const YOUTUBE_CHANNEL_URL = '';

/* ── Header HTML ──────────────────────────────────────────── */
const HEADER_HTML = `
<header class="site-header" id="siteHeader">
  <div class="container">
    <div class="header-inner">
      <a href="index.html" class="logo" aria-label="백세인생 방문간호센터 홈으로">
        <img src="images/png/Logo.png" alt="백세인생 방문간호센터 로고" class="logo-image">
      </a>
      <nav class="main-nav" id="mainNav" aria-label="주요 메뉴">
        <ul>
          <li><a href="about.html" data-page="about">센터소개</a></li>
          <li><a href="service.html" data-page="service">방문간호서비스</a></li>
          <li><a href="guide.html" data-page="guide">이용안내</a></li>
          <li><a href="case.html" data-page="case">간호사례</a></li>
          <li><a href="board.html" data-page="board">방문간호 이야기</a></li>
          <li><a href="counseling.html" data-page="counseling">보호자상담</a></li>
        </ul>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="메뉴 열기" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-overlay" id="mobileOverlay" aria-hidden="true"></div>
<nav class="mobile-nav" id="mobileNav" aria-label="모바일 메뉴" aria-hidden="true">
  <ul>
    <li><a href="about.html">센터소개</a></li>
    <li><a href="service.html">방문간호서비스</a></li>
    <li><a href="guide.html">이용안내</a></li>
    <li><a href="case.html">간호사례</a></li>
    <li><a href="board.html">방문간호 이야기</a></li>
    <li><a href="counseling.html">보호자상담</a></li>
  </ul>
  <div class="mobile-nav-contact">
    <p>대표 전화번호</p>
    <a href="${PHONE_HREF}" class="mobile-phone">${PHONE}</a>
    <a href="counseling.html" class="mobile-nav-consult">온라인 상담 신청하기</a>
  </div>
</nav>`;

/* ── Footer HTML ──────────────────────────────────────────── */
const FOOTER_HTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-main">
      <div class="footer-brand">
        <div class="footer-brand-logos">
          <img src="images/png/Logo.png" alt="백세인생 방문간호센터 로고" class="footer-logo-baekse">
          <img src="images/png/CORNEX Logo.png" alt="CORNEX 로고" class="footer-logo-cornex">
        </div>
        <p class="footer-desc">임상 경험을 갖춘 전문 간호사가 직접 가정을 방문하여 지속적인 건강관리와 방문간호 서비스를 제공합니다. 어르신과 보호자가 가정에서도 안심할 수 있도록 함께하겠습니다.</p>
      </div>
      <div class="footer-col footer-info">
        <h4 class="footer-col-title">센터 정보</h4>
        <ul class="footer-col-list">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>평일 09:00–18:00 / 토 09:00–13:00</span>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>대전광역시 서구 둔산북로 121, 1204호</span>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h6M7 12h10M7 16h7"/></svg>
            <span>장기요양기관 등록번호: 제23017000610호</span>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>
            <span>사업자 등록번호: 545-81-01160</span>
          </li>
        </ul>
      </div>
      <div class="footer-col footer-links">
        <h4 class="footer-col-title">바로가기</h4>
        <ul class="footer-col-list footer-nav-list">
          <li><a href="about.html">센터소개</a></li>
          <li><a href="service.html">서비스</a></li>
          <li><a href="guide.html">이용안내</a></li>
          <li><a href="case.html">간호사례</a></li>
          <li><a href="counseling.html">보호자 상담</a></li>
          <li><a href="about.html#location">오시는 길</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 주식회사 코넥스. All Rights Reserved</p>
      <p>본 사이트 정보는 건강관리 목적이며, 실제 진단·치료를 대체하지 않습니다.</p>
    </div>
  </div>
</footer>

<div class="fixed-cta" id="fixedCta">
  <a href="${PHONE_HREF}" class="fixed-cta-btn fixed-cta-phone" aria-label="전화 상담">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.35 3.5 9.5 7.65a1.7 1.7 0 0 1-.38 1.98l-1.4 1.4a15.2 15.2 0 0 0 5.25 5.25l1.4-1.4a1.7 1.7 0 0 1 1.98-.38l4.15 2.15a1.7 1.7 0 0 1 .9 1.5v1.75a1.7 1.7 0 0 1-1.7 1.7C10.15 21.6 2.4 13.85 2.4 4.3a1.7 1.7 0 0 1 1.7-1.7h1.75a1.7 1.7 0 0 1 1.5.9Z"/></svg>
  </a>
  <!-- KAKAO_CHANNEL_URL이 비어 있으면 준비 중 안내를 표시합니다 -->
  <a href="#" class="fixed-cta-btn fixed-cta-kakao" aria-label="카카오톡 상담">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4C6.48 4 2 7.51 2 11.85c0 2.78 1.86 5.22 4.66 6.62-.2.75-.73 2.71-.84 3.13-.13.52.19.51.4.37.17-.11 2.65-1.8 3.73-2.53.66.1 1.35.15 2.05.15 5.52 0 10-3.51 10-7.85C22 7.51 17.52 4 12 4z"/></svg>
  </a>
  <a href="${YOUTUBE_CHANNEL_URL || '#'}" class="fixed-cta-btn fixed-cta-youtube" aria-label="유튜브 채널">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.93-1.95C17.95 4.78 12 4.78 12 4.78s-5.95 0-7.65.46a2.75 2.75 0 0 0-1.93 1.95A28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.93 1.95c1.7.46 7.65.46 7.65.46s5.95 0 7.65-.46a2.75 2.75 0 0 0 1.93-1.95A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z"/></svg>
  </a>
</div>`;

/* ── Init ─────────────────────────────────────────────────── */
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  initHeader();
  initMobileMenu();
  setActiveNav();
  initKakaoChatButtons();
  initYoutubeButton();
  initHomeHeroRotation();
  initSubpageHeroSequence();
  initScrollReveal();
  initScrollableTabs();
});

/* ── Scrollable Tab Bar Fade Hints ───────────────────────────
   .about-tabs / .guide-tabs scroll horizontally when they don't
   fit (mobile). Without a visual cue, a partially-cut tab label
   reads as a bug instead of "swipe for more" — this toggles
   edge-fade classes based on actual scroll position. ── */
function initScrollableTabs() {
  const wraps = document.querySelectorAll('.about-tab-wrap, .guide-tab-wrap');
  wraps.forEach(wrap => {
    const scroller = wrap.querySelector('.about-tabs, .guide-tabs');
    if (!scroller) return;

    const update = () => {
      const hasOverflow = scroller.scrollWidth > scroller.clientWidth + 1;
      const atStart = scroller.scrollLeft <= 1;
      const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
      wrap.classList.toggle('tab-scroll-left', hasOverflow && !atStart);
      wrap.classList.toggle('tab-scroll-right', hasOverflow && !atEnd);
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  });
}

function injectLayout() {
  const h = document.getElementById('header-placeholder');
  if (h) h.outerHTML = HEADER_HTML;
  const f = document.getElementById('footer-placeholder');
  if (f) f.outerHTML = FOOTER_HTML;
}

/* ── Bottom CTA Kakao Chat ───────────────────────────────── */
function initKakaoChatButtons() {
  document.querySelectorAll('[data-kakao-chat], .fixed-cta-kakao').forEach(button => {
    if (KAKAO_CHANNEL_URL) {
      button.href = KAKAO_CHANNEL_URL;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      return;
    }

    button.addEventListener('click', event => {
      event.preventDefault();
      window.alert('현재 카카오톡 채팅 상담 페이지는 준비 중입니다.\n보호자 상담 페이지에서 신청하실 수 있습니다.');
    });
  });
}

/* ── Fixed YouTube Button ────────────────────────────────── */
function initYoutubeButton() {
  const youtubeButton = document.querySelector('.fixed-cta-youtube');
  if (!youtubeButton) return;

  if (YOUTUBE_CHANNEL_URL) {
    youtubeButton.target = '_blank';
    youtubeButton.rel = 'noopener noreferrer';
    return;
  }

  youtubeButton.setAttribute('aria-label', '유튜브 채널 (준비 중)');
  youtubeButton.addEventListener('click', event => {
    event.preventDefault();
    window.alert('현재 유튜브 채널은 준비 중입니다.');
  });
}

/* ── Sticky Header ────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  if (!btn || !nav) return;

  let lockedScrollY = 0;

  const setOpen = (open) => {
    btn.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    nav.setAttribute('aria-hidden', String(!open));

    if (open) {
      lockedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, lockedScrollY);
    }
  };

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  if (overlay) overlay.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* ── Active Nav ───────────────────────────────────────────── */
function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.main-nav [data-page]').forEach(link => {
    const isMatch = link.dataset.page === page || (page === 'board' && link.getAttribute('href') === 'board.html');
    if (isMatch) link.closest('li').classList.add('active');
  });
  document.querySelectorAll('.mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isMatch = href === `${page}.html` || (page === 'board' && href === 'board.html');
    const navItem = link.closest('li');
    if (isMatch && navItem) navItem.classList.add('active');
  });
}

/* ── Home Hero Message Rotation ───────────────────────────── */
function initHomeHeroRotation() {
  const rotator = document.querySelector('[data-home-hero-rotator]');
  if (!rotator) return;

  const messages = Array.from(rotator.querySelectorAll('[data-hero-message]'));
  if (messages.length < 2) return;

  // 영상 컷 전환 시점(초): 0, 7, 11, 16, 19, 25 → 37(=0, 반복). 문구 순서는 그대로 1→2→3→4→5→6.
  const sequence = [0, 1, 2, 3, 4, 5];
  const holdDurations = [7000, 4000, 4000, 4000, 6000, 12000];
  const transitionPhaseDuration = 1000;
  const activeMessageIndex = Math.max(0, messages.findIndex(message => message.classList.contains('is-active')));
  let activePos = Math.max(0, sequence.indexOf(activeMessageIndex));
  let rotationTimer = 0;
  let entryTimer = 0;
  let transitioning = false;

  const scheduleNext = () => {
    window.clearTimeout(rotationTimer);
    if (document.hidden) return;
    const holdDuration = holdDurations[activePos] ?? 10000;
    rotationTimer = window.setTimeout(showNext, holdDuration);
  };

  const showNext = () => {
    if (transitioning || document.hidden) return;
    transitioning = true;

    const currentMessage = messages[sequence[activePos]];
    const nextPos = (activePos + 1) % sequence.length;
    const nextMessage = messages[sequence[nextPos]];

    currentMessage.classList.remove('is-active');
    currentMessage.classList.add('is-leaving');
    currentMessage.setAttribute('aria-hidden', 'true');

    // 다음 문구의 노출 시간은 전환 애니메이션과 무관하게 지정한 초 경계에서 바로 시작한다.
    activePos = nextPos;
    scheduleNext();

    entryTimer = window.setTimeout(() => {
      currentMessage.classList.remove('is-leaving');
      nextMessage.classList.remove('is-leaving');
      nextMessage.classList.add('is-entering');
      nextMessage.setAttribute('aria-hidden', 'false');

      nextMessage.getBoundingClientRect();
      nextMessage.classList.add('is-active');
      nextMessage.classList.remove('is-entering');

      transitioning = false;
    }, transitionPhaseDuration);
  };

  document.addEventListener('visibilitychange', () => {
    window.clearTimeout(rotationTimer);
    if (!document.hidden && !transitioning) scheduleNext();
  });

  scheduleNext();
}

/* ── Subpage Hero Sequence & Auto Scroll ─────────────────── */
function initSubpageHeroSequence() {
  const hero = document.querySelector('.page-image-hero');
  if (!hero) return;
  if (window.location.hash) return;
  if (window.scrollY > 0) window.scrollTo(0, 0);

  const animatedContent = hero.querySelector('.page-header-content');
  const target = hero.nextElementSibling;
  if (!animatedContent || !target) return;

  hero.classList.add('hero-sequence-prepared');
  document.documentElement.classList.add('auto-scroll-active');

  const textSequenceDuration = 800;
  const scrollDuration = 3600;
  let cancelled = false;
  let sequenceFinished = false;
  let sequenceStarted = false;
  let scrollFrame = 0;
  let sequenceFallback = 0;
  let previousScrollBehavior = '';
  const interactionEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

  const removeInteractionListeners = () => {
    interactionEvents.forEach(eventName => {
      window.removeEventListener(eventName, cancelAutoScroll);
    });
  };

  const cancelAutoScroll = () => {
    cancelled = true;
    window.cancelAnimationFrame(scrollFrame);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    document.documentElement.classList.remove('auto-scroll-active');
    removeInteractionListeners();
  };

  const finishSequence = () => {
    if (sequenceFinished) return;
    sequenceFinished = true;
    window.clearTimeout(sequenceFallback);
    hero.classList.add('hero-sequence-complete');
    if (!cancelled) startCoordinatedScroll();
  };

  const startCoordinatedScroll = () => {
    previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    const header = document.getElementById('siteHeader');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const startY = window.scrollY;
    const destinationY = Math.max(0, target.getBoundingClientRect().top + startY - headerHeight);
    const distance = destinationY - startY;
    const startedAt = performance.now();

    const move = currentTime => {
      if (cancelled) return;
      const progress = Math.min((currentTime - startedAt) / scrollDuration, 1);
      const easedProgress = (1 - Math.cos(Math.PI * progress)) / 2;
      const currentY = startY + (distance * easedProgress);
      window.scrollTo(0, currentY);
      document.documentElement.scrollTop = currentY;

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(move);
        return;
      }

      window.scrollTo(0, destinationY);
      document.documentElement.scrollTop = destinationY;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      document.documentElement.classList.remove('auto-scroll-active');
      removeInteractionListeners();
    };

    scrollFrame = window.requestAnimationFrame(move);
  };

  const startSequence = () => {
    if (cancelled || sequenceStarted) return;
    sequenceStarted = true;
    animatedContent.addEventListener('animationend', finishSequence, { once: true });
    hero.classList.add('hero-sequence-active');
    sequenceFallback = window.setTimeout(finishSequence, textSequenceDuration + 250);
  };

  interactionEvents.forEach(eventName => {
    window.addEventListener(eventName, cancelAutoScroll, { passive: true });
  });

  window.requestAnimationFrame(startSequence);
  window.setTimeout(startSequence, 0);
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const contentRoot = document.querySelector('main');
  if (!contentRoot) return;

  const observedItems = new WeakSet();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    : null;

  const registerItem = (item, index = null) => {
    if (!(item instanceof HTMLElement) || observedItems.has(item)) return;
    if (item.matches('script, style, template, [hidden]')) return;

    item.classList.add('reveal');
    if (index !== null) {
      item.style.setProperty('--reveal-delay', `${Math.min(index * 65, 325)}ms`);
    }
    observedItems.add(item);

    if (!observer) {
      item.classList.add('visible');
      return;
    }
    observer.observe(item);
  };

  const registerGroup = group => {
    Array.from(group.children).forEach((item, index) => registerItem(item, index));
  };

  contentRoot.querySelectorAll('[data-reveal-group]').forEach(registerGroup);
  contentRoot.querySelectorAll('.reveal').forEach(item => registerItem(item));

  if (!('MutationObserver' in window)) return;
  const mutationObserver = new MutationObserver(records => {
    records.forEach(record => {
      if (!(record.target instanceof HTMLElement)) return;

      if (record.target.matches('[data-reveal-group]')) registerGroup(record.target);
      record.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches('.reveal')) registerItem(node);
        if (node.matches('[data-reveal-group]')) registerGroup(node);
        node.querySelectorAll('.reveal').forEach(item => registerItem(item));
        node.querySelectorAll('[data-reveal-group]').forEach(registerGroup);
      });
    });
  });
  mutationObserver.observe(contentRoot, { childList: true, subtree: true });
}
