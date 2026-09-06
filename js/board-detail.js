if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdfjs/pdf.worker.min.js';
}

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

    const pdfMedia = detailContent.querySelector('.board-detail-media-pdf');
    if (pdfMedia) {
      initBoardDetailPdfViewer(pdfMedia);
    }

    if (relatedPostsEl) {
      relatedPostsEl.innerHTML = `
        <div class="board-related-item">
          ${previousPost ? `<span class="board-related-label">이전 글</span><p class="board-related-title">${escapeText(previousPost.title || '제목 없음')}</p><a class="board-related-link" href="board-detail.html?id=${encodeURIComponent(previousPost.id)}&page=${getListPageFromQuery(window.location.search)}&from=board"><span class="board-arr-left" aria-hidden="true">← </span>이전 글 보기<span class="board-arr-right" aria-hidden="true"> →</span></a>` : `<span class="board-related-label">이전 글</span><p class="board-related-empty">이전 글이 없습니다.</p>`}
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
  const safeUrl = escapeText(imageUrl);

  if (isPdfUrl(imageUrl)) {
    const safeTitle = escapeText(altText || '첨부 문서');
    return `
      <div class="board-detail-media board-detail-media-pdf" data-pdf-url="${safeUrl}" data-pdf-title="${safeTitle}">
        <div class="board-pdf-viewer">
          <div class="board-pdf-state" role="status">PDF를 불러오는 중입니다...</div>
          <div class="board-pdf-pages"></div>
        </div>
        <hr class="board-detail-divider">
      </div>
    `;
  }

  const safeAlt = escapeText(altText || '게시글 이미지');

  return `
    <div class="board-detail-media">
      <img class="board-detail-image" src="${safeUrl}" alt="${safeAlt}">
      <hr class="board-detail-divider">
    </div>
  `;
}

function isPdfUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value, window.location.href);
    return /\.pdf$/i.test(parsed.pathname);
  } catch (error) {
    const withoutHash = value.split('#')[0].split('?')[0];
    return /\.pdf$/i.test(withoutHash);
  }
}

function initBoardDetailPdfViewer(mediaEl) {
  const url = mediaEl.getAttribute('data-pdf-url');
  const stateEl = mediaEl.querySelector('.board-pdf-state');
  const pagesEl = mediaEl.querySelector('.board-pdf-pages');

  if (!url || !pagesEl) return;

  if (typeof pdfjsLib === 'undefined') {
    showPdfError(mediaEl, 'PDF 뷰어를 불러오지 못했습니다.');
    return;
  }

  let pdfDoc = null;
  let renderGeneration = 0;

  async function renderAllPages() {
    const myGeneration = ++renderGeneration;
    pagesEl.innerHTML = '';

    const containerWidth = pagesEl.clientWidth || mediaEl.clientWidth || 320;
    const outputScale = window.devicePixelRatio || 1;

    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
      if (myGeneration !== renderGeneration) return;

      const page = await pdfDoc.getPage(pageNumber);
      if (myGeneration !== renderGeneration) return;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const fitScale = containerWidth > 0 ? containerWidth / unscaledViewport.width : 1;
      const viewport = page.getViewport({ scale: fitScale });

      const pageWrap = document.createElement('div');
      pageWrap.className = 'board-pdf-page';

      const canvas = document.createElement('canvas');
      canvas.className = 'board-pdf-canvas';
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      pageWrap.appendChild(canvas);
      pagesEl.appendChild(pageWrap);

      if (pageNumber === 1 && stateEl) {
        stateEl.hidden = true;
      }

      const context = canvas.getContext('2d');
      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      await page.render({ canvasContext: context, transform, viewport }).promise;
    }
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (!pdfDoc) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      renderAllPages().catch((error) => {
        if (error && error.name === 'RenderingCancelledException') return;
        showPdfError(mediaEl, 'PDF 페이지를 표시하지 못했습니다.');
      });
    }, 250);
  });

  loadPdfDocument(url).then((doc) => {
    pdfDoc = doc;
    return renderAllPages();
  }).catch((error) => {
    if (error && error.name === 'RenderingCancelledException') return;
    showPdfError(mediaEl, 'PDF를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  });
}

/**
 * Safari(WebKit)는 동일 URL에 대한 반복적인 Range 요청을 캐시에서
 * 잘못 조합하는 버그가 있어 PDF.js의 청크 단위 로드가 실패할 수 있다.
 * Safari에서는 처음부터 Range 요청 없이 전체를 한 번에 받는다.
 */
function isSafariBrowser() {
  const ua = navigator.userAgent || '';
  return /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
}

/**
 * 일부 모바일 인앱 브라우저(카카오톡 등)는 Web Worker 생성을 제한해
 * 기본 로드가 실패할 수 있다. 그 경우 워커 없이(메인 스레드) 재시도한다.
 */
function loadPdfDocument(url) {
  const initialParams = isSafariBrowser() ? { url, disableRange: true, disableStream: true } : url;

  return pdfjsLib.getDocument(initialParams).promise.catch((error) => {
    if (error && error.name === 'RenderingCancelledException') throw error;
    return pdfjsLib.getDocument({ url, disableWorker: true, disableRange: true, disableStream: true }).promise;
  });
}

function showPdfError(mediaEl, message) {
  const stateEl = mediaEl.querySelector('.board-pdf-state');
  const pagesEl = mediaEl.querySelector('.board-pdf-pages');
  if (pagesEl) pagesEl.innerHTML = '';
  if (stateEl) {
    stateEl.hidden = false;
    stateEl.className = 'board-pdf-state board-pdf-state-error';
    stateEl.setAttribute('role', 'alert');
    stateEl.textContent = message;
  }
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
