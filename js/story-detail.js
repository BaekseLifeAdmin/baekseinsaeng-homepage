/*
  방문간호 이야기 상세 페이지 — 목차("이 글에서 다루는 내용") 항목을 클릭하면
  해당 섹션 하나만 표시하고 나머지는 숨긴다. 여러 섹션이 동시에 이어져 표시되지 않는다.

  board-story-01.html뿐 아니라 앞으로 추가되는 board-story-02.html, 03.html ...에서도
  같은 마크업 패턴(.story-toc a[href="#sec-N"] + .story-article-body > section[id])만
  지키면 이 스크립트 그대로 재사용된다. 특정 게시글에 종속된 코드는 없다.

  기존 Google Sheets 게시판(js/board.js, js/board-data.js)과 PDF 뷰어는 이 스크립트와
  전혀 무관하며 그대로 보존되어 있다.
*/

/*
  URL 해시(#sec-N)는 js/story-early-hash.js가 <head>에서 이미 떼어냈다(자세한 이유는 그
  파일 주석 참고). 여기서는 그때 저장해둔 값을 읽기만 한다.
*/
const STORY_DETAIL_INITIAL_HASH = window.__storyInitialHash || '';

function initializeStoryDetailToc() {
  const articleBody = document.querySelector('.story-article-body');
  const articleHead = document.querySelector('.story-article-head');
  const toc = document.querySelector('.story-toc');

  if (!articleBody || !toc) return;

  const sections = Array.from(articleBody.querySelectorAll(':scope > section[id]'));
  const tocLinks = Array.from(toc.querySelectorAll('a[href*="#"]'));

  if (!sections.length || !tocLinks.length) return;

  function getTargetId(link) {
    const href = link.getAttribute('href') || '';
    const hashIndex = href.indexOf('#');
    return hashIndex >= 0 ? href.slice(hashIndex + 1) : '';
  }

  function showSection(targetId) {
    const target = sections.find((section) => section.id === targetId) || sections[0];

    sections.forEach((section) => {
      section.hidden = section !== target;
    });

    tocLinks.forEach((link) => {
      link.classList.toggle('is-active', getTargetId(link) === target.id);
    });
  }

  /*
    처음 페이지에 들어올 때(스크롤 이동 없음)와 목차를 눌러 페이지 안에서 다른 섹션으로
    이동할 때가 서로 다른 방식으로 위치를 잡으면(하나는 브라우저 기본 위치, 하나는 JS 계산값)
    두 시작점이 미묘하게 어긋난다. 두 경우 모두 반드시 이 함수 하나로만 스크롤 위치를
    맞춰서 항상 같은 지점에서 시작하게 한다.
  */
  function scrollToArticleStart(smooth) {
    const scrollTarget = articleHead || articleBody;
    const siteHeader = document.querySelector('.site-header');
    const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
    const targetTop = scrollTarget.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
  }

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = getTargetId(link);
      if (!targetId || !sections.some((section) => section.id === targetId)) return;

      event.preventDefault();
      showSection(targetId);
      scrollToArticleStart(true);
    });
  });

  /*
    목록 페이지("최근 이야기" 카드)의 목차 항목은 board-story-0N.html?from=board#sec-N 처럼
    해시를 붙여 특정 섹션으로 연결된다. 여기서 해시를 무시하고 항상 1번 섹션을 띄우면
    실제로 고른 콘텐츠가 아니라 다른 섹션이 표시되는 문제가 생기므로, 진입 시 URL 해시와
    일치하는 섹션이 있으면 그 섹션을 기본으로 보여준다.

    진입 직후에도 scrollToArticleStart를 그대로 호출해(단, 애니메이션 없이 즉시) 목차 클릭
    때와 완전히 같은 위치에서 시작하게 한다.
  */
  const hasMatchingSection = sections.some((section) => section.id === STORY_DETAIL_INITIAL_HASH);
  showSection(hasMatchingSection ? STORY_DETAIL_INITIAL_HASH : sections[0].id);
  scrollToArticleStart(false);
}

if (document.querySelector('.story-toc') && document.querySelector('.story-article-body')) {
  window.addEventListener('DOMContentLoaded', initializeStoryDetailToc);
}
