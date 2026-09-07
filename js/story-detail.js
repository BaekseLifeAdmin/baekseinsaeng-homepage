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
  URL 해시(#sec-N)를 곧바로 기억해두고 주소에서 지운다. 해시를 그대로 두면, 아래에서
  해당 섹션의 hidden 속성을 제거하는 순간 브라우저가 "그 위치로 스크롤"하는 기본 동작을
  다시 시도해 본문 내용까지 화면이 넘어가 버린다(우리가 원하는 동작이 아님). 상세 페이지는
  항상 글 제목과 "이 글에서 다루는 내용" 목차부터 보여야 하므로, 해시는 어떤 섹션을 펼칠지
  결정하는 데만 쓰고 화면 스크롤에는 관여하지 않게 한다.
*/
const STORY_DETAIL_INITIAL_HASH = (window.location.hash || '').replace(/^#/, '');
if (STORY_DETAIL_INITIAL_HASH && window.history && window.history.replaceState) {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

function initializeStoryDetailToc() {
  const articleBody = document.querySelector('.story-article-body');
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

  tocLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = getTargetId(link);
      if (!targetId || !sections.some((section) => section.id === targetId)) return;

      event.preventDefault();
      showSection(targetId);
    });
  });

  /*
    목록 페이지("최근 이야기" 카드)의 목차 항목은 board-story-0N.html?from=board#sec-N 처럼
    해시를 붙여 특정 섹션으로 연결된다. 여기서 해시를 무시하고 항상 1번 섹션을 띄우면
    실제로 고른 콘텐츠가 아니라 다른 섹션이 표시되는 문제가 생기므로, 진입 시 URL 해시와
    일치하는 섹션이 있으면 그 섹션을 기본으로 보여준다.

    단, 화면 스크롤 위치는 건드리지 않는다 — 상세 페이지는 항상 글 제목(방문간호 이야기 01)과
    "이 글에서 다루는 내용" 목차부터 보여야 하며, 본문 내용으로 강제 스크롤하지 않는다.
  */
  const hasMatchingSection = sections.some((section) => section.id === STORY_DETAIL_INITIAL_HASH);
  showSection(hasMatchingSection ? STORY_DETAIL_INITIAL_HASH : sections[0].id);
}

if (document.querySelector('.story-toc') && document.querySelector('.story-article-body')) {
  window.addEventListener('DOMContentLoaded', initializeStoryDetailToc);
}
