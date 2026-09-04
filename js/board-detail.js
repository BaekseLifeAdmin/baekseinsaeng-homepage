async function initializeBoardDetail() {
  const detailContent = document.getElementById('boardDetailContent');
  const relatedPostsEl = document.getElementById('boardRelatedPosts');
  const backLink = document.getElementById('detailBackLink');

  if (!detailContent) return;

  detailContent.innerHTML = '<div class="board-state" role="status"><strong>게시글을 불러오는 중입니다.</strong><p>잠시만 기다려 주세요.</p></div>';

  try {
    const postId = getPostIdFromQuery(window.location.search);
    const detailResponse = await getBoardPostById(postId);
    const post = detailResponse && detailResponse.post ? detailResponse.post : null;
    const previousPost = detailResponse && detailResponse.previousPost ? detailResponse.previousPost : null;
    const nextPost = detailResponse && detailResponse.nextPost ? detailResponse.nextPost : null;

    if (!post || post.status !== '공개') {
      renderBoardNotFound(detailContent, backLink);
      return;
    }

    document.title = `${post.title || '게시글'} | 백세인생 방문간호`;
    if (backLink) {
      const pageValue = getListPageFromQuery(window.location.search);
      const safePage = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
      backLink.setAttribute('href', `board.html?page=${safePage}&from=board`);
    }

    detailContent.innerHTML = `
      <article>
        <div class="board-detail-meta">
          <span>${escapeText(formatBoardDate(post.date))}</span>
        </div>
        <h1 class="board-detail-title">${escapeText(post.title || '제목 없음')}</h1>
        <hr class="board-detail-divider">
        ${renderDetailImage(post.imageUrl, post.title)}
        <div class="board-detail-content">${escapeText(post.content || '내용이 없습니다.')}</div>
      </article>
    `;

    const detailImage = detailContent.querySelector('.board-detail-image');
    if (detailImage) {
      detailImage.addEventListener('error', () => {
        const media = detailImage.closest('.board-detail-media');
        if (media) media.remove();
      }, { once: true });
    }

    if (relatedPostsEl) {
      relatedPostsEl.innerHTML = `
        <div class="board-related-item">
          ${previousPost ? `<span class="board-related-label">이전 글</span><p class="board-related-title">${escapeText(previousPost.title || '제목 없음')}</p><a class="board-related-link" href="board-detail.html?id=${encodeURIComponent(previousPost.id)}&page=${getListPageFromQuery(window.location.search)}&from=board">이전 글 보기 →</a>` : `<span class="board-related-label">이전 글</span><p class="board-related-empty">이전 글이 없습니다.</p>`}
        </div>
        <div class="board-related-item is-next">
          ${nextPost ? `<span class="board-related-label">다음 글</span><p class="board-related-title">${escapeText(nextPost.title || '제목 없음')}</p><a class="board-related-link" href="board-detail.html?id=${encodeURIComponent(nextPost.id)}&page=${getListPageFromQuery(window.location.search)}&from=board">다음 글 보기 →</a>` : `<span class="board-related-label">다음 글</span><p class="board-related-empty">다음 글이 없습니다.</p>`}
        </div>
      `;
    }
  } catch (error) {
    const isNotFound = error && (error.code === 'NOT_FOUND' || error.message === '게시글 ID가 없습니다.');
    renderBoardNotFound(detailContent, backLink, !isNotFound);
  }
}

function renderBoardNotFound(detailContent, backLink, isError = false) {
  if (!detailContent) return;
  detailContent.innerHTML = `
    <div class="board-state" role="alert">
      <strong>${isError ? '게시글을 불러오지 못했습니다.' : '게시글을 찾을 수 없습니다.'}</strong>
      <p>${isError ? '잠시 후 다시 시도해 주세요.' : '삭제되었거나 비공개로 전환된 게시글입니다.'}</p>
      <a class="btn btn-outline-navy" href="board.html?page=1&from=board">목록으로 이동</a>
    </div>
  `;
  if (backLink) {
    backLink.setAttribute('href', 'board.html?page=1&from=board');
  }
}

function renderDetailImage(imageUrl, altText) {
  if (!isSafeImageUrl(imageUrl)) {
    return '';
  }
  const safeAlt = escapeText(altText || '게시글 이미지');
  const safeUrl = escapeText(imageUrl);

  return `
    <div class="board-detail-media">
      <img class="board-detail-image" src="${safeUrl}" alt="${safeAlt}">
      <hr class="board-detail-divider">
    </div>
  `;
}

function escapeText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isSafeImageUrl(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return false;
  return true;
}

if (document.getElementById('boardDetailContent')) {
  window.addEventListener('DOMContentLoaded', initializeBoardDetail);
}
