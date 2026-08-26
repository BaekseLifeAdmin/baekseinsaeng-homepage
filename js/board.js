const POSTS_PER_PAGE = 9;

let boardState = {
  posts: [],
  currentPage: 1,
  totalPages: 1
};

async function initializeBoard() {
  const listEl = document.getElementById('boardList');
  const paginationEl = document.getElementById('boardPagination');
  const summaryEl = document.getElementById('boardSummary');

  if (!listEl || !paginationEl || !summaryEl) return;

  const currentPage = getCurrentPage(window.location.search);
  await loadBoardPage(currentPage, listEl, paginationEl, summaryEl);
}

async function loadBoardPage(pageNumber, listEl, paginationEl, summaryEl) {
  renderLoadingState(listEl, summaryEl);

  try {
    const page = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
    const response = await getBoardPosts(page, POSTS_PER_PAGE);
    const posts = Array.isArray(response.posts) ? response.posts : [];
    const totalPages = Math.max(1, Number(response.totalPages) || 1);
    const resolvedPage = Math.min(Math.max(Number(response.page) || page, 1), totalPages);

    boardState = {
      posts,
      currentPage: resolvedPage,
      totalPages,
      total: Number(response.total) || posts.length
    };

    updateHistoryPage(boardState.currentPage);
    renderBoardPosts(listEl, boardState.posts, boardState.currentPage);
    renderPagination(paginationEl, boardState.currentPage, boardState.totalPages);
    updateBoardSummary(summaryEl, boardState.total);
  } catch (error) {
    renderErrorState(listEl, summaryEl, paginationEl);
  }
}

function updateBoardSummary(summaryEl, totalPosts) {
  if (!summaryEl) return;
  const parsedTotal = Number(totalPosts);
  const safeTotal = Number.isFinite(parsedTotal) && parsedTotal > 0
    ? Math.floor(parsedTotal)
    : 0;
  summaryEl.textContent = `총 ${safeTotal.toLocaleString('ko-KR')}개의 게시글 목록입니다.`;
}

function renderLoadingState(listEl, summaryEl) {
  if (!listEl) return;

  listEl.innerHTML = '';
  const skeletons = Array.from({ length: POSTS_PER_PAGE }, (_, index) => `
    <div class="board-skeleton" role="status" aria-label="게시글 로딩 중 ${index + 1}">
      <div class="board-skeleton-image"></div>
      <div class="board-skeleton-body">
        <div class="board-skeleton-line short"></div>
        <div class="board-skeleton-line long"></div>
        <div class="board-skeleton-line medium"></div>
      </div>
    </div>
  `).join('');
  listEl.innerHTML = skeletons;
  if (summaryEl) {
    summaryEl.textContent = '게시글을 불러오는 중입니다.';
  }
}

function renderEmptyState(listEl, summaryEl, paginationEl) {
  if (!listEl) return;
  listEl.innerHTML = `
    <div class="board-state" role="status">
      <strong>등록된 게시글이 없습니다.</strong>
      <p>새로운 소식이 등록되면 이곳에서 확인하실 수 있습니다.</p>
    </div>
  `;
  if (summaryEl) {
    summaryEl.textContent = '등록된 게시글이 없습니다.';
  }
  if (paginationEl) {
    paginationEl.innerHTML = '';
  }
}

function renderErrorState(listEl, summaryEl, paginationEl) {
  if (!listEl) return;
  listEl.innerHTML = `
    <div class="board-state" role="alert">
      <strong>게시글을 불러오지 못했습니다.</strong>
      <p>잠시 후 다시 시도해 주세요.</p>
      <button class="btn btn-outline-navy" id="boardRetryBtn" type="button">다시 시도</button>
    </div>
  `;
  if (summaryEl) {
    summaryEl.textContent = '게시글을 불러오지 못했습니다.';
  }
  if (paginationEl) {
    paginationEl.innerHTML = '';
  }

  const retryBtn = document.getElementById('boardRetryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => initializeBoard());
  }
}

function renderBoardPosts(listEl, posts, currentPage) {
  if (!listEl) return;

  if (!posts.length) {
    renderEmptyState(listEl, null, null);
    return;
  }

  listEl.innerHTML = posts.map((post) => {
    const excerpt = createPostExcerpt(post.content);
    const safeTitle = escapeText(post.title || '제목 없음');
    const safeExcerpt = escapeText(excerpt);
    const safeDate = escapeText(formatBoardDate(post.date));
    const imageMarkup = buildImageMarkup(post.imageUrl, safeTitle);
    const detailUrl = `board-detail.html?id=${encodeURIComponent(post.id)}&page=${currentPage}`;

    return `
      <article class="board-card" role="listitem">
        <a class="board-card-link" href="${detailUrl}" aria-label="${safeTitle} 상세 보기">
          <div class="board-card-image-wrap">
            ${imageMarkup}
          </div>
          <div class="board-card-body">
            <div class="board-card-meta">
              <span>${safeDate}</span>
            </div>
            <h2 class="board-card-title">${safeTitle}</h2>
            <p class="board-card-excerpt">${safeExcerpt}</p>
            <div class="board-card-footer">
              <span>자세히 보기</span>
              <span class="board-card-arrow" aria-hidden="true">→</span>
            </div>
          </div>
        </a>
      </article>
    `;
  }).join('');

  listEl.querySelectorAll('.board-card-image').forEach((img) => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.remove();
      const wrapper = img.closest('.board-card-image-wrap');
      if (wrapper) {
        wrapper.innerHTML = '<div class="board-card-image board-card-fallback" aria-label="이미지 없음"></div>';
      }
    });
  });
}

function renderPagination(paginationEl, currentPage, totalPages) {
  if (!paginationEl) return;

  const pages = buildVisiblePageNumbers(currentPage, totalPages);
  const prevDisabled = currentPage <= 1 ? 'is-disabled' : '';
  const nextDisabled = currentPage >= totalPages ? 'is-disabled' : '';
  const prevHref = currentPage <= 1 ? '' : `?page=${currentPage - 1}`;
  const nextHref = currentPage >= totalPages ? '' : `?page=${currentPage + 1}`;

  const pageLinks = pages.map((page) => {
    const current = page === currentPage ? 'aria-current="page"' : '';
    return `<a class="board-page-btn" href="?page=${page}" ${current}>${page}</a>`;
  }).join('');
  const leadingEllipsis = pages[0] > 1
    ? '<span class="board-page-ellipsis" aria-hidden="true">…</span>'
    : '';
  const trailingEllipsis = pages[pages.length - 1] < totalPages
    ? '<span class="board-page-ellipsis" aria-hidden="true">…</span>'
    : '';

  paginationEl.innerHTML = `
    <a class="board-page-nav ${prevDisabled}" href="${prevHref}" aria-label="이전 페이지">‹</a>
    ${leadingEllipsis}
    ${pageLinks}
    ${trailingEllipsis}
    <a class="board-page-nav ${nextDisabled}" href="${nextHref}" aria-label="다음 페이지">›</a>
  `;

  paginationEl.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', async (event) => {
      const href = link.getAttribute('href');
      if (!href) {
        event.preventDefault();
        return;
      }
      const targetPage = getPageFromHref(href);
      if (!targetPage) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      await loadBoardPage(targetPage, document.getElementById('boardList'), document.getElementById('boardPagination'), document.getElementById('boardSummary'));
    });
  });
}

function buildVisiblePageNumbers(currentPage, totalPages) {
  const visibleCount = Math.min(3, totalPages);
  const start = Math.min(
    Math.max(1, currentPage - 1),
    Math.max(1, totalPages - visibleCount + 1)
  );
  const end = start + visibleCount - 1;
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function getPageFromHref(href) {
  const search = href.split('?')[1] || '';
  const params = new URLSearchParams(search);
  const page = Number(params.get('page'));
  if (!Number.isInteger(page) || page < 1) return null;
  return page;
}

function updateHistoryPage(page) {
  const params = new URLSearchParams(window.location.search);
  params.set('page', String(page));
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  history.replaceState({}, '', nextUrl);
}

function escapeText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildImageMarkup(imageUrl, altText) {
  const safeAlt = escapeText(altText || '게시글 이미지');
  const safeUrl = isSafeImageUrl(imageUrl) ? escapeText(imageUrl) : '';
  if (!safeUrl) {
    return '<div class="board-card-image board-card-fallback" aria-label="이미지 없음"></div>';
  }

  return `
    <img class="board-card-image" src="${safeUrl}" alt="${safeAlt}" loading="lazy">
  `;
}

function isSafeImageUrl(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return false;
  return true;
}

if (document.getElementById('boardList')) {
  window.addEventListener('DOMContentLoaded', initializeBoard);
}
