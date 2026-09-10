/*
  방문간호 이야기 — 새 블로그 첫 화면 렌더링
  STORY_POSTS(js/story-data.js)를 읽어 Featured 콘텐츠 1개 + 이전 글 목록을 그린다.
  기존 Google Sheets 게시판(js/board.js, js/board-data.js)과는 별개로 동작한다.
*/

function initializeStoryHome() {
  const featuredEl = document.getElementById('storyFeatured');
  const listWrapEl = document.getElementById('storyListWrap');
  const listEl = document.getElementById('storyList');

  if (!featuredEl || typeof STORY_POSTS === 'undefined') return;

  const posts = STORY_POSTS.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!posts.length) return;

  const [latest, ...rest] = posts;

  featuredEl.innerHTML = renderFeaturedCard(latest);

  if (rest.length && listWrapEl && listEl) {
    listEl.innerHTML = rest.map((post, index) => renderListItem(post, index + 1)).join('');
    listWrapEl.hidden = false;
  }
}

function renderFeaturedCard(post) {
  const detailUrl = escapeStoryText(getStoryDetailUrl(post));
  const toc = Array.isArray(post.toc) ? post.toc : [];

  const tocHtml = toc.length ? `
      <div class="story-featured-toc">
        <strong>이 글에서 다루는 내용</strong>
        <ol>
          ${toc.map((item) => `<li><a href="${detailUrl}#${escapeStoryText(item.id)}">${escapeStoryText(item.label)}</a></li>`).join('')}
        </ol>
      </div>
  ` : '';

  const hintHtml = toc.length
    ? '<span class="story-featured-hint">오른쪽 항목을 선택하면 해당 주제의 상세 글을 확인할 수 있습니다.</span>'
    : '';

  return `
    <div class="story-featured-card">
      <div class="story-featured-body">
        <span class="story-eyebrow">${escapeStoryText(getStorySeriesLabel(post))}</span>
        <h2 class="story-featured-title"><a href="${detailUrl}">${escapeStoryText(post.title)}</a></h2>
        <p class="story-featured-summary">${escapeStoryText(post.summary)}</p>
        <span class="story-date">${escapeStoryText(post.date)}</span>
        ${hintHtml}
      </div>
      ${tocHtml}
    </div>
  `;
}

function renderListItem(post, index) {
  const safeNumber = String(index).padStart(2, '0');
  return `
    <li class="story-list-item">
      <a class="story-list-link" href="${escapeStoryText(getStoryDetailUrl(post))}">
        <span class="story-list-index">${safeNumber}</span>
        <span class="story-list-body">
          <span class="story-list-title">${escapeStoryText(post.title)}</span>
          <span class="story-list-summary">${escapeStoryText(post.summary)}</span>
          <span class="story-list-meta">${escapeStoryText(getStorySeriesLabel(post))} · ${escapeStoryText(post.date)}</span>
        </span>
      </a>
    </li>
  `;
}

function getStoryDetailUrl(post) {
  /* main.js의 히어로 자동 스크롤 인트로는 data-page="board" + ?from=board 조합일 때만
     건너뛴다(기존 게시판 상세 이동 방식과 동일). 목록에서 상세로 들어갈 때 그대로 재사용해
     상세 페이지 진입 시 자동 스크롤이 발생하지 않도록 한다. */
  return `${post.detailPage}?from=board`;
}

function getStorySeriesLabel(post) {
  const safeId = String(post.id || '').padStart(2, '0');
  return `방문간호 이야기 ${safeId}`;
}

function escapeStoryText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (document.getElementById('storyFeatured')) {
  window.addEventListener('DOMContentLoaded', initializeStoryHome);
}
