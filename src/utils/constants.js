// src/utils/constants.js

/**
 * 애플리케이션 전체에서 사용하는 상수들
 */

// ===== 유효성 검사 관련 상수 =====
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NICKNAME_MIN_LENGTH: 2,
  NICKNAME_MAX_LENGTH: 20,
  EMAIL_MAX_LENGTH: 254,

  // 파일 업로드 제한
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],

  // 정규식 패턴
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NICKNAME: /^[a-zA-Z0-9가-힣_-]+$/,
    PASSWORD_STRONG:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    PHONE: /^[0-9]{10,11}$/,
    BIRTHDATE: /^\d{4}-\d{2}-\d{2}$/,
  },
};

// ===== 인증 관련 상수 =====
export const AUTH = {
  // 세션 관련
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24시간
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5분 전에 갱신

  // OAuth 제공자
  OAUTH_PROVIDERS: ["google", "kakao"],

  // 리다이렉트 URL
  REDIRECT_URLS: {
    LOGIN_SUCCESS: "/",
    LOGOUT_SUCCESS: "/",
    SIGNUP_SUCCESS: "/login",
    EMAIL_CONFIRMATION: "/auth/confirm",
    PASSWORD_RESET: "/auth/reset-password",
  },

  // 권한 레벨
  USER_ROLES: {
    USER: "user",
    ADMIN: "admin",
    MODERATOR: "moderator",
  },
};

// ===== API 관련 상수 =====
export const API = {
  // 타임아웃 설정
  TIMEOUT: {
    DEFAULT: 10000, // 10초
    UPLOAD: 30000, // 30초
    AUTH: 15000, // 15초
  },

  // 재시도 설정
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1초
    MULTIPLIER: 2,
  },

  // 에러 코드
  ERROR_CODES: {
    NETWORK_ERROR: "NETWORK_ERROR",
    TIMEOUT: "TIMEOUT",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    SERVER_ERROR: "SERVER_ERROR",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  },
};

// ===== UI 관련 상수 =====
export const UI = {
  // 브레이크포인트
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE_DESKTOP: 1440,
  },

  // 애니메이션 지속시간
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Z-인덱스
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    TOOLTIP: 1100,
    NOTIFICATION: 1200,
  },

  // 색상 테마
  COLORS: {
    PRIMARY: "#3b82f6",
    SECONDARY: "#6b7280",
    SUCCESS: "#10b981",
    WARNING: "#f59e0b",
    ERROR: "#ef4444",
    INFO: "#06b6d4",
  },

  // 컴포넌트 크기
  SIZES: {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
  },
};

// ===== 스토리지 키 =====
export const STORAGE_KEYS = {
  // localStorage
  USER_PREFERENCES: "dream_in_user_preferences",
  THEME: "dream_in_theme",
  LANGUAGE: "dream_in_language",
  REMEMBER_LOGIN: "dream_in_remember_login",

  // sessionStorage
  TEMP_DATA: "dream_in_temp_data",
  FORM_DRAFT: "dream_in_form_draft",
  NAVIGATION_STATE: "dream_in_navigation_state",
};

// ===== 메시지 및 텍스트 =====
export const MESSAGES = {
  // 성공 메시지
  SUCCESS: {
    LOGIN: "로그인에 성공했습니다.",
    LOGOUT: "로그아웃되었습니다.",
    SIGNUP: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
    PROFILE_UPDATE: "프로필이 업데이트되었습니다.",
    PASSWORD_CHANGE: "비밀번호가 변경되었습니다.",
    EMAIL_SENT: "이메일이 발송되었습니다.",
    FILE_UPLOAD: "파일이 업로드되었습니다.",
  },

  // 에러 메시지
  ERROR: {
    NETWORK: "네트워크 연결을 확인해주세요.",
    SERVER: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    TIMEOUT: "요청 시간이 초과되었습니다.",
    UNAUTHORIZED: "인증이 필요합니다.",
    FORBIDDEN: "권한이 없습니다.",
    NOT_FOUND: "요청한 페이지를 찾을 수 없습니다.",
    VALIDATION: "입력 정보를 확인해주세요.",
    FILE_TOO_LARGE: "파일 크기가 너무 큽니다.",
    INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
    GENERIC: "오류가 발생했습니다. 다시 시도해주세요.",
  },

  // 확인 메시지
  CONFIRM: {
    DELETE: "정말 삭제하시겠습니까?",
    LOGOUT: "로그아웃하시겠습니까?",
    CANCEL: "작업을 취소하시겠습니까?",
    LEAVE_PAGE: "변경사항이 저장되지 않습니다. 페이지를 떠나시겠습니까?",
  },

  // 로딩 메시지
  LOADING: {
    DEFAULT: "로딩 중...",
    LOGIN: "로그인 중...",
    SIGNUP: "회원가입 중...",
    UPLOAD: "업로드 중...",
    SAVE: "저장 중...",
    DELETE: "삭제 중...",
  },
};

// ===== 라우트 경로 =====
export const ROUTES = {
  // 인증 관련
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  LOGOUT: "/logout",

  // 프로필 관련
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PASSWORD_CHANGE: "/password/change",

  // 인증 콜백
  AUTH_CALLBACK: "/auth/callback",
  EMAIL_CONFIRM: "/auth/confirm",
  PASSWORD_RESET: "/auth/reset-password",

  // 기타
  SUPPORT: "/support",
  ACCOUNT_DELETE: "/account/delete",
  PRIVACY: "/privacy",
  TERMS: "/terms",
};

// ===== 날짜 및 시간 관련 =====
export const DATE_TIME = {
  // 포맷
  FORMATS: {
    DATE: "YYYY-MM-DD",
    TIME: "HH:mm:ss",
    DATETIME: "YYYY-MM-DD HH:mm:ss",
    DISPLAY_DATE: "YYYY년 MM월 DD일",
    DISPLAY_DATETIME: "YYYY년 MM월 DD일 HH시 mm분",
  },

  // 로케일
  LOCALE: "ko-KR",

  // 타임존
  TIMEZONE: "Asia/Seoul",
};

// ===== 환경 변수 관련 =====
export const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

// ===== 기능 플래그 =====
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: false,
  ANALYTICS: process.env.NODE_ENV === "production",
  DEBUG_MODE: process.env.NODE_ENV === "development",

  // 소셜 로그인
  GOOGLE_LOGIN: true,
  KAKAO_LOGIN: true,
  APPLE_LOGIN: false,

  // 보안 기능
  TWO_FACTOR_AUTH: false,
  BIOMETRIC_AUTH: false,

  // 파일 업로드
  IMAGE_RESIZE: true,
  IMAGE_COMPRESSION: true,
  DRAG_DROP_UPLOAD: true,
};

// ===== 성능 관련 =====
export const PERFORMANCE = {
  // 디바운싱/스로틀링 지연시간
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,

  // 페이지네이션
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // 이미지 최적화
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_WIDTH: 1920,
  MAX_IMAGE_HEIGHT: 1080,

  // 캐시 설정
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000, // 5분
    MEDIUM: 30 * 60 * 1000, // 30분
    LONG: 24 * 60 * 60 * 1000, // 24시간
  },
};

// ===== 정규 표현식 컬렉션 =====
export const REGEX = {
  // 기본 패턴
  EMAIL: VALIDATION.PATTERNS.EMAIL,
  NICKNAME: VALIDATION.PATTERNS.NICKNAME,
  PASSWORD_STRONG: VALIDATION.PATTERNS.PASSWORD_STRONG,
  PHONE: VALIDATION.PATTERNS.PHONE,
  BIRTHDATE: VALIDATION.PATTERNS.BIRTHDATE,

  // 추가 패턴
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

  // 한국어 관련
  KOREAN_ONLY: /^[가-힣\s]+$/,
  KOREAN_WITH_ENGLISH: /^[가-힣a-zA-Z\s]+$/,

  // 특수 문자
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9가-힣\s]+$/,
  ONLY_NUMBERS: /^\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
};

// ===== 기본 설정 내보내기 =====
export const DEFAULT_CONFIG = {
  // 언어 설정
  DEFAULT_LANGUAGE: "ko",
  SUPPORTED_LANGUAGES: ["ko", "en"],

  // 테마 설정
  DEFAULT_THEME: "light",
  SUPPORTED_THEMES: ["light", "dark", "auto"],

  // 알림 설정
  DEFAULT_NOTIFICATIONS: {
    email: true,
    push: false,
    sms: false,
  },

  // 개인정보 설정
  DEFAULT_PRIVACY: {
    profilePublic: false,
    showEmail: false,
    allowMessages: true,
  },
};

// ===== 메타데이터 =====
export const META = {
  APP_NAME: "Dream-in",
  APP_VERSION: "1.0.0",
  APP_DESCRIPTION: "꿈을 기록하고 나를 이해하는 여정",

  // SEO
  DEFAULT_TITLE: "Dream-in - 꿈 기록 서비스",
  DEFAULT_DESCRIPTION:
    "당신의 꿈을 기록하고 분석하여 자신을 더 깊이 이해할 수 있는 서비스입니다.",
  DEFAULT_KEYWORDS: "꿈, 꿈일기, 꿈분석, 자기이해, 일기",

  // 소셜 미디어
  OG_IMAGE: "/images/og-image.png",
  TWITTER_HANDLE: "@dreamin_app",
};
