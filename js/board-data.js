const BOARD_API_URL = 'https://script.google.com/macros/s/AKfycbw6LUMjuGqqdn3J7d3qnkWicpPlXgTZ7zYaXuy2fCDCn7qPtSPErAClgcpjlGtj9dcDkg/exec';

async function fetchBoardApi(parameters = {}) {
  const url = new URL(BOARD_API_URL);

  Object.entries(parameters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(String(key), String(value));
  });

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('INVALID_JSON');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('INVALID_RESPONSE');
    }

    if (data.success === false) {
      const error = new Error(typeof data.message === 'string' && data.message.trim() ? data.message : '게시글을 불러오지 못했습니다.');
      error.code = 'API_ERROR';
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('TIMEOUT');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getBoardPosts(page = 1, limit = 9) {
  const response = await fetchBoardApi({ action: 'getPosts', page, limit });
  const posts = Array.isArray(response.posts) ? response.posts : [];
  const safePage = Number.isInteger(Number(response.page)) ? Number(response.page) : Number(page) || 1;
  const safeLimit = Number.isInteger(Number(response.limit)) ? Number(response.limit) : Number(limit) || 9;
  const safeTotal = Number.isInteger(Number(response.total)) ? Number(response.total) : posts.length;
  const safeTotalPages = Number.isInteger(Number(response.totalPages)) ? Number(response.totalPages) : Math.max(1, Math.ceil(safeTotal / safeLimit));

  return {
    posts,
    page: safePage,
    limit: safeLimit,
    total: safeTotal,
    totalPages: safeTotalPages
  };
}

async function getAllBoardPosts() {
  const firstPage = await getBoardPosts(1, 50);
  const allPosts = firstPage.posts.slice();
  const totalPages = Math.max(1, Number(firstPage.totalPages) || 1);

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await getBoardPosts(page, 50);
    allPosts.push(...nextPage.posts);
  }

  return allPosts;
}

async function getBoardPostById(postId) {
  const safePostId = String(postId || '').trim();
  if (!safePostId) {
    const error = new Error('게시글 ID가 없습니다.');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const response = await fetchBoardApi({ action: 'getPost', id: safePostId });
  if (response && response.success === false) {
    const error = new Error(typeof response.message === 'string' && response.message.trim() ? response.message : '게시글을 찾을 수 없습니다.');
    error.code = 'NOT_FOUND';
    throw error;
  }

  return {
    post: response && response.post ? response.post : null,
    previousPost: response && response.previousPost ? response.previousPost : null,
    nextPost: response && response.nextPost ? response.nextPost : null
  };
}

function filterPublishedPosts(posts) {
  return posts.filter((post) => post && post.status === '공개');
}

function sortPostsByDate(posts) {
  return [...posts].sort((a, b) => parseBoardDate(b.date) - parseBoardDate(a.date));
}

function parseBoardDate(date) {
  const match = String(date || '').trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return 0;
  const [, year, month, day] = match;
  return Number(`${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`);
}

function formatBoardDate(date) {
  const match = String(date || '').trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return '날짜 미정';
  const [, year, month, day] = match;
  const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(parsedDate.getTime())) return '날짜 미정';
  return `${parsedDate.getUTCFullYear()}. ${parsedDate.getUTCMonth() + 1}. ${parsedDate.getUTCDate()}.`;
}

function createPostExcerpt(content, maxLength = 80) {
  const plainText = String(content || '')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength)}...`
    : plainText;
}

function getCurrentPage(search) {
  const params = new URLSearchParams(search || window.location.search);
  const rawPage = params.get('page');
  const pageNumber = Number(rawPage);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return pageNumber;
}

function getPostIdFromQuery(search) {
  const params = new URLSearchParams(search || window.location.search);
  const postId = params.get('id');
  return typeof postId === 'string' && postId.trim() ? postId.trim() : '';
}

function getListPageFromQuery(search) {
  const params = new URLSearchParams(search || window.location.search);
  const rawPage = params.get('page');
  const pageNumber = Number(rawPage);
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return pageNumber;
}
