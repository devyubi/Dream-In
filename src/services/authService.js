// src/services/authService.js
import { supabase } from "../api/supabaseClient";

export const AuthService = {
  // 로그인
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        session: data.session,
        user: data.user,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 회원가입
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 구글 로그인
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "profile email",
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 카카오 로그인
  async signInWithKakao() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "profile_nickname profile_image account_email",
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 현재 세션 가져오기
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        session: session,
        user: session?.user,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 토큰 갱신
  async refreshToken(refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        session: data.session,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 로그아웃
  async signOut(accessToken) {
    try {
      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase 로그아웃 오류:", error);
        // 로그아웃 오류가 있어도 성공으로 처리 (로컬 정리는 진행)
      }

      return { success: true };
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      return { success: true }; // 로컬 정리를 위해 성공으로 처리
    }
  },

  // 비밀번호 재설정
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // 비밀번호 업데이트
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Auth 상태 변경 리스너
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export const SessionService = {
  // 토큰 유효성 검사
  isTokenValid(token) {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // 세션 유효성 검사 (새로 추가)
  isSessionValid(session) {
    if (!session?.access_token) return false;
    return this.isTokenValid(session.access_token);
  },

  // 세션 만료 체크
  isSessionExpired(session) {
    if (!session?.access_token) return true;
    return !this.isTokenValid(session.access_token);
  },

  // 토큰 만료까지 남은 시간 (초)
  getTimeUntilExpiry(session) {
    if (!session?.access_token) return 0;

    try {
      const payload = JSON.parse(atob(session.access_token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      return 0;
    }
  },

  // 자동 토큰 갱신 설정 (Supabase에서 자동 처리)
  setupAutoRefresh(callback) {
    // Supabase는 자동으로 토큰을 갱신하므로
    // auth state change 리스너를 통해 처리
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" && session) {
        callback(session);
      }
    });

    return () => subscription.unsubscribe();
  },
};
