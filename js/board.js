const POSTS_PER_PAGE = 9;

const BOARD_CATEGORIES = [
  '전체',
  '방문간호 알아보기',
  '장기요양 이용안내',
  '욕창·상처',
  '질환별 건강관리',
  '재활·움직임',
  '튜브·기구',
  '퇴원 후·보호자 돌봄'
];

let boardState = {
  allPosts: [],
  filteredPosts: [],
  category: '전체',
  searchTerm: '',
  currentPage: 1,
  totalPages: 1
};

async function initializeBoard() {
  const listEl = document.getElementById('boardList');
  const paginationEl = document.getElementById('boardPagination');
  const summaryEl = document.getElementById('boardSummary');
  const categoryTabsEl = document.getElementById('boardCategoryTabs');
  const searchFormEl = document.getElementById('boardSearchForm');
  const searchInputEl = document.getElementById('boardSearchInput');
  const searchClearEl = document.getElementById('boardSearchClear');

  if (!listEl || !paginationEl || !summaryEl) return;

  renderLoadingState(listEl, summaryEl);
  renderCategoryTabs(categoryTabsEl, boardState.category);
  setupCategoryTabEvents(categoryTabsEl);
  setupSearchEvents(searchFormEl, searchInputEl, searchClearEl);

  try {
    const posts = await getAllBoardPosts();
    boardState.allPosts = sortPostsByDate(Array.isArray(posts) ? posts : []);
  } catch (error) {
    renderErrorState(listEl, summaryEl, paginationEl);
    return;
  }

  boardState.currentPage = getCurrentPage(window.location.search);
  applyFiltersAndRender({ resetPage: false });
}

function getPostCategory(post) {
  return String((post && post.category) || '').trim();
}

function filterBoardPosts(posts, category, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesCategory = category === '전체' || getPostCategory(post) === category;
    if (!matchesCategory) return false;

    if (!normalizedSearch) return true;

    const title = String((post && post.title) || '').toLowerCase();
    const keyword = getPostCategory(post).toLowerCase();
    return title.includes(normalizedSearch) || keyword.includes(normalizedSearch);
  });
}

function applyFiltersAndRender(options = {}) {
  const { resetPage = true } = options;
  const listEl = document.getElementById('boardList');
  const paginationEl = document.getElementById('boardPagination');
  const summaryEl = document.getElementById('boardSummary');

  const filtered = filterBoardPosts(boardState.allPosts, boardState.category, boardState.searchTerm);
  boardState.filteredPosts = filtered;

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  boardState.totalPages = totalPages;
  boardState.currentPage = resetPage ? 1 : Math.min(Math.max(boardState.currentPage, 1), totalPages);

  updateHistoryPage(boardState.currentPage);

  if (!filtered.length) {
    if (boardState.allPosts.length === 0) {
      renderEmptyState(listEl, summaryEl, paginationEl);
    } else {
      renderNoResultsState(listEl, summaryEl, paginationEl);
    }
    return;
  }

  const startIndex = (boardState.currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

  renderBoardPosts(listEl, pagePosts, boardState.currentPage, filtered.length);
  renderPagination(paginationEl, boardState.currentPage, totalPages);
  updateBoardSummary(summaryEl, filtered.length);
}

function goToBoardPage(page) {
  boardState.currentPage = page;
  applyFiltersAndRender({ resetPage: false });
}

function renderCategoryTabs(containerEl, activeCategory) {
  if (!containerEl) return;

  containerEl.innerHTML = BOARD_CATEGORIES.map((category) => {
    const isActive = category === activeCategory;
    return `<button type="button" class="board-category-tab${isActive ? ' is-active' : ''}" data-category="${escapeText(category)}" role="tab" aria-selected="${isActive}">${escapeText(category)}</button>`;
  }).join('');
}

function setupCategoryTabEvents(containerEl) {
  if (!containerEl) return;

  containerEl.addEventListener('click', (event) => {
    const button = event.target.closest('.board-category-tab');
    if (!button) return;

    const category = button.getAttribute('data-category');
    if (!category || category === boardState.category) return;

    boardState.category = category;
    renderCategoryTabs(containerEl, category);
    applyFiltersAndRender({ resetPage: true });
  });
}

function setupSearchEvents(formEl, inputEl, clearBtnEl) {
  if (!formEl || !inputEl) return;

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    boardState.searchTerm = inputEl.value;
    applyFiltersAndRender({ resetPage: true });
  });

  inputEl.addEventListener('input', () => {
    boardState.searchTerm = inputEl.value;
    if (clearBtnEl) clearBtnEl.hidden = !inputEl.value;
    applyFiltersAndRender({ resetPage: true });
  });

  if (clearBtnEl) {
    clearBtnEl.hidden = !inputEl.value;
    clearBtnEl.addEventListener('click', () => {
      inputEl.value = '';
      boardState.searchTerm = '';
      clearBtnEl.hidden = true;
      applyFiltersAndRender({ resetPage: true });
      inputEl.focus();
    });
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

  const skeletons = Array.from({ length: POSTS_PER_PAGE }, (_, index) => `
    <tr class="board-skeleton-row" role="status" aria-label="게시글 로딩 중 ${index + 1}">
      <td colspan="4"><div class="board-skeleton-line"></div></td>
    </tr>
  `).join('');
  listEl.innerHTML = skeletons;
  if (summaryEl) {
    summaryEl.textContent = '게시글을 불러오는 중입니다.';
  }
}

function buildMessageFillerRows(usedRowCount) {
  const fillerCount = Math.max(0, POSTS_PER_PAGE - usedRowCount);
  return Array.from({ length: fillerCount }, () => (
    '<tr class="board-row-filler" aria-hidden="true"><td colspan="4">&nbsp;</td></tr>'
  )).join('');
}

function renderEmptyState(listEl, summaryEl, paginationEl) {
  if (!listEl) return;
  listEl.innerHTML = `
    <tr class="board-table-message" role="status">
      <td colspan="4">
        <strong>등록된 게시글이 없습니다.</strong>
        <p>새로운 소식이 등록되면 이곳에서 확인하실 수 있습니다.</p>
      </td>
    </tr>
  ` + buildMessageFillerRows(1);
  if (summaryEl) {
    summaryEl.textContent = '등록된 게시글이 없습니다.';
  }
  if (paginationEl) {
    paginationEl.innerHTML = '';
  }
}

function renderNoResultsState(listEl, summaryEl, paginationEl) {
  if (!listEl) return;
  listEl.innerHTML = `
    <tr class="board-table-message" role="status">
      <td colspan="4">
        <strong>검색 결과가 없습니다.</strong>
      </td>
    </tr>
  ` + buildMessageFillerRows(1);
  if (summaryEl) {
    summaryEl.textContent = '검색 결과가 없습니다.';
  }
  if (paginationEl) {
    paginationEl.innerHTML = '';
  }
}

function renderErrorState(listEl, summaryEl, paginationEl) {
  if (!listEl) return;
  listEl.innerHTML = `
    <tr class="board-table-message" role="alert">
      <td colspan="4">
        <strong>게시글을 불러오지 못했습니다.</strong>
        <p>잠시 후 다시 시도해 주세요.</p>
        <button class="btn btn-outline-navy" id="boardRetryBtn" type="button">다시 시도</button>
      </td>
    </tr>
  ` + buildMessageFillerRows(1);
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

function renderBoardPosts(listEl, posts, currentPage, total) {
  if (!listEl) return;

  if (!posts.length) {
    renderEmptyState(listEl, null, null);
    return;
  }

  const safeTotal = Number.isFinite(Number(total)) && Number(total) > 0
    ? Math.floor(Number(total))
    : posts.length;

  const postRows = posts.map((post, index) => {
    const safeTitle = escapeText(post.title || '제목 없음');
    const safeDate = escapeText(formatBoardDate(post.date));
    const postCategory = getPostCategory(post);
    const safeKeyword = postCategory ? escapeText(postCategory) : '-';
    const globalIndex = (currentPage - 1) * POSTS_PER_PAGE + index;
    const rowNumber = Math.max(1, safeTotal - globalIndex);
    const safeNumber = String(rowNumber).padStart(2, '0');
    const detailUrl = `board-detail.html?id=${encodeURIComponent(post.id)}&page=${currentPage}&from=board`;
    const rowDelay = Math.min(index * 45, 280);

    return `
      <tr style="transition-delay: ${rowDelay}ms">
        <td>${safeNumber}</td>
        <td><a class="board-title-link" href="${detailUrl}">${safeTitle}</a></td>
        <td><span class="board-keyword-tag">${safeKeyword}</span></td>
        <td>${safeDate}</td>
      </tr>
    `;
  }).join('');

  const fillerCount = Math.max(0, POSTS_PER_PAGE - posts.length);
  const fillerRows = Array.from({ length: fillerCount }, (_, index) => {
    const rowDelay = Math.min((posts.length + index) * 45, 280);
    return `<tr class="board-row-filler" style="transition-delay: ${rowDelay}ms" aria-hidden="true"><td colspan="4">&nbsp;</td></tr>`;
  }).join('');

  listEl.innerHTML = postRows + fillerRows;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      listEl.querySelectorAll('tr').forEach((row) => row.classList.add('is-visible'));
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
    link.addEventListener('click', (event) => {
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
      goToBoardPage(targetPage);
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

if (document.getElementById('boardList')) {
  window.addEventListener('DOMContentLoaded', initializeBoard);
}
