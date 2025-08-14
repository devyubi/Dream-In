# 프로젝트

## 1. 개요

- Dream-in 은 꿈이라는 비정형 데이터를 기록하고, 무의식의 흐름을 시각화하여 자기 이해와 타인과의 공감을 돕는 개인 맞춤형 인사이트 플랫폼임.

## 2. 설명

- 이 서비스는 사용자가 지난 밤의 꿈을 기록하고, AI 해몽을 받아볼 수 있도록 돕습니다.
  아침 햇살에 사라지는 꿈을 붙잡아 기록하는 순간, 그것은 ‘나’를 이해하는 열쇠가 됩니다.
  또한, 꿈이 없는 날에는 감정일기를 작성해 하루의 기분을 돌아볼 수 있으며, 수면 패턴 분석을 통해 꿈·감정·수면 리듬의 연결 고리를 발견할 수 있습니다.
  우리는 이 서비스를 통해 사용자가 무의식과 감정을 시각적으로 기록·연결하며, 자신과 타인을 이해하는 새로운 경험을 하길 기대합니다.

## 3. 슬로건

- 어젯밤 당신의 꿈, 오늘의 당신에게 말을 겁니다

## 4. 목표

1. 꿈과 감정을 꾸준히 기록할 수 있는 개인 맞춤형 도구 제공
2. AI 해몽을 통해 자기 이해와 인사이트 제공
3. 감정일기와 수면 기록을 통해 자기 상태를 돌아보고 분석
4. 기록 루틴을 습관화하고, 꾸준한 자기 성찰 경험 지원
5. 개인 데이터 시각화를 통한 자기 인사이트 제공

## 5. 주요 기능

1. AI 꿈 해몽
2. 꿈 작성 시 감정 태깅
3. 꿈 카테고리 분류
4. 즐겨찾기 기능
5. 감정일기 및 캘린더 기능 제공
6. 수면 기록 & 패턴 그래프 분석
7. 소셜 로그인 기능 제공
8. 데이터베이스 연동을 통한 정보 저장

## 6. Team

| 이름   | 담당 파트 (주요 담당)                                        | 세부 기능                                                                                                                                      | 협업 / 보조                                                                          |
| ------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 박재현 | 꿈, 감정일기 관련 페이지 구현 및 연동, AI API 연동           | 꿈 기록 UI 구성, 감정 선택 기능, AI API 해몽 기능 연동 및 결과 출력, 프로젝트 기본 폴더 구성, 카테고리 분류 및 각 리스트 페이지 연동(즐겨찾기) | 공통 컴포넌트 작업, Footer 및 고객센터 페이지 구성                                   |
| 문유비 | 전체 기능, 디자인 및 흐름 기획 및 메인페이지 구현            | 전체 기능 흐름 및 기획 (PRD, 아키텍쳐 설계, 플로우차트 작성), 메인페이지 구현 및 세부 페이지와 연동                                            | 상태 관리 구조 협의, 전역 디자인 작업, 감정일기 작성 페이지 및 수면 관련 페이지 구현 |
| 송병근 | 로그인, 회원가입 등 회원 관리 기능 구현 및 데이터베이스 연동 | 일반 로그인/소셜로그인(카카오, 구글) 구현, 회원 관리 메뉴 데이터베이스 연동                                                                    | 로그인 및 회원 관련 메뉴 구현                                                        |

## 7. 프로젝트 일정

| 날짜 (기간) | 단계                             | 작업 내용                                                                                           |
| ----------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| 7/15        | 프로젝트 최초 회의               | 아이디어 공유, 역할 분담                                                                            |
| 7/16~7/24   | 기획, 디자인, 프로젝트 초기 설정 | GitHub 세팅 및 와이어 프레임 제작(Figma), 기능 정의, 메인 UI 컴포넌트, 톤앤매너 결정, 프로젝트 생성 |
| 7/25~8/6    | 개발 1차                         | 코딩 작업 진행 및 완료                                                                              |
| 8/7~8/7     | 개발 2차                         | 코딩 마무리 작업 및 최종 완료                                                                       |
| 8/8~8/11    | 디버깅 & 최적화 & 발표 자료 준비 |
| 8/12~8/13   | 최종 마무리 및 확인              | 모의 발표 진행                                                                                      |
| 8/14        | 발표 및 감상, 팀회고 등          |

## 8. **★ 프로젝트 진행 방향**

### **★ 미니 프로젝트 병렬 진행 후 통합**

**설명**: 전체 기능을 미리 작은 단위의 미니 프로젝트로 쪼개고, 각자 1개씩 맡아 개발 → 이후 통합

역할 분담 예시

---

박재현 : 꿈, 감정일기 관련 페이지 구현 및 연동, AI API 연동

---

문유비 : 디자인 및 전체 흐름 기획 및 헤더, 메인 홈페이지, EmotionWritePage, 수면기록페이지 구현

---

송병근 : 로그인, 회원가입 등 회원 관리 기능 구현 및 데이터베이스 연동

---

**장점**:

- 각자 독립적인 구조로 개발 가능 → 빠른 작업 가능
- Git merge 시 충돌이 적음

**단점**:

- 초기에 통합 방식(디자인, 라우터, 폴더 구조)을 반드시 잘 정해야 함
- 통합 시 중복 제거 및 리팩토링 필요

### **2주차: 통합 및 공통 컴포넌트 정리**

- 공통 UI 컴포넌트 통일 (버튼, 모달, 카드 등)
- 라우터 연결 및 페이지 구조 통합
- 상태 관리 전환 (ex. Context API or Zustand 등)
- 반응형 레이아웃 적용 시작

### **3주차: 테스트 + 최적화 + 피드백 반영**

- UX 개선
- 기능 보완 (ex. 수정, 삭제, 필터 등)
- 디자인 보완 및 애니메이션 추가
- Lighthouse / Web Vitals 테스트
- 발표 자료 준비 (시연 영상, 소개 문서 등)

## 9. 카테고리 분류 로직

| 이름   | 주요 담당                                                                       | 작업 파일                                                                                                                                                                           | 설명                                                                                                                           |
| ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 박재현 | 꿈/감정일기(EmotionWrite 제외)/즐겨찾기 목록, AI 연동 등                        | DreamWritePage.jsx, DreamDetail.jsx, DreamEdit.jsx, EmotionList.jsx, EmotionDetail.jsx, EmotionEdit.jsx, DreamList.jsx, FavoriteList.jsx, 공용 컴포넌트 등                          | 꿈/감정일기 관련 페이지(EmotionWrite 제외), AI API 연동 및 출력, 즐겨찾기 목록 로컬스토리지 연동 등                            |
| 문유비 | 디자인 및 전체 흐름 기획, 헤더, 메인 페이지, 감정일기 작성란 및 수면기록 페이지 | 전체 흐름 기획 관리, `Header.jsx`, `ThemeContext.jsx`,`HomePage.jsx`, `QuoteSwiper.jsx`, `EmotionWritePage.jsx`, `SleepRecordPage.jsx`, `FavoriteSection.jsx`, `TwinkleStars.jsx`등 | 꿈 리스트 출력, 정렬, 피드 구성<br>나의 통계, 테마 전환 (다크/라이트), 백그라운드 테마 적용,<br>스와이퍼, 별 반짝임 애니메이션 |
| 송병근 | 회원기능 + supabase 연동                                                        | `LoginPage.jsx`, `SignupPage.jsx`, `AuthCallbackPage.jsx`, `AuthContext.jsx`, `useAuth.js`, `supabaseClient.js` 등                                                                  | 회원 인증 처리, supabase 연결                                                                                                  |

## 10. 담당

### 박재현 (꿈, 감정일기 관련 페이지 구현 및 AI 연동)

> 주요 담당: 꿈, 감정일기(EmotionWrite 제외) 관련 페이지 구현 및 AI 연동
>
> 세부 기능: 꿈/감정일기 구현(EmotionWrite 제외), AI API 연동 및 출력, 즐겨찾기 로컬 스토리지 연동 등

#### 1. `DreamWritePage.jsx`

- 꿈 작성 페이지
- `useState`로 제목, 내용, 감정 선택 상태 관리
- 입력할 때마다 상태 값 실시간 업데이트 및 글자 수 체크
- 게시하기 클릭 시 제목, 내용, 감정이 비어 있으면 각각 에러 메시지 표시(`if문`)
- 정상 입력 시 `useNavigate`로 작성 데이터를 `state`에 담아 `DreamDetail`로 전달
- `DreamWritePage.styles`로 제목, 감정 선택 영역, 내용 입력, 게시 버튼 UI 구성

#### 2. `DreamDetail.jsx`

- 꿈 상세보기 페이지
- `useLocation`으로 이전 페이지에서 전달된 꿈 데이터를 받음
- `fetch()`와 `useState`로 `OpenAI API`에 꿈 내용을 요청하고 결과 출력
- AI 해몽 요청 시 로딩 스피너 표시 및 스크롤 이동(`useRef`, `useEffect`)
- 수정 및 삭제 시 `useNavigate`와 `state`를 이용하여 데이터 전달 및 목록 제거 처리
- `window.confirm`으로 삭제 확인, `alert`으로 완료 안내

#### 3. `DreamList.jsx`

- 꿈 목록 페이지
- `useState`와 `Array.filter`를 사용해 카테고리별 필터링
- `map` 반복문으로 카테고리 필터 버튼 및 목록 아이템 구성
- 각 아이템 클릭 시 `useNavigate`와 `state`로 상세 페이지로 이동 및 데이터 전달
- 삭제 후 목록 이동 시 삭제된 `id`를 `state`로 전달
- `useFavorites Context`로 즐겨찾기 토글 기능 구현(로컬스토리지)
- `Pagination.jsx`와 `useState`를 활용해 페이지별 표시 아이템 계산, 초과 시 다음 페이지에 출력

#### 4. `DreamEdit.jsx`

- 꿈 수정 페이지
- `useLocation`으로 이전 페이지 데이터 받아 수정할 제목과 내용 초기값 설정
- `useState`와 `value/onChange`로 입력한 값 실시간 반영
- 수정 완료 시 `useNavigate`와 `state`로 상세 페이지 이동 및 데이터 전달, `replace: true`로 기록 갱신
- `window.confirm`으로 수정 확인, `alert`으로 완료 안내

#### 5. `EmotionDetail.jsx`

- 감정일기 상세보기 페이지
- `useLocation`으로 이전 페이지에서 전달된 감정일기 데이터 받음
- `fetch()`와 `useState`로 `OpenAI API`에 요청 후 결과 출력
- 감정분석 요청 시 `로딩 스피너` 표시 및 `스크롤 이동`(`useRef`, `useEffect`)
- 수정 및 삭제 시 `useNavigate`와 `state`를 사용해 이동 및 데이터 전달, 목록 제거 처리

#### 6. `EmotionList.jsx`

EmotionList.jsx

- 감정일기 목록 페이지
- `map` 반복문을 이용해 목록 아이템과 즐겨찾기/삭제 버튼 구성
- `useNavigate`, `useLocation`을 이용해 상세 페이지 이동 및 이전 페이지 데이터 전달
- 삭제 후 목록 페이지로 이동 시 삭제된 `id`를 `state`로 전달
- `useFavorites Context로 즐겨찾기 토글 기능 구현 (로컬스토리지)
- `Pagination.jsx`와 `useState`를 이용해 페이지별 표시 아이템 계산, 페이지 전환 시 초과 아이템 다음 페이지로 표시

#### 7. `EmotionEdit.jsx`

- 감정일기 수정 페이지
- `useState`를 이용한 입력 폼(제목, 내용) 상태 관리
- `useLocation`으로 이전 페이지에서 전달된 감정일기 데이터를 받아 초기값 설정
- `useNavigate`로 수정 완료 후 상세 페이지로 이동 및 수정된 데이터 전달
- `window.confirm`으로 수정 확인, `alert`로 수정 완료 안내
- `Detail.styles`의 스타일 컴포넌트를 활용하여 입력폼 및 버튼 UI 구성

#### 8. `FavoriteList.jsx`

- 즐겨찾기 목록 페이지
- `useFavorites Context`를 활용해 꿈 이야기와 감정일기 즐겨찾기 데이터를 합쳐서 출력, 즐겨찾기 상태는 `로컬 스토리지`에 저장되어 페이지를 새로고침해도 유지됨
- 카테고리 버튼(전체, 꿈 이야기, 감정일기)을 `map` 반복문으로 생성하고, 선택 시 `useState`로 필터링
- 즐겨찾기 해제 시 `window.confirm`으로 확인 후 `toggleFavorite` 실행, 완료 시 `alert` 표시
- 각 아이템 클릭 시 `useNavigate`와 `state`를 이용해 해당 상세 페이지(DreamDetail 또는 EmotionDetail)로 이동
- `Pagination.jsx`와 `useState`를 이용해 페이지별 표시 아이템 계산, 페이지 전환 시 초과 아이템 다음 페이지로 표시
- 항목이 없을 경우 안내 문구 출력
- `useEffect`로 필터 변경이나 항목 수 변화 시 페이지 번호 조정

#### 9. `Support.jsx`

- 고객센터 페이지
- `BackButton` 컴포넌트를 불러와 `/profile`로 돌아가기
- `MadeIn` 컴포넌트를 불러와 서비스/팀원 관련 정보 표시

#### 10. `Footer.jsx`

- 사이트 하단(`Footer`) 영역 컴포넌트
- 로고와 서비스 이름(Dream-In), 서비스 소개 문구 표시
- Instagram, X, Facebook, YouTube 소셜 미디어 링크 제공
- 고객센터 이메일, 전화번호, 주소 정보 표시
- 개인정보처리방침, 서비스 이용약관 클릭 시 각 페이지로 이동 (`useNavigate` 활용)
- 회사 정보(상호, 사업자등록번호, 대표자)와 저작권 문구 출력
- 사이트 전역에서 공통적으로 사용되며, 고객센터 정보 제공과 외부 링크 연결 기능 담당

#### 11. `공용 컴포넌트 제작`

- `BackButton.jsx`
  - 뒤로가기 버튼 컴포넌트
  - 다크 모드/라이트 모드 대응
  - to prop으로 이동 경로 지정, onClick 이벤트 가능
  - 이미지 아이콘 변경 및 hover 스타일 적용
- `Container.jsx`
  - 페이지 내부 공용 컨테이너
  - 다크 모드에 따라 배경색과 글자색 자동 변경
- `MadeIn.jsx`
  - 팀원 소개 카드 컴포넌트
  - 이름, 역할, 이메일, 한 줄 소개 출력
- `Pagination.jsx`
  - 페이지네이션 버튼 제공
  - `totalPages`, `currentPage`, `onPageChange` `prop` 사용
  - 페이지 수 1 이하이면 렌더링 안 함
- `PostButton.jsx`
  - 글 작성/링크 이동용 버튼
  - `to prop` 존재 시 `Link`처럼 동작, 없으면 일반 버튼
- `QuantumSpinner.jsx`
  - 로딩 스피너 컴포넌트
  - `ldrs/react 라이브러리` 사용
  - 색상, 크기, 속도 조절 가능
- `ScrollToTop.jsx`
  - 페이지 이동 시 자동으로 상단으로 스크롤
  - `useLocation` 이용해 `pathname` 변경 시 실행
- `ScrollUpButton.jsx`
  - 사용자가 직접 스크롤 맨 위로 이동 가능 버튼
  - 화면 고정 위치
- `TextArea.jsx`
  - 기록 텍스트 입력 영역
  - 최대 글자수 표시 및 초과 시 경고
  - 커스텀 스크롤바 적용
  - 에러 메시지 표시 가능
- `Title.jsx`
  - 페이지 타이틀과 서브타이틀 컴포넌트
  - 폰트, 색상, 크기 등 수정 용이

#### 12. `기타`

- 다크 모드 / 라이트 모드 대응
  - 모든 컴포넌트에서 `useThemeContext`를 사용하여 `isDarkMode` 확인
  - 배경색, 글자색, 버튼/hover 스타일, 이미지 아이콘 등 테마별 변경 적용
- 스타일링 일관성
  - `@emotion/styled`로 컴포넌트별 스타일 정의
  - `Container`는 중앙 정렬, 최대/최소 너비 설정으로 페이지 레이아웃 안정화
  - `Detail.styles.js`, `DreamWritePage.styles.js`, `List.styles.js` 분리하여 같은 스타일링 사용하는 페이지에 적용
- 재사용성 고려
  - 버튼, 텍스트 영역, 타이틀 등 컴포넌트를 props 기반으로 재사용 가능하게 설계
  - `PostButton`: `to` 유무에 따라 `Link` 혹은 `일반 버튼` 동작
  - `Pagination`: 페이지 수, 현재 페이지, `onPageChange prop`으로 동적 렌더링
  - `Detail.styles.js`, `DreamWritePage.styles.js`, `List.styles.js` 분리하여 같은 스타일링 사용하는 페이지에 적용
- 상태 표시 및 피드백
  - 기록 시 제목 및 내용 작성란에서 글자수 카운트 및 최대치 경고 표시

---

### 문유비 (메인 기능, 디자인 및 전체 흐름 기획, 헤더, 메인 홈페이지, 감정일기 작성란(EmotionWritePage), 수면기록페이지 구현)

> 주요 담당: 디자인 및 전체 흐름 기획, 헤더, 메인 페이지, 감정일기 작성란 및 수면기록 페이지
>
> 세부 기능: 나의 통계, 테마 전환 (다크/라이트), 백그라운드 테마 적용, 스와이퍼, 별 반짝임 애니메이션

#### 1. 전체 흐름 기획 관리

- readdy 및 피그마를 이용한 UI/UX 디자인 도출
- 페이지 전환 동선 설계 및 화면 흐름 관리
- 다른 팀원 요청 시 화면 구조 및 동선 설명 담당
- 폴더 구조 및 아이콘 이름 정의

#### 2. `Header.jsx` - 헤더

- 상단 로고, 다크모드 전환, 로그인/로그아웃 버튼 구현
- 다크모드 클릭 시 ThemeContext 전역 상태 변경, <body>에 data-theme 적용
- 로그인 상태에 따라 버튼 아이콘/텍스트 변경 및 페이지 이동 처리

#### 3. `ThemeContext.jsx` - 테마

- 전역 테마 상태 관리: isDarkMode와 setIsDarkMode 제공
- ThemeProvider 사용 시 모든 자식 컴포넌트에서 테마 접근 가능
- 다크모드 적용 시 <body> 속성 변경으로 CSS 테마 적용

#### 4. `HomePage.jsx` - 메인 홈페이지

- 사용자별 피드 구성 (최근 작성한 꿈 리스트, 즐겨찾기 등)
- 나의 통계, 기록하기 섹션, 명언 표시
- 로그인 상태에 따라 접근 권한 및 UI 변화 처리
- TwinkleStars 배경 적용 (별 반짝임 효과)

#### 5. `StatsSection.jsx` - 나의 통계

- 총 꿈 기록, 총 감정 기록, 평균 수면 시간 통계 카드 표시
- 다크모드 대응 아이콘 사용
- 로그인 상태에 따라 UI 흐림 처리 및 접근 제한
- 각 카드 클릭 시 해당 페이지로 이동

#### 6. `RecordSection.jsx` - 기록하기

- 홈 화면에서 빠른 기록 기능 제공: 꿈 기록, 감정 일기, 수면 기록
- 로그인 상태에 따라 접근 권한 제어 (비로그인 시 /login 이동)
- 전체 카드 클릭 가능 영역
- 쿼리 파라미터 방식을 적용해 URL에 ?tab=값을 추가하여 초기 탭 상태를 지정
  예: /sleeprecord?tab=stats → 통계 화면부터 표시
  useSearchParams()를 사용하여 tab 값을 읽고 activeTab 초기값으로 설정

#### 7. `QuoteSwiper.jsx` - 스와이퍼

- Swiper 라이브러리를 사용하여 설정한 시간마다 (설정값:4초) 자동 전환
- 무한 반복(loop) 으로 끝없이 순환되게끔 설정
- 하단 페이지네이션 버튼 클릭 시 해당 명언으로 즉시 이동 가능
- 사용자가 슬라이드를 조작해도 자동 재생 유지 (disableOnInteraction: false)

#### 8. `EmotionWritePage.jsx` - 감정일기 작성페이지

- react-calendar 기반 날짜 선택 후 감정일기 작성 가능
- 로컬 모킹데이터 + 로컬스토리지 저장 기능 구현
- 기존 일기 불러오기 및 수정 기능
- 입력값 검증 후 저장, 작성 완료 시 목록 페이지(/emotionlist)로 이동
- 최대 글자수 1000자, 날짜별 일기 표시, 📌 표시로 작성 여부 표시

#### 9. `SleepRecordPage.jsx` - 수면기록 작성 및 통계 히스토리 페이지 (2단 구현)

- 수면 기록 및 수면 질 평가 페이지 구현
- Framer Motion 라이브러리 사용
- 상단 탭(SleepTabBar)로 수면 기록 / 수면 통계 전환
- 탭 전환 시 Framer Motion을 이용한 부드러운 슬라이드 & 페이드 애니메이션 효과 적용(AnimatePresence, motion.div)
- 기록 탭에서는 `취침/기상 시간` 입력 / 수면 질 평점(별점) 입력 / 저장 시 자동으로 통계 탭으로 전환
- 수면 시작/종료 시간 입력, 수면 질 평점 입력 기능
- useCallback으로 탭 전환 최적화

#### 10. `FavoriteSection.jsx` - 즐겨찾기 꿈 컴포넌트

- 즐겨찾기 꿈 리스트 표시, 최근 작성순 정렬
- 로그인 상태에 따라 접근 제한 및 흐림 처리
- 즐겨찾기 토글 기능 구현, 클릭 시 /favorites 페이지 이동
- 로그인 시 사용자 프로필 정보 및 마이페이지/즐겨찾기 링크 표시

#### 11. Nivo Chart 라이브러리 사용

- Nivo Chart 라이브러리를 이용한 Pie Chart 구현
- 모킹데이터 사용 / Nivo 라이브러리의 ResponsivePie 컴포넌트를 사용하여 7일 이내 수면 질 데이터를 시각화함
- useMemo로 필터링된 데이터(chartData)를 ResponsivePie에 전달해 성능 최적화
- 색상 매핑과 범례를 커스터마이징하여 수면 질 평점(별점)과 연계

#### 12. TwinkleStars.jsx

- Emotion keyframes 기반 별 반짝임 애니메이션 구현
- 랜덤 위치, 크기, 속도, 애니메이션 딜레이 적용
- pointer-events: none으로 UI 클릭 방해 방지
- 다크모드와 연동하여 밤하늘 테마 구현 가능

---

### 송병근 (회원 기능 (Auth & User Management))

> 주요 담당: 회원 인증, 사용자 정보 관리, 프로필 기능, 계정 관리, Supabase 연동
>
> 세부 기능: 로그인·회원가입 처리, 꿈/감정 데이터 저장 및 불러오기, 꿈 카테고리 분류 로직 구현

---

#### 1. 인증 (Authentication)

**관련 파일:**  
`LoginPage.jsx`, `SignupPage.jsx`, `AuthCallbackPage.jsx`, `AuthContext.jsx`, `useAuth.js`, `supabaseClient.js`

**주요 기능:**

- **이메일/비밀번호 로그인·회원가입**
  - Supabase Auth API 사용
  - 회원가입 시 `profiles` 테이블에 추가 정보 저장 (닉네임, 생년월일 등)
- **OAuth 콜백 처리** (`AuthCallbackPage.jsx`)
  - 소셜 로그인 이후 토큰 처리 및 세션 유지
- **로그인 상태 관리** (`AuthContext.jsx`, `useAuth.js`)
  - Context API + LocalStorage 기반 자동 로그인
  - UID 기반 프로필 데이터 로드
- **Supabase 인스턴스 초기화** (`supabaseClient.js`)
  - URL, Public Key 환경 변수 관리

---

#### 2. 계정 복구 (Account Recovery)

**관련 파일:**  
`FindEmailPage.jsx`, `FindPasswordPage.jsx`

**주요 기능:**

- **이메일 찾기**
  - 닉네임 + 생년월일로 `profiles` 검색 후 이메일 반환
- **비밀번호 재설정**
  - 이메일·닉네임·생년월일로 사용자 검증 후 임시 비밀번호 발급
  - Supabase Auth API로 비밀번호 변경 처리

---

#### 3. 프로필 관리 (Profile Management)

**관련 파일:**  
`Profile.jsx`, `ProfileImage.jsx`, `UserMenu.jsx`, `PasswordChangeModal.jsx`, `DeleteAccountModal.jsx`

**주요 기능:**

- **프로필 페이지 (`Profile.jsx`)**
  - 사용자 정보 조회 및 수정
- **프로필 이미지 관리 (`ProfileImage.jsx`)**
  - 이미지 업로드/미리보기/오류 처리
- **유저 메뉴 (`UserMenu.jsx`)**
  - 프로필, 로그아웃, 계정 설정 접근
- **비밀번호 변경 (`PasswordChangeModal.jsx`)**
  - 기존 비밀번호 검증 후 새 비밀번호 저장
- **회원 탈퇴 (`DeleteAccountModal.jsx`)**
  - 계정 및 `profiles` 데이터 삭제 처리
  - `boolean` 값으로 탈퇴한 유저 확인

---

#### 4. 데이터 흐름도

```text
[Login / Signup]
↓ (Auth API)
[Supabase Auth]
↓ (UID)
[Profiles Table]
↓
[AuthContext State]
↓
[Profile / User Menu / Recovery / Account Settings]
```

## 11. React(JSX) 기준 폴더 구조 (MVP 버전 -> 실제 구성으로 수정)

```
📁 src // 앱의 메인 소스 폴더 (전체 React 코드 들어감)
├── 📁 pages // 라우팅 되는 각 "페이지" 컴포넌트 (URL에 따라 보여지는 화면)
│ ├── AuthCallbackPage.jsx 소셜 로그인 (구글, 카카오) 이후 콜백 시 웨이팅 페이지
│ ├── DreamEdit.jsx // 꿈 이야기 수정페이지
│ ├── DreamList.jsx // 꿈 이야기 게시판
│ ├── DreamWritePage.jsx // 꿈 작성 페이지
│ ├── EmotionDetail.jsx // 감정일기 상세보기
│ ├── EmotionEdit.jsx // 감정일기 수정 페이지
│ ├── EmotionList.jsx // 감정일기 게시판
│ ├── EmotionWritePage.jsx // 감정일기 작성 페이지
│ ├── FavoriteList.jsx // 즐겨찾기 게시판
│ ├── FindEmailPage.jsx // 이메일(아이디) 찾는 페이지
│ ├── FindPasswordPage.jsx // 비번 찾는 페이지
│ ├── HomePage.jsx // 메인홈페이지
│ ├── LoginPage.jsx // 로그인페이지
│ ├── PrivacyPolicy.jsx // 개인정보 처리방침
│ ├── ProfileEditPage.jsx // 프로필 설정 페이지
│ ├── SignupPage.jsx // 회원가입 페이지
│ ├── SleepRecordPage.jsx // 수면기록 페이지
│ ├── Support.jsx // 고객센터 페이지
│ └── TermsOfServics.jsx // 서비스 이용 약관
│
├── 📁 components // 재사용 가능한 컴포넌트 모음 (여러 곳에서 쓰임)
│ ├── Header.jsx // 상단 헤더 (로고, 유저정보 등)
│ ├── BackButton.jsx // 뒤로가기 버튼 UI
│ ├── Container.jsx // 페이지 내부 레이아웃 UI
│ ├── Footer.jsx // 하단 풋터 (회사정보, 연락처, 개인정보처리방침 등)
│ ├── LoadingSpinner.jsx // 로딩 스피너 UI
│ ├── Pagination.jsx // 페이지 출력 아이템 개수 설정 및 페이지 구분 UI
│ ├── PostButton.jsx // 게시하기 버튼 UI
│ ├── QuantumSpinner.jsx // 로딩 스피너 라이브러리 UI
│ ├── ScrollToTop.jsx // 페이지 이동 시 화면 상단으로 이동
│ ├── ScrollUpButton.jsx // 사용자가 버튼 클릭 시 화면 상단으로 이동
│ ├── TextArea.jsx // 꿈, 감정일기 등 내용 기록 UI
│ ├── TwinkleStars.jsx // 페이지 전체 반짝이는 별 UI
│ └── Title.jsx // 제목, 부제목 UI
│
├── 📁 contexts // 전역 상태 관리 (Context API 사용)
│ ├── AuthContext.jsx // 로그인 상태, 유저 정보 저장
│ ├── FavoriteContext.jsx // 즐겨찾기 상태 관리 (로컬스토리지 관리)
│ ├── SleepContext.jsx // 수면기록 관련 상태 관리
│ └── ThemeContext.jsx // 라이트모드, 다크모드 관리
│
├── 📁 hooks // customHook 폴더 (반복되는 로직을 한 곳에 모아 재사용)
│ ├── useAuth.js // 로그인/회원가입 관련 훅
│ ├── useForm.js //
│ ├── useImageUpload.js //
│ ├── usePasswordChange.js // 비밀번호 변경 관련 훅
│ └── useProfileImageUpload.js //
│
├── 📁 api // 외부 API 호출 함수들 (Supabase, OpenAI 등)
│ ├── supabaseClient.js // Supabase 초기 설정 (client 생성)
│ ├── auth.js // 로그인/회원가입 API 함수들
│
├── App.jsx // 전체 앱 라우터 구조 설정 (페이지 연결)
└── main.jsx // 앱 시작점. <App />을 root에 렌더링
```
