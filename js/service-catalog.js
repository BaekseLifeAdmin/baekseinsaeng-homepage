/* ============================================================
   service-catalog.js — 방문간호 서비스 단일 기준 데이터
   서비스명·순서·아이콘·상세 연결 주소는 이 파일에서만 관리한다.
   ============================================================ */

(() => {
  'use strict';

  const ICONS = Object.freeze({
    experience: '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a6 6 0 0112 0v2"/><path d="M19 8v6M16 11h6"/>',
    counseling: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    wound: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    chronic: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
    rehabilitation: '<circle cx="9" cy="4" r="2"/><path d="M9 7v5.5a2 2 0 002 2h4"/><path d="M9 9.5h4"/><path d="M15 14.5l3 4.5"/><path d="M8 9.5a6 6 0 108 8.5"/>',
    tube: '<path d="M4 4v6a4 4 0 004 4h8a4 4 0 014 4v2"/><path d="M2 4h4"/><path d="M18 20h4"/><circle cx="12" cy="14" r="1.5"/>',
    guide: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>',
    vital: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    bedridden: '<path d="M3 5v14"/><path d="M21 19v-7a2 2 0 00-2-2H8a2 2 0 00-2 2v7"/><path d="M3 15h18"/><circle cx="9" cy="7" r="2"/>'
  });

  const SERVICES = [
    {
      key: 'wound', anchor: 'wound-care', icon: 'wound', title: '욕창·상처관리',
      home: '단계별 욕창 드레싱 및 상처 관리를 보조합니다',
      about: '욕창 단계별 전문 드레싱 및 상처 관리 보조를 제공합니다.',
      overview: '방치하면 입원이 필요한 단계까지 진행될 수 있는 상처, 간호사가 피부 상태를 확인하고 단계별 드레싱과 예방관리를 시행합니다.'
    },
    {
      key: 'chronic', anchor: 'chronic-disease', icon: 'chronic', title: '만성질환관리',
      home: '당뇨·고혈압 등 만성질환 상태를 정기 관찰합니다',
      about: '당뇨·고혈압·심장질환 등 만성질환의 지속적인 관리를 지원합니다.',
      overview: '혈압·혈당은 몸의 이상을 알려주는 기초 신호입니다. 정기 관찰로 변화를 조기에 발견하고, 약물 복용 상태를 확인하며 병원 진료 연계를 돕습니다.'
    },
    {
      key: 'rehabilitation', anchor: 'rehabilitation', icon: 'rehabilitation', iconClass: 'svc-wheelchair-icon', title: '재활간호',
      home: '관절 운동, 체위 변경, 보행 훈련을 지원합니다',
      about: '관절 운동, 체위 변경, 보행 훈련 등 재활간호를 보조합니다.',
      overview: '재활은 멈추는 순간 기능도 함께 멈춥니다. 가정에서 이어지는 지속적인 재활간호로 지금의 기능을 지키고, 저하를 늦춥니다.'
    },
    {
      key: 'tube', anchor: 'tube-care', icon: 'tube', title: '튜브관리',
      home: '경관영양튜브, 도뇨관, 기관절개관을 관리합니다',
      about: '경관영양튜브, 도뇨관, 기관절개관 등 다양한 튜브를 전문 관리합니다.',
      overview: '감염 위험이 있는 경관영양튜브·도뇨관을 의사의 방문간호지시서에 따라 안전하고 위생적으로 관리합니다.'
    },
    {
      key: 'vital', anchor: 'vital-check', icon: 'vital', title: '건강상태 관찰',
      home: '활력징후를 측정하고 이상 증상을 조기에 발견합니다',
      about: '혈압·혈당·체온 등 활력징후를 정기적으로 확인하고 기록합니다.',
      overview: '겉으로 보이지 않는 이상징후, 꾸준한 관찰이 먼저 발견합니다. 이상 발견 시 신속히 병원 진료로 연결합니다.'
    },
    {
      key: 'bedridden', anchor: 'bedridden-care', icon: 'bedridden', title: '와상 어르신 관리',
      home: '침상 생활 중 발생할 수 있는 건강 문제를 세심히 관찰합니다',
      about: '와상 상태의 어르신에게 필요한 건강 관찰과 일상 간호를 지원합니다.',
      overview: '욕창, 근력 저하, 호흡기 합병증까지. 장기간 누워 계신 어르신의 전체 건강을 정기 방문으로 살핍니다.'
    },
    {
      key: 'counseling', anchor: 'counseling-home', icon: 'counseling', title: '보호자 상담·교육',
      home: '가정 간호 방법 교육과 정기 상담을 제공합니다',
      about: '가정 간호 방법 교육과 보호자를 위한 정기 상담을 제공합니다.',
      overview: '보호자 혼자 감당하지 않도록, 방문 때마다 상태를 공유하고 가정에서 실천할 수 있는 간호를 함께 배웁니다.'
    }
  ].map(service => Object.freeze(service));

  const CATALOG = Object.freeze(SERVICES);
  const SERVICE_BY_KEY = Object.freeze(Object.fromEntries(CATALOG.map(service => [service.key, service])));
  const ABOUT_CATALOG = Object.freeze([
    Object.freeze({
      key: 'experience', icon: 'experience', title: '종합병원 임상경험 간호사', aboutHref: 'service.html',
      about: '종합병원 임상경험을 갖춘 간호사가 직접 가정을 방문합니다.'
    }),
    Object.freeze({ ...SERVICE_BY_KEY.vital, title: '건강상태 관찰' }),
    Object.freeze({ ...SERVICE_BY_KEY.wound, title: '욕창·상처관리' }),
    Object.freeze({ ...SERVICE_BY_KEY.tube, title: '튜브관리' }),
    Object.freeze({ ...SERVICE_BY_KEY.rehabilitation, title: '재활간호' }),
    Object.freeze({ ...SERVICE_BY_KEY.chronic, title: '만성질환관리' }),
    Object.freeze({ ...SERVICE_BY_KEY.bedridden, title: '와상 어르신 관리' }),
    Object.freeze({ ...SERVICE_BY_KEY.counseling, title: '보호자 상담' })
  ]);
  const EXPECTED_KEYS = Object.freeze([
    'wound', 'chronic', 'rehabilitation', 'tube',
    'vital', 'bedridden', 'counseling'
  ]);

  function iconSvg(service, size) {
    const className = service.iconClass ? ` class="${service.iconClass}"` : '';
    return `<svg${className} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[service.icon]}</svg>`;
  }

  function homeMarkup(service) {
    return `<a href="service.html#${service.anchor}" class="home-service-card" data-service-key="${service.key}">
      <span class="home-service-icon">${iconSvg(service, 32)}</span>
      <h3>${service.title}</h3>
      <p>${service.home}</p>
    </a>`;
  }

  function aboutMarkup(service) {
    const href = service.aboutHref || `service.html#${service.anchor}`;
    return `<div class="service-icon-item" data-service-key="${service.key}">
      <a href="${href}" class="svc-icon-link" aria-label="${service.title} 자세히 보기">
        <div class="svc-icon-circle">${iconSvg(service, 28)}</div>
      </a>
      <h3>${service.title}</h3>
      <p>${service.about}</p>
    </div>`;
  }

  function overviewMarkup(service) {
    return `<a href="#${service.anchor}" class="svc-card" data-service-key="${service.key}" aria-label="${service.title} 자세히 보기">
      <div class="svc-card-icon">${iconSvg(service, 32)}</div>
      <h3>${service.title}</h3>
      <p>${service.overview}</p>
      <span class="svc-card-link">자세히 보기 →</span>
    </a>`;
  }

  function quickNavMarkup(service) {
    return `<a href="#${service.anchor}" class="svc-quick-link" data-service-key="${service.key}" aria-label="${service.title}">
      ${iconSvg(service, 22)}
      <span>${service.title}</span>
    </a>`;
  }

  const GUIDE_CARD_MARKUP = `<a href="guide.html" class="svc-card svc-card-guide" aria-label="방문간호 이용안내 자세히 보기">
      <div class="svc-card-icon">${iconSvg({ icon: 'guide' }, 32)}</div>
      <h3>이용안내</h3>
      <p>신청 절차, 이용 대상, 방문간호지시서 등 방문간호 이용에 필요한 안내를 확인하세요.</p>
      <span class="svc-card-link">이용안내 바로가기 →</span>
    </a>`;

  const HOME_GUIDE_CARD_MARKUP = `<a href="guide.html" class="home-service-card home-service-card-guide" aria-label="방문간호 이용안내 자세히 보기">
      <span class="home-service-icon">${iconSvg({ icon: 'guide' }, 32)}</span>
      <h3>이용안내</h3>
      <p>신청 절차, 이용 대상, 방문간호지시서 등 이용에 필요한 안내를 확인하세요.</p>
    </a>`;

  const GUIDE_CARD_BY_TYPE = Object.freeze({
    overview: GUIDE_CARD_MARKUP,
    home: HOME_GUIDE_CARD_MARKUP
  });

  const RENDERERS = Object.freeze({
    home: homeMarkup,
    about: aboutMarkup,
    overview: overviewMarkup,
    quick: quickNavMarkup
  });

  function validateCatalog() {
    const keys = CATALOG.map(service => service.key);
    const anchors = CATALOG.map(service => service.anchor);
    const validOrder = EXPECTED_KEYS.every((key, index) => keys[index] === key);
    const uniqueKeys = new Set(keys).size === CATALOG.length;
    const uniqueAnchors = new Set(anchors).size === CATALOG.length;
    const validIcons = CATALOG.every(service => Object.hasOwn(ICONS, service.icon));

    if (CATALOG.length !== 7 || !validOrder || !uniqueKeys || !uniqueAnchors || !validIcons) {
      throw new Error('방문간호 서비스 카탈로그 무결성 검사에 실패했습니다.');
    }
  }

  function renderCatalogs() {
    document.querySelectorAll('[data-service-catalog]').forEach(container => {
      const type = container.dataset.serviceCatalog;
      const renderer = RENDERERS[type];
      if (!renderer) throw new Error(`알 수 없는 서비스 카탈로그 화면 유형: ${type}`);
      const services = type === 'about' ? ABOUT_CATALOG : CATALOG;
      const markup = services.map(renderer).join('');
      const guideCard = GUIDE_CARD_BY_TYPE[type] || '';
      container.innerHTML = markup + guideCard;
    });
  }

  function validateServiceSections() {
    if (document.body.dataset.page !== 'service') return;
    const missing = CATALOG.filter(service => !document.getElementById(service.anchor));
    if (missing.length) {
      throw new Error(`서비스 상세 섹션 누락: ${missing.map(service => service.anchor).join(', ')}`);
    }
  }

  function initServiceCatalog() {
    validateCatalog();
    renderCatalogs();
    validateServiceSections();
  }

  window.BaekseServiceCatalog = Object.freeze({ services: CATALOG, validate: validateCatalog });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceCatalog, { once: true });
  } else {
    initServiceCatalog();
  }
})();
