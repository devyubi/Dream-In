// src/utils/errorHandler.js

/**
 * 인증 관련 에러 메시지 상수
 */
export const AUTH_ERRORS = {
  // 로그인 에러
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",
  EMAIL_NOT_CONFIRMED:
    "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.",
  TOO_MANY_REQUESTS: "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  ACCOUNT_LOCKED: "계정이 일시적으로 잠겼습니다. 잠시 후 다시 시도해주세요.",

  // 회원가입 에러
  USER_ALREADY_EXISTS: "이미 가입된 이메일입니다.",
  WEAK_PASSWORD: "비밀번호는 6자 이상이어야 합니다.",
  SIGNUP_DISABLED: "회원가입이 일시적으로 비활성화되었습니다.",

  // 프로필 에러
  PROFILE_CREATE_FAILED: "프로필 생성에 실패했습니다.",
  PROFILE_UPDATE_FAILED: "프로필 업데이트에 실패했습니다.",
  IMAGE_UPLOAD_FAILED: "이미지 업로드에 실패했습니다.",
  STORAGE_PERMISSION_DENIED: "파일 업로드 권한이 없습니다.",

  // 네트워크 에러
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다. 다시 시도해주세요.",

  // 일반 에러
  UNKNOWN_ERROR: "이메일 혹은 비밀번호가 틀렸거나 탈퇴한 회원입니다.",
  PERMISSION_DENIED: "권한이 없습니다.",
  NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
};

/**
 * Supabase 에러 코드와 메시지 매핑
 */
const SUPABASE_ERROR_MAPPING = {
  // Auth 에러
  "Invalid login credentials": AUTH_ERRORS.INVALID_CREDENTIALS,
  "Email not confirmed": AUTH_ERRORS.EMAIL_NOT_CONFIRMED,
  "User already registered": AUTH_ERRORS.USER_ALREADY_EXISTS,
  "Password should be at least": AUTH_ERRORS.WEAK_PASSWORD,
  "Too many requests": AUTH_ERRORS.TOO_MANY_REQUESTS,
  "Signup is disabled": AUTH_ERRORS.SIGNUP_DISABLED,

  // Database 에러
  "row-level security": AUTH_ERRORS.PERMISSION_DENIED,
  42501: AUTH_ERRORS.PERMISSION_DENIED,
  PGRST116: AUTH_ERRORS.NOT_FOUND,

  // Storage 에러
  "Storage permission denied": AUTH_ERRORS.STORAGE_PERMISSION_DENIED,
  "File too large": "파일 크기가 너무 큽니다.",
  "Invalid file type": "지원되지 않는 파일 형식입니다.",
};

/**
 * 네트워크 에러 감지
 * @param {Error} error
 * @returns {boolean}
 */
const isNetworkError = error => {
  return (
    !navigator.onLine ||
    error.message?.includes("fetch") ||
    error.message?.includes("network") ||
    error.code === "NETWORK_ERROR"
  );
};

/**
 * 타임아웃 에러 감지
 * @param {Error} error
 * @returns {boolean}
 */
const isTimeoutError = error => {
  return (
    error.message?.includes("timeout") ||
    error.message?.includes("타임아웃") ||
    error.code === "TIMEOUT"
  );
};

/**
 * 서버 에러 감지 (5xx)
 * @param {Error} error
 * @returns {boolean}
 */
const isServerError = error => {
  return (
    error.status >= 500 ||
    error.message?.includes("Internal Server Error") ||
    error.message?.includes("Service Unavailable")
  );
};

/**
 * Supabase 에러를 사용자 친화적 메시지로 변환
 * @param {string} errorMessage
 * @returns {string}
 */
export const getSupabaseErrorMessage = errorMessage => {
  if (!errorMessage) return AUTH_ERRORS.UNKNOWN_ERROR;

  // 정확한 매칭 먼저 확인
  if (SUPABASE_ERROR_MAPPING[errorMessage]) {
    return SUPABASE_ERROR_MAPPING[errorMessage];
  }

  // 부분 매칭 확인
  for (const [key, value] of Object.entries(SUPABASE_ERROR_MAPPING)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // 매칭되지 않으면 원본 메시지 반환 (개발 환경에서 디버깅용)
  return process.env.NODE_ENV === "development"
    ? `${errorMessage}`
    : AUTH_ERRORS.UNKNOWN_ERROR;
};

/**
 * 일반적인 에러를 사용자 친화적 메시지로 변환
 * @param {Error|string} error
 * @returns {string}
 */
export const getErrorMessage = error => {
  // 문자열인 경우
  if (typeof error === "string") {
    return getSupabaseErrorMessage(error);
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    // 네트워크 에러 체크
    if (isNetworkError(error)) {
      return AUTH_ERRORS.NETWORK_ERROR;
    }

    // 타임아웃 에러 체크
    if (isTimeoutError(error)) {
      return AUTH_ERRORS.TIMEOUT_ERROR;
    }

    // 서버 에러 체크
    if (isServerError(error)) {
      return AUTH_ERRORS.SERVER_ERROR;
    }

    // Supabase 에러 메시지 변환
    return getSupabaseErrorMessage(error.message);
  }

  // 객체인 경우 (Supabase 에러 응답)
  if (error && typeof error === "object") {
    const message = error.message || error.error_description || error.msg;
    if (message) {
      return getSupabaseErrorMessage(message);
    }
  }

  return AUTH_ERRORS.UNKNOWN_ERROR;
};

/**
 * 에러 로깅 함수
 * @param {string} context - 에러가 발생한 컨텍스트
 * @param {Error|string} error - 에러 객체 또는 메시지
 * @param {object} additionalInfo - 추가 정보
 */
export const logError = (context, error, additionalInfo = {}) => {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalInfo,
  };

  if (error instanceof Error) {
    errorInfo.message = error.message;
    errorInfo.stack = error.stack;
    errorInfo.name = error.name;
  } else {
    errorInfo.message = String(error);
  }
};

/**
 * 에러 핸들링 고차 함수
 * @param {Function} asyncFunction - 비동기 함수
 * @param {string} context - 에러 컨텍스트
 * @returns {Function} 에러 처리가 추가된 함수
 */
export const withErrorHandling = (asyncFunction, context) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      logError(context, error, { args });

      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  };
};

/**
 * Promise에 타임아웃을 추가하는 유틸리티
 * @param {Promise} promise
 * @param {number} timeoutMs
 * @returns {Promise}
 */
export const withTimeout = (promise, timeoutMs = 10000) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("타임아웃"));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};

/**
 * 재시도 로직을 추가하는 유틸리티
 * @param {Function} asyncFunction
 * @param {number} maxRetries
 * @param {number} delayMs
 * @returns {Function}
 */
export const withRetry = (asyncFunction, maxRetries = 3, delayMs = 1000) => {
  return async (...args) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        lastError = error;

        // 네트워크 에러가 아니면 재시도하지 않음
        if (
          !isNetworkError(error) &&
          !isTimeoutError(error) &&
          !isServerError(error)
        ) {
          throw error;
        }

        // 마지막 시도가 아니면 딜레이 후 재시도
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw lastError;
  };
};

/**
 * 폼 에러 상태 관리를 위한 유틸리티
 * @param {object} errors
 * @param {string} field
 * @param {string} message
 * @returns {object}
 */
export const setFieldError = (errors, field, message) => ({
  ...errors,
  [field]: message,
});

/**
 * 폼 에러 제거를 위한 유틸리티
 * @param {object} errors
 * @param {string} field
 * @returns {object}
 */
export const clearFieldError = (errors, field) => {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
};

/**
 * 모든 에러 제거
 * @returns {object}
 */
export const clearAllErrors = () => ({});

/**
 * 에러가 있는지 확인
 * @param {object} errors
 * @returns {boolean}
 */
export const hasErrors = errors => {
  return Object.keys(errors).length > 0;
};
