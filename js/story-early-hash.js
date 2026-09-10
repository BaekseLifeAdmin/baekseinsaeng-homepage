/*
  방문간호 이야기 상세 페이지 전용 — <head>에서 가장 먼저 실행되어야 하는 스크립트.
  URL 해시(#sec-N)를 본문(body)이 파싱되기 전에 제거한다. body 파싱이 끝난 뒤(js/story-detail.js,
  현재 <body> 맨 아래)에서 해시를 지우면 브라우저가 이미 해당 id 요소로 자동 스크롤을 마친 뒤라
  늦다 — 그 시점엔 아직 모든 section이 노출된 상태라 스크롤 위치가 section마다 제각각으로 잡히고,
  이후 story-detail.js가 나머지 section을 hidden 처리하면 레이아웃이 줄어들며 화면이 잘려 보인다.
  그래서 body가 존재하기 전인 <head>에서 해시를 미리 떼어내 브라우저의 자동 스크롤 자체가
  일어나지 않게 한다.
*/
window.__storyInitialHash = (window.location.hash || '').replace(/^#/, '');
if (window.__storyInitialHash && window.history && window.history.replaceState) {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}
