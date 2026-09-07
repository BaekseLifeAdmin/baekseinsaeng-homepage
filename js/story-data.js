/*
  방문간호 이야기 — 새 블로그 콘텐츠 데이터
  기존 Google Sheets 게시판(js/board-data.js, js/board.js)과는 완전히 별개의 데이터입니다.

  새 콘텐츠를 추가하는 방법 (약 2주 간격 발행):
  1. 아래 STORY_POSTS 배열 맨 앞에 새 객체를 추가한다 (배열 순서 = 정렬 순서, 최신 글이 맨 위).
  2. 상세 본문은 board-story-01.html을 복사해 board-story-0N.html로 만들고 내용을 채운다.
  3. 새 객체의 detailPage 값을 그 파일명으로 지정한다.

  각 항목 필드:
  - id: 고유 번호
  - title: 목록/대표 영역에 노출되는 제목
  - category: 8개 기존 카테고리 라벨 중 하나(필터 UI는 이번 단계에서 미노출, 데이터만 보관)
  - summary: 목록/대표 영역에 노출되는 한 줄 요약
  - thumbnail: 대표 이미지 경로 (현재 Featured 카드에는 미노출, 추후 목록형 카드·OG 이미지 등에 대비해 보관)
  - date: 작성일 (YYYY.MM.DD)
  - detailPage: 클릭 시 이동할 상세 HTML 파일
  - keywords: 검색 기능 도입 시 사용할 키워드 배열 (이번 단계에서는 저장만 함)
  - toc: 상세 페이지 목차와 동일한 목록. Featured 카드 오른쪽 "이 글에서 다루는 내용"에 노출되며,
         각 항목의 id는 상세 페이지의 <section id="..."> 앵커와 일치해야 한다.
*/

const STORY_POSTS = [
  {
    id: 1,
    title: '방문간호란 무엇인가요?',
    category: '방문간호 알아보기',
    summary: '방문간호와 방문요양의 차이부터 방문간호가 필요한 상황까지 알아봅니다.',
    thumbnail: 'images/png/02Services.png',
    date: '2026.09.06',
    detailPage: 'board-story-01.html',
    keywords: ['방문간호', '방문요양 방문간호 차이', '노인장기요양보험 방문간호'],
    toc: [
      { id: 'sec-1', label: '방문요양과 무엇이 다를까요?' },
      { id: 'sec-2', label: "방문간호는 '병원 밖, 집에서 이어지는 간호'입니다" },
      { id: 'sec-3', label: '방문요양과 방문간호, 무엇이 다른가요?' },
      { id: 'sec-4', label: '이런 어르신이라면 방문간호를 생각해 보세요' },
      { id: 'sec-5', label: '방문간호사는 집에서 무엇을 살필까요?' },
      { id: 'sec-6', label: '방문요양을 받고 있어도 건강관리는 별도의 영역입니다' },
      { id: 'sec-7', label: '우리 부모님에게 방문간호가 필요한지 모르겠다면' }
    ]
  }
];
