# 백세인생 방문간호센터 프로젝트 구조·수정 가이드

작성 기준일: 2026-08-14  
분석 범위: 현재 프로젝트 폴더의 HTML, CSS, JavaScript, 이미지·영상, 보조 문서와 화면 캡처 도구

## 1. 프로젝트 한눈에 보기

이 프로젝트는 별도의 빌드 과정이나 프레임워크가 없는 **정적 웹사이트**입니다.

- 기술: HTML5, CSS3, Vanilla JavaScript
- 시작 페이지: `index.html`
- 실제 웹페이지: 8개
- 패키지 설치: 필요 없음 (`package.json`, 번들러, 프레임워크 없음)
- 공통 화면: `js/main.js`가 헤더, 모바일 메뉴, 푸터, 우측 고정 상담 버튼을 각 페이지에 삽입
- 공통 스타일: `css/style.css`를 먼저 적용하고 `css/consistency.css`를 마지막에 적용
- 외부 서비스: Google Fonts, 카카오 지도, 게시판용 Google Apps Script, 상담 접수용 Google Apps Script

전체 흐름은 다음과 같습니다.

```text
각 HTML 페이지
├─ css/style.css                 기본 공통 스타일
├─ css/[페이지명].css           해당 페이지 전용 스타일(메인은 없음)
├─ css/consistency.css          전 페이지 최종 통일·덮어쓰기 스타일
├─ js/main.js                   공통 헤더·푸터·메뉴·애니메이션
└─ js/[페이지명].js             필요한 페이지에만 적용되는 기능

공유 데이터
├─ js/service-catalog.js        메인·센터소개·서비스의 서비스 카드 데이터
└─ js/board-data.js             게시판 목록·상세가 함께 쓰는 외부 API 연결부
```

## 2. 페이지별 연결 관계

아래 순서는 실제 HTML에 적힌 로드 순서입니다. CSS는 뒤에 불러온 파일이 앞 파일의 규칙을 덮어쓸 수 있으므로 순서가 중요합니다.

| 페이지 | 역할 | 연결 CSS | 연결 JavaScript | 주요 이미지·외부 연결 |
|---|---|---|---|---|
| `index.html` | 메인/홈 | `style.css` → `consistency.css` | `service-catalog.js` → `main.js` | `videos/home-hero2.mp4` |
| `about.html` | 센터소개 4개 탭 | `style.css` → `about.css` → `consistency.css` | `service-catalog.js` → `main.js` → 카카오 지도 로더 → `about.js` | `01About Us.png`, 카카오 지도 |
| `service.html` | 8가지 방문간호 서비스 상세 | `style.css` → `service.css` → `consistency.css` | `service-catalog.js` → `main.js` → `service.js` | `02Services.png` |
| `guide.html` | 이용안내 8개 탭과 FAQ | `style.css` → `guide.css` → `consistency.css` | `main.js` → `guide.js` | `03Service Guide.png` |
| `case.html` | 간호사례 8건 | `style.css` → `case.css` → `consistency.css` | `main.js` | `04Nursing Cases.png`, `c1.png`~`c8.png` |
| `counseling.html` | 보호자 온라인 상담 신청 | `style.css` → `counseling.css` → `consistency.css` | `main.js` → `counseling.js` | `06Consultation.png`, 상담용 Google Apps Script |
| `board.html` | 게시글 목록과 페이지 이동 | `style.css` → `board.css` → `consistency.css` | `board-data.js` → `board.js` → `main.js` | `05News.png`, 게시판용 Google Apps Script |
| `board-detail.html` | 게시글 상세/이전 글/다음 글 | `style.css` → `board-detail.css` → `consistency.css` | `board-data.js` → `board-detail.js` → `main.js` | 게시판용 Google Apps Script; 전체화면 영웅 이미지는 없음 |

모든 일반 페이지는 `<body data-page="...">`, `<div id="header-placeholder">`, `<div id="footer-placeholder">`를 사용합니다. 이 세 요소는 `main.js`의 현재 메뉴 표시, 페이지별 영웅 이미지, 헤더·푸터 삽입 기능과 연결되므로 삭제하거나 이름을 바꾸면 공통 기능이 깨집니다.

## 3. HTML 파일별 역할과 수정 위치

### `index.html` — 메인 페이지

- 첫 화면 배경 영상과 6개 순환 문구
- 핵심 신뢰 근거, 8가지 서비스 카드, 방문간호 선택 이유, 상담 CTA
- `<div data-service-catalog="home">` 안의 서비스 카드는 HTML에 직접 적혀 있지 않고 `js/service-catalog.js`가 생성
- 첫 화면 영상 교체: `<source src="videos/home-hero2.mp4">` 수정
- 메인 문구와 섹션 내용 수정: 이 HTML에서 수정
- 헤더·푸터 내용 수정: 이 파일이 아니라 `js/main.js`에서 수정

### `about.html` — 센터소개

- 탭: 인사말, 제공서비스, 관리시스템, 오시는 길
- 탭 버튼의 `data-tab="greeting|services|system|location"`과 패널의 `id="tab-..."`가 한 쌍
- 서비스 카드 영역은 `js/service-catalog.js`가 생성
- 주소, 대표전화, 운영시간, 교통편, 카카오맵 길찾기 URL은 이 HTML에 있음
- 카카오 지도 컨테이너 ID는 `js/about.js`의 ID와 같아야 함
- `about.html#location`으로 들어오면 오시는 길 탭이 자동으로 열림

### `service.html` — 방문간호서비스

- 상단 서비스 요약 카드와 왼쪽 빠른 선택 메뉴는 `js/service-catalog.js`가 생성
- 8개 상세 섹션의 실제 설명과 표·목록은 이 HTML에 직접 작성
- 상세 섹션 ID는 다음과 같으며 `service-catalog.js`의 `anchor` 값과 반드시 일치해야 함

```text
wound-care
chronic-disease
rehabilitation
tube-care
vital-check
bedridden-care
counseling-home
medication
```

- `service.html#wound-care` 같은 주소로 특정 서비스에 직접 연결 가능
- `js/service.js`가 화면 스크롤 위치에 맞춰 왼쪽 빠른 메뉴의 활성 항목을 변경

### `guide.html` — 이용안내

- 탭 8개: 방문간호, 이용절차, 이용대상, 장기요양등급, 의사 지시서, 이용요금, 준비서류, FAQ
- 탭 버튼 `data-tab`과 패널 `id="tab-..."`가 연결됨
- URL 해시로 탭 직접 열기 가능: `#nursing`, `#process`, `#target`, `#grade`, `#directive`, `#cost`, `#prepare`, `#faq`
- FAQ 버튼의 `aria-controls`와 답변 패널 ID가 한 쌍
- 요금, 등급, 필요 서류, FAQ 내용은 이 HTML에서 수정
- 탭 전환과 FAQ 열기/닫기는 `js/guide.js` 담당

### `case.html` — 간호사례

- 8개 사례가 `article#case-01`부터 `article#case-08`까지 직접 작성됨
- 각 사례의 제목, 태그, 설명, 참고 문구는 이 HTML에서 수정
- 사례 이미지는 `images/png/c1.png`부터 `c8.png`까지 사례 번호 순서대로 사용
- 하단 면책/안내 문구와 상담 CTA도 이 HTML에 있음

### `counseling.html` — 보호자상담

- 상담 폼, 개인정보 동의 내용, 센터 연락 정보, 상담 진행 순서를 포함
- 폼 필드: 보호자 이름, 연락처, 환자 연령, 상담 방법, 관심 서비스, 개인정보 동의
- `id`와 `name`은 `js/counseling.js`가 직접 찾는 값이므로 디자인만 바꿀 때도 임의 변경 금지
- 서비스 체크박스 항목을 변경하면 외부 접수 데이터의 `services` 값도 달라짐
- 전화번호, 운영시간, 주소가 `main.js`, `about.html`, 다른 CTA에도 중복되어 있으므로 함께 검색하여 수정해야 함

### `board.html` — 게시판 목록

- HTML에는 목록 내용을 직접 저장하지 않고 목록 컨테이너만 있음
- `#boardList`, `#boardPagination`, `#boardSummary`를 `js/board.js`가 채움
- 한 페이지당 게시글 수는 `js/board.js`의 `POSTS_PER_PAGE = 9`
- 페이지 주소 형식: `board.html?page=2`
- 게시글 등록/수정 화면은 이 프로젝트에 없으며 외부 데이터/API에서 관리

### `board-detail.html` — 게시판 상세

- 게시글 ID를 URL에서 받아 외부 API로 상세 내용을 요청
- 주소 형식: `board-detail.html?id=게시글ID&page=목록페이지`
- `page` 값은 목록으로 돌아갈 때 원래 페이지를 기억하는 용도
- `#boardDetailContent`, `#boardRelatedPosts`, `#detailBackLink`를 `js/board-detail.js`가 사용
- 게시글 제목, 날짜, 이미지, 본문, 이전/다음 글은 API 응답으로 생성

## 4. CSS 파일별 역할과 우선순위

### 실제 우선순위

```text
Google Fonts
  ↓
css/style.css
  ↓
css/[페이지명].css
  ↓
css/consistency.css  ← 마지막 적용, 최종 화면에 가장 강한 영향
```

CSS를 수정했는데 화면이 바뀌지 않으면 `consistency.css`에 같은 요소를 더 뒤에서 다시 정의했는지 먼저 확인해야 합니다. 이 파일에는 `!important`도 일부 사용되어 단순히 페이지 전용 CSS를 수정하는 것만으로는 적용되지 않을 수 있습니다.

### `css/style.css` — 기본 공통 스타일

- 색상·폰트·간격·그림자·곡률 CSS 변수
- 초기화(reset), 컨테이너
- 헤더, 로고, 데스크톱 메뉴, 햄버거, 모바일 메뉴와 오버레이
- 푸터, 버튼, 카드, 태그, 체크리스트
- 스크롤 등장 효과 `.reveal`
- 우측 고정 전화·카카오·유튜브 버튼
- 공통 반응형 규칙
- 파일 중간에 새로운 색상 변수 세트가 다시 선언되어 앞쪽 값을 덮어쓰는 구조
- Google Fonts를 `@import`하지만 각 HTML도 동일 폰트를 `<link>`로 불러와 현재는 중복 요청 구조

### `css/consistency.css` — 최종 통일 및 페이지별 덮어쓰기

- 모든 HTML에서 마지막에 로드되는 가장 영향력이 큰 스타일
- 현재 40px/30px/25px 중심의 공통 글자 단계와 간격 변수
- 전 페이지 컨테이너 폭, 섹션 간격, 카드, 탭, CTA, 폼 통일
- 메인 화면과 각 서브페이지에 대한 다수의 후기 보정 규칙
- 서브페이지 전체화면 영웅 이미지 6종 연결
- 공통 서브페이지 애니메이션과 영웅 화면 자동 진행 스타일
- 파일이 크고 뒤쪽 규칙이 앞쪽 규칙을 재정의하므로 수정 전 대상 선택자를 파일 전체에서 검색하는 것이 안전

### 페이지 전용 CSS

| 파일 | 담당 영역 |
|---|---|
| `css/about.css` | 센터소개 탭, 인사말, 통계, 비교표, 서비스 아이콘, 관리시스템, 오시는 길, 지도 |
| `css/service.css` | 서비스 개요, 8개 상세 구간, 욕창 단계, 만성질환, 재활, 튜브·투약·상담 영역, 왼쪽 빠른 메뉴 |
| `css/guide.css` | 이용안내 탭, 절차·대상·등급·지시서·요금·서류·FAQ의 각 컴포넌트 |
| `css/case.css` | 6개 사례의 이미지/텍스트 교차 배치, 태그, 면책 문구, 하단 CTA |
| `css/counseling.css` | 상담 폼, 입력·라디오·체크박스, 개인정보 영역, 상태 메시지, 센터 정보와 진행 절차 |
| `css/board.css` | 게시판 카드 그리드, 로딩 스켈레톤, 빈 목록·오류 상태, 페이지 이동 |
| `css/board-detail.css` | 게시글 상세 카드, 본문 이미지, 이전/다음 글, 오류 상태 |

페이지 전용 CSS 뒤에 `consistency.css`가 로드된다는 점을 항상 함께 고려해야 합니다.

## 5. JavaScript 파일별 역할과 연결

### `js/main.js` — 모든 페이지 공통

이 파일은 사이트 전체에서 가장 중요한 공통 파일입니다.

- `HEADER_HTML`, `FOOTER_HTML`을 각 HTML의 placeholder에 삽입
- 공통 로고와 전체 메뉴 링크 생성
- 전화번호, 운영시간, 주소, 기관번호, 사업자번호, 푸터 문구 관리
- 스크롤 시 헤더 상태 변경
- 모바일 메뉴 열기/닫기, 오버레이, ESC 키 처리
- `<body data-page>`를 이용해 현재 메뉴 활성화
- 메인 영웅 문구를 10초 간격으로 순환
- 서브페이지 첫 영웅 화면 애니메이션과 자동 스크롤
- `.reveal`, `[data-reveal-group]` 요소의 스크롤 등장 효과
- 우측 고정 전화/카카오/유튜브 버튼

상단 설정값:

```js
const PHONE = '042-719-1350';
const PHONE_HREF = 'tel:0427191350';
const KAKAO_CHANNEL_URL = '';
const YOUTUBE_CHANNEL_URL = '';
```

카카오와 유튜브 URL은 현재 비어 있습니다. 비어 있는 동안 클릭하면 준비 중 안내가 표시됩니다. 실제 채널을 연결할 때 이 두 값에 전체 URL을 입력합니다.

### `js/service-catalog.js` — 서비스 단일 기준 데이터

- 8개 서비스의 key, 상세 anchor, SVG 아이콘, 이름, 페이지별 요약 문구 저장
- `data-service-catalog="home"`: 메인 서비스 카드 생성
- `data-service-catalog="overview"`: 센터소개와 서비스 페이지의 서비스 카드 생성
- `data-service-catalog="quick"`: 서비스 페이지 왼쪽 빠른 메뉴 생성
- 서비스 페이지에서 8개 anchor에 해당하는 실제 상세 섹션이 존재하는지 검사
- 서비스명·순서·아이콘·요약 문구를 바꿀 때 가장 먼저 확인할 파일
- `about` 전용 렌더러와 데이터도 코드에 있으나 현재 HTML에는 `data-service-catalog="about"`가 없어 사용되지 않음

### `js/about.js`

- 센터소개 탭 전환
- `about.html#location` 같은 해시 직접 연결
- 새 탭을 연 뒤 적절한 위치로 스크롤
- 오시는 길 탭을 처음 열 때 카카오 Rough Map 생성
- 카카오 지도 `timestamp`, `key`, 컨테이너 ID가 `about.html`과 연결됨

### `js/service.js`

- 서비스 페이지의 왼쪽 빠른 선택 메뉴 표시/숨김
- 현재 보고 있는 서비스 항목 활성화
- 클릭 시 해당 상세 섹션으로 부드럽게 이동하고 URL 해시 갱신

### `js/guide.js`

- 이용안내 탭 전환과 해시 직접 연결
- 장기요양등급 영역에서 의사 지시서 탭으로 이동 처리
- FAQ는 한 번에 하나만 열리는 아코디언 방식

### `js/counseling.js`

- 전화번호 하이픈 자동 입력
- 개인정보 상세 내용 열기/닫기
- 이름, `010` 휴대전화 11자리, 상담 방법, 개인정보 동의 검증
- 입력 데이터를 JSON으로 만들어 상담용 Google Apps Script에 POST
- 전송 필드: `name`, `phone`, `age`, `consultType`, `services`, `privacyAgree`, `secretKey`

### `js/board-data.js`

- 게시판용 Google Apps Script API 주소 관리
- 목록 요청: `action=getPosts&page=...&limit=...`
- 상세 요청: `action=getPost&id=...`
- 15초 요청 제한, JSON 응답 검사, 날짜 변환, 요약문 생성, URL 쿼리 해석
- 목록과 상세 페이지가 모두 먼저 불러야 하는 공유 파일

### `js/board.js`

- 게시판 목록 API 호출과 카드 생성
- 로딩 스켈레톤, 빈 목록, 오류와 다시 시도 화면
- 한 페이지 9개, 표시 페이지 번호 3개
- 이미지 URL이 없거나 로드에 실패하면 기본 빈 이미지 영역 표시
- 게시글에 필요한 주요 필드: `id`, `title`, `date`, `content`, `imageUrl`

### `js/board-detail.js`

- URL의 게시글 ID로 상세 API 호출
- `status === '공개'`인 글만 표시
- 게시글 제목에 맞춰 브라우저 문서 제목 변경
- 이전/다음 게시글과 목록 복귀 링크 생성
- 본문은 안전을 위해 HTML로 해석하지 않고 문자로 출력하므로 줄바꿈/서식 HTML이 그대로 렌더링되지는 않음

## 6. 이미지·영상 파일 연결표

### 현재 화면에서 사용하는 파일

| 파일 | 사용 위치 |
|---|---|
| `images/png/Logo.png` | `main.js`가 만드는 공통 헤더·푸터 로고, `style.css` 로고 표시 |
| `images/png/01About Us.png` | 센터소개 전체화면 영웅 배경 (`consistency.css`) |
| `images/png/02Services.png` | 방문간호서비스 영웅 배경 (`consistency.css`) |
| `images/png/03Service Guide.png` | 이용안내 영웅 배경 (`consistency.css`) |
| `images/png/04Nursing Cases.png` | 간호사례 영웅 배경 (`consistency.css`) |
| `images/png/05News.png` | 게시판 목록 영웅 배경 (`consistency.css`) |
| `images/png/06Consultation.png` | 보호자상담 영웅 배경 (`consistency.css`) |
| `images/png/c1.png`~`c8.png` | 사례 1~8 |
| `videos/home-hero2.mp4` | 메인 첫 화면 배경 영상 |

CSS 안에서는 공백이 있는 파일명을 `%20`으로 적었습니다. 파일명을 바꾸면 `css/consistency.css`의 `background-image` 주소도 함께 수정해야 합니다.

### 현재 코드에서 사용하지 않는 파일

| 파일/폴더 | 현재 상태 |
|---|---|
| `videos/home-hero.mp4` | 이전 또는 후보 메인 영상; 현재 HTML은 `home-hero2.mp4` 사용 |
| `images/png/map.png` | 정적 지도 후보; 현재 카카오 지도를 사용하므로 미연결 |
| `images/png/stevepb-wheelchair-749985.jpg` | 코드 참조 없음 |
| `images/png/CORNEX Logo.png` | `main.js`가 만드는 공통 푸터의 CORNEX 로고 |
| `images/board/sample-01.svg`~`sample-10.svg` | 게시판 샘플 이미지지만 현재 외부 API 이미지 사용 |
| `images/placeholder/case1.svg`~`case6.svg` | 0바이트 빈 파일이며 코드 참조 없음 |

미사용이라고 해서 바로 삭제하기보다 원본/후보 보관 의도를 먼저 확인하는 것이 좋습니다. 실제 배포 파일 크기를 줄이려면 별도 백업 후 제외할 수 있습니다.

## 7. 외부 서비스와 프로젝트 밖의 데이터

### Google Fonts

- 모든 페이지가 Google Fonts의 Noto Sans KR을 연결
- 네트워크가 끊기면 시스템 한글 폰트로 대체
- `style.css`의 `@import`와 HTML `<link>`가 중복되어 있음

### 카카오 지도

- `about.html`에서 Daum Rough Map 로더를 외부로 불러옴
- `js/about.js`의 지도 `timestamp: 1786493370549`, `key: sfp9ogeobx5` 사용
- 별도 카카오맵 길찾기 단축 URL도 `about.html`에 있음
- 지도 위치가 바뀌면 HTML 주소 텍스트만 바꾸지 말고 지도 생성 정보와 길찾기 링크도 다시 발급/수정해야 함

### 게시판 Google Apps Script

- API 주소는 `js/board-data.js` 첫 줄의 `BOARD_API_URL`
- 게시물 원본과 Apps Script 서버 코드는 이 프로젝트 폴더에 없음
- 따라서 게시글 등록/수정, API 응답 형식, 권한, CORS 문제는 외부 Apps Script와 원본 데이터 저장소에서 확인해야 함
- 예상 목록 응답: `posts`, `page`, `limit`, `total`, `totalPages`
- 예상 상세 응답: `post`, `previousPost`, `nextPost`

### 상담 Google Apps Script

- 접수 주소는 `js/counseling.js`의 `CONSULT_WEB_APP_URL`
- `CONSULT_SECRET_KEY`도 브라우저에 전달되는 프런트엔드 코드이므로 보안상 진짜 비밀값으로 볼 수 없음
- 요청 모드가 `no-cors`라서 브라우저는 서버의 실제 성공/실패 응답 내용을 읽지 못함
- 현재 코드는 네트워크 요청 자체가 완료되면 성공 문구를 표시하므로, 서버 내부 저장 실패까지 화면에서 판별하지 못할 수 있음
- 상담 데이터가 실제 저장되는 시트/메일과 Apps Script 서버 코드는 이 폴더에 없음

## 8. 보조·문서·작업용 파일

| 파일/폴더 | 역할 | 배포 필요 여부 |
|---|---|---|
| `DESIGN_SPEC.md` | 초기 디자인 명세와 확인 체크리스트 | 웹 실행에는 불필요 |
| `.capture-full-pages.ps1` | Chrome DevTools로 8개 페이지 전체 화면 캡처 | 운영 배포에는 불필요 |
| `.capture-full-pages-tiled.ps1` | 긴 페이지를 여러 장 캡처해 이어 붙이는 도구 | 운영 배포에는 불필요 |
| `.capture-frame.html` | 타일 캡처 도구가 사용하는 숨김 iframe 페이지 | 캡처 도구와 함께 보관 |
| `full-page-captures/` | 캡처 결과 출력 폴더; 현재 비어 있음 | 운영 배포에는 불필요 |
| `.visual-case-*` 4개 폴더 | Chrome 시각 검사 프로필/캐시 약 106MB | 운영 배포에는 불필요; `.gitignore` 대상 |
| `.agents/` | 작업 도구용 폴더; 현재 비어 있음 | 운영 배포에는 불필요 |
| `.git/`, `.gitignore` | 버전관리 정보와 제외 규칙 | 서버 공개 폴더에는 보통 제외 |
| `웹사이트 화면구성안ver3_백세인생_ 0513/` | 초기 화면 구성안 슬라이드 12장 | 참고 원본, 운영 배포에는 불필요 |
| `웹사이트 제작관련 의견_ 0717(강)/` | 제작 피드백 이미지 4장 | 참고 원본, 운영 배포에는 불필요 |

`DESIGN_SPEC.md`는 현재 구조보다 이전 상태를 설명합니다. 예를 들어 게시판 파일과 `consistency.css`, `service-catalog.js`가 빠져 있고 이용안내 탭 수와 메인 구성, 실제 최종 색상·글자 규칙도 현재 코드와 다릅니다. 설계 배경 참고용으로 사용하고 현재 파일 목록의 기준 문서로는 이 가이드를 사용하십시오.

## 9. 자주 하는 수정별 체크리스트

### 공통 헤더 메뉴/푸터 수정

1. `js/main.js`의 `HEADER_HTML` 또는 `FOOTER_HTML` 수정
2. 링크를 추가하면 데스크톱 메뉴와 모바일 메뉴를 모두 수정
3. 새 페이지를 추가하면 `<body data-page="새이름">`과 메뉴의 `data-page`를 연결
4. 모든 HTML에서 `main.js` 캐시 버전 `?v=...`을 함께 갱신

### 전화번호·주소·운영시간 수정

한 곳에만 저장되어 있지 않습니다. 다음 전체를 검색해야 합니다.

- `js/main.js`
- `index.html`
- `about.html`
- `service.html`
- `guide.html`
- `case.html`
- `counseling.html`
- `board-detail.html`

표시 번호 `042-719-1350`과 전화 링크 `tel:0427191350` 두 형식을 모두 확인합니다.

### 서비스명이나 순서 수정

1. `js/service-catalog.js`의 `SERVICES` 데이터 수정
2. `service.html`의 8개 상세 섹션 내용과 ID 확인
3. `counseling.html`의 관심 서비스 체크박스 확인
4. 관련 사례나 이용안내 문구도 전체 검색
5. 메인, 센터소개, 서비스 세 페이지 모두 확인

### 서브페이지 대표 이미지 수정

1. `images/png/`에 새 이미지 저장
2. `css/consistency.css`의 `Subpage image heroes` 영역에서 URL 수정
3. 이미지 파일명의 공백은 URL에서 `%20` 처리하거나 공백 없는 이름 사용
4. 데스크톱과 모바일에서 `background-position` 확인

### 사례 내용/이미지 수정

1. `case.html`의 해당 `article#case-0N` 수정
2. 이미지 파일을 `images/png/`에 저장하고 `src`, `alt`, `width`, `height` 수정
3. 캐시 때문에 이전 이미지가 보이면 이미지 URL의 `?v=...` 값을 변경

### 이용요금·등급·FAQ 수정

- 내용: `guide.html`
- 탭/FAQ 동작: `js/guide.js`
- 기본 모양: `css/guide.css`
- 최종 덮어쓰기: `css/consistency.css`

### 게시판 연결 변경

1. `js/board-data.js`의 `BOARD_API_URL` 수정
2. 새 API가 기존 필드명과 응답 구조를 지키는지 확인
3. 목록, 상세, 이전/다음 글, 비공개 글, 이미지 없는 글을 각각 테스트
4. 외부 Apps Script 배포 권한과 CORS 설정 확인

### 상담 접수 연결 변경

1. `js/counseling.js`의 `CONSULT_WEB_APP_URL` 수정
2. 폼 필드를 추가하면 `counseling.html`과 `getPayload()`, `validate()`를 함께 수정
3. Apps Script의 예상 필드도 동일하게 수정
4. 실제 저장 결과를 외부 시트/메일에서 확인

## 10. 캐시 버전 관리

HTML의 CSS·JS 주소 뒤에는 `?v=20260814-r9` 같은 값이 붙어 있습니다. 브라우저 캐시를 갱신하기 위한 문자열이며 실제 파일명은 바뀌지 않습니다.

현재 같은 공통 파일도 페이지마다 버전 문자열이 다릅니다. 예를 들어 `main.js`는 메인에서 `r38`, 다른 페이지에서는 주로 `r32`이고, `consistency.css`도 페이지별 값이 다릅니다. 공통 파일을 수정한 뒤 일부 페이지만 버전을 바꾸면 다른 페이지에서 이전 캐시가 남을 수 있습니다.

권장 방법:

1. 공통 CSS/JS를 수정
2. 프로젝트 전체에서 해당 파일명 검색
3. 연결된 모든 HTML의 `?v=` 값을 동일한 새 값으로 변경
4. 강력 새로고침 후 모든 페이지 확인

## 11. 현재 확인된 주의점

1. **`consistency.css`의 영향이 매우 큼**  
   페이지 전용 CSS보다 나중에 로드되고 재정의가 많아 스타일 수정 위치를 잘못 찾기 쉽습니다.

2. **사업 정보가 여러 파일에 중복됨**  
   전화번호, 주소, 운영시간 변경 시 전체 검색이 필요합니다.

3. **공통 파일 캐시 버전이 페이지마다 다름**  
   수정 후 일부 페이지만 새 화면이 보이는 원인이 될 수 있습니다.

4. **게시판과 상담의 서버 소스가 프로젝트에 없음**  
   이 폴더만 백업하면 게시물 원본, 상담 저장소, Apps Script 코드는 복구할 수 없습니다.

5. **상담의 `secretKey`는 공개됨**  
   브라우저 JavaScript에 들어 있으므로 인증 비밀키로 사용하면 안 됩니다. 서버 측 속도 제한, 입력 검증, 스팸 방어가 별도로 필요합니다.

6. **상담 성공 표시는 실제 저장 성공을 보장하지 않음**  
   `no-cors` 요청 특성상 서버 응답을 확인하지 못합니다.

7. **게시글 본문은 서식 없는 텍스트로 출력됨**  
   HTML 태그를 넣어도 태그로 렌더링되지 않습니다. 줄바꿈 보존 여부는 CSS `white-space` 설정도 함께 확인해야 합니다.

8. **사용하지 않는 대용량 원본이 존재함**  
   이전 영상, 정적 지도, 이전 사례 이미지 등은 웹 실행에는 필요 없지만 보관 목적일 수 있습니다.

9. **초기 설계 문서는 현재 코드와 차이가 있음**  
   `DESIGN_SPEC.md`의 색상, 글자, 페이지 구성, 체크리스트를 현재 코드의 정확한 명세로 간주하지 않는 것이 좋습니다.

## 12. 수정 후 확인 순서

파일을 직접 더블클릭하는 `file://` 방식보다 Live Server 같은 로컬 HTTP 서버로 확인하는 것을 권장합니다. 게시판 API, 상담 접수, 외부 지도처럼 네트워크와 출처 정책의 영향을 받는 기능이 있기 때문입니다.

1. `index.html`에서 헤더, 푸터, 영상, 서비스 카드 확인
2. 6개 서브페이지에서 전체화면 영웅 이미지와 자동 진행 확인
3. 모바일에서 햄버거 메뉴와 오버레이 확인
4. 센터소개 4개 탭과 카카오 지도 확인
5. 서비스 8개 빠른 이동과 URL 해시 확인
6. 이용안내 8개 탭, 직접 링크, FAQ 확인
7. 사례 6개 이미지와 모바일 교차 배치 확인
8. 상담 폼의 필수값 오류, 전화번호 포맷, 실제 외부 저장 확인
9. 게시판 목록, 페이지 이동, 상세, 이전/다음 글, 오류 상태 확인
10. 전화, 카카오, 유튜브, 길찾기 등 외부 링크 확인

운영 서버에 올릴 최소 범위는 8개 일반 HTML, `css/`, `js/`, 실제 사용 중인 `images/`, `videos/home-hero2.mp4`입니다. 문서, 캡처 도구, `.visual-*`, 참고 이미지 폴더, `.git/`은 사이트 실행에 필요하지 않습니다.
