// src/services/authService.js
import { supabase } from "../api/supabaseClient";
import { withErrorHandling, withTimeout } from "../utils/errorHandler";

/**
 * 인증 관련 서비스 클래스
 */
export class AuthService {
  /**
   * 이메일/비밀번호 로그인
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  static signIn = withErrorHandling(async (email, password) => {
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      10000,
    );

    if (error) throw error;

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  }, "AuthService.signIn");

  /**
   * 이메일/비밀번호 회원가입
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>}
   */
  static signUp = withErrorHandling(async (email, password) => {
    const { data, error } = await withTimeout(
      supabase.auth.signUp({ email, password }),
      15000,
    );

    if (error) throw error;
    if (!data.user) {
      throw new Error("회원가입 후 사용자 정보가 없습니다.");
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  }, "AuthService.signUp");

  /**
   * Google OAuth 로그인
   * @returns {Promise<object>}
   */
  static signInWithGoogle = withErrorHandling(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "profile email",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true, data };
  }, "AuthService.signInWithGoogle");

  /**
   * Kakao OAuth 로그인
   * @returns {Promise<object>}
   */
  static signInWithKakao = withErrorHandling(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        scopes: "profile_nickname profile_image account_email",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true, data };
  }, "AuthService.signInWithKakao");

  /**
   * 로그아웃
   * @param {string} scope - 로그아웃 범위 ('global' | 'local')
   * @returns {Promise<object>}
   */
  static signOut = withErrorHandling(async (scope = "local") => {
    // 로컬 스토리지 정리
    localStorage.clear();
    sessionStorage.clear();

    const { error } = await supabase.auth.signOut({ scope });
    if (error) throw error;

    return { success: true };
  }, "AuthService.signOut");

  /**
   * 비밀번호 재설정 이메일 발송
   * @param {string} email
   * @returns {Promise<object>}
   */
  static resetPassword = withErrorHandling(async email => {
    const { error } = await withTimeout(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      }),
      10000,
    );

    if (error) throw error;

    return {
      success: true,
      message: "비밀번호 재설정 이메일을 발송했습니다.",
    };
  }, "AuthService.resetPassword");

  /**
   * 비밀번호 업데이트
   * @param {string} newPassword
   * @returns {Promise<object>}
   */
  static updatePassword = withErrorHandling(async newPassword => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      data: data.user,
    };
  }, "AuthService.updatePassword");

  /**
   * 현재 세션 가져오기
   * @returns {Promise<object>}
   */
  static getCurrentSession = withErrorHandling(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return {
      success: true,
      session: data.session,
      user: data.session?.user || null,
    };
  }, "AuthService.getCurrentSession");

  /**
   * 사용자 정보 업데이트
   * @param {object} updates
   * @returns {Promise<object>}
   */
  static updateUser = withErrorHandling(async updates => {
    const { data, error } = await supabase.auth.updateUser(updates);

    if (error) throw error;

    return {
      success: true,
      user: data.user,
    };
  }, "AuthService.updateUser");

  /**
   * 이메일 인증 재발송
   * @param {string} email
   * @returns {Promise<object>}
   */
  static resendConfirmation = withErrorHandling(async email => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) throw error;

    return {
      success: true,
      message: "인증 이메일을 다시 발송했습니다.",
    };
  }, "AuthService.resendConfirmation");

  /**
   * 세션 새로고침
   * @returns {Promise<object>}
   */
  static refreshSession = withErrorHandling(async () => {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    return {
      success: true,
      session: data.session,
      user: data.session?.user || null,
    };
  }, "AuthService.refreshSession");

  /**
   * 계정 삭제 (관리자 API 필요)
   * @returns {Promise<object>}
   */
  static deleteAccount = withErrorHandling(async () => {
    // 실제 구현은 백엔드 API 호출 필요
    // Supabase Auth에서는 직접 계정 삭제 API를 제공하지 않음
    throw new Error("계정 삭제 기능은 현재 구현되지 않았습니다.");
  }, "AuthService.deleteAccount");

  /**
   * 인증 상태 변경 리스너 등록
   * @param {Function} callback
   * @returns {object} subscription 객체
   */
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * MFA 설정 (향후 구현)
   * @param {object} options
   * @returns {Promise<object>}
   */
  static setupMFA = withErrorHandling(async options => {
    // MFA 기능은 향후 구현 예정
    throw new Error("MFA 기능은 아직 구현되지 않았습니다.");
  }, "AuthService.setupMFA");
}

/**
 * 소셜 로그인 관련 유틸리티
 */
export class SocialAuthService {
  /**
   * 지원하는 소셜 로그인 제공자 목록
   */
  static providers = ["google", "kakao"];

  /**
   * 제공자별 로그인 함수 매핑
   */
  static providerMethods = {
    google: AuthService.signInWithGoogle,
    kakao: AuthService.signInWithKakao,
  };

  /**
   * 소셜 로그인 실행
   * @param {string} provider
   * @returns {Promise<object>}
   */
  static signInWithProvider = withErrorHandling(async provider => {
    if (!this.providers.includes(provider)) {
      throw new Error(`지원하지 않는 로그인 제공자입니다: ${provider}`);
    }

    const method = this.providerMethods[provider];
    if (!method) {
      throw new Error(`${provider} 로그인 메서드를 찾을 수 없습니다.`);
    }

    return await method();
  }, "SocialAuthService.signInWithProvider");

  /**
   * OAuth 콜백 처리
   * @returns {Promise<object>}
   */
  static handleOAuthCallback = withErrorHandling(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!data.session) {
      throw new Error("OAuth 인증에 실패했습니다.");
    }

    return {
      success: true,
      session: data.session,
      user: data.session.user,
    };
  }, "SocialAuthService.handleOAuthCallback");
}

/**
 * 세션 관리 유틸리티
 */
export class SessionService {
  /**
   * 세션 유효성 검사
   * @param {object} session
   * @returns {boolean}
   */
  static isSessionValid(session) {
    if (!session || !session.access_token || !session.user) {
      return false;
    }

    // 토큰 만료 시간 확인
    const expiresAt = session.expires_at * 1000; // 초 -> 밀리초 변환
    const now = Date.now();

    return expiresAt > now;
  }

  /**
   * 세션 만료까지 남은 시간 (밀리초)
   * @param {object} session
   * @returns {number}
   */
  static getTimeUntilExpiry(session) {
    if (!session || !session.expires_at) {
      return 0;
    }

    const expiresAt = session.expires_at * 1000;
    const now = Date.now();

    return Math.max(0, expiresAt - now);
  }

  /**
   * 자동 토큰 갱신 설정
   * @param {Function} onRefresh
   * @returns {Function} cleanup 함수
   */
  static setupAutoRefresh(onRefresh) {
    let refreshTimer;

    const scheduleRefresh = session => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      if (!this.isSessionValid(session)) {
        return;
      }

      const timeUntilExpiry = this.getTimeUntilExpiry(session);
      const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000); // 만료 5분 전

      refreshTimer = setTimeout(async () => {
        try {
          const result = await AuthService.refreshSession();
          if (result.success && onRefresh) {
            onRefresh(result.session);
            scheduleRefresh(result.session);
          }
        } catch (error) {
          console.error("자동 토큰 갱신 실패:", error);
        }
      }, refreshTime);
    };

    // 현재 세션으로 초기 스케줄링
    AuthService.getCurrentSession().then(result => {
      if (result.success && result.session) {
        scheduleRefresh(result.session);
      }
    });

    // cleanup 함수 반환
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }
}
