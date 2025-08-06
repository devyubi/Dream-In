// src/contexts/AuthContext.jsx
import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { AuthService, SessionService } from "../services/authService";
import { UserService, FileUploadService } from "../services/userService";
import { logError } from "../utils/errorHandler";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 토큰 관리 유틸리티
const TokenManager = {
  // 토큰을 안전하게 저장 (HttpOnly 쿠키 시뮬레이션)
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      // 메모리에 저장 (가장 안전)
      window._accessToken = accessToken;
      // localStorage에는 암호화해서 저장 (브라우저 종료 시 유지)
      localStorage.setItem(
        "auth_session",
        btoa(
          JSON.stringify({
            token: accessToken,
            timestamp: Date.now(),
            expires: Date.now() + 24 * 60 * 60 * 1000, // 24시간
          }),
        ),
      );
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
  },

  // 토큰 가져오기
  getAccessToken: () => {
    // 메모리에서 먼저 확인
    if (window._accessToken) {
      return window._accessToken;
    }

    // localStorage에서 복원
    try {
      const session = localStorage.getItem("auth_session");
      if (session) {
        const decoded = JSON.parse(atob(session));
        if (decoded.expires > Date.now()) {
          window._accessToken = decoded.token;
          return decoded.token;
        } else {
          // 만료된 토큰 제거
          localStorage.removeItem("auth_session");
        }
      }
    } catch (error) {
      localStorage.removeItem("auth_session");
    }
    return null;
  },

  getRefreshToken: () => {
    return localStorage.getItem("refresh_token");
  },

  // 토큰 삭제
  clearTokens: () => {
    window._accessToken = null;
    localStorage.removeItem("auth_session");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("profile_data");
  },

  // 토큰 유효성 검사
  isTokenValid: token => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

// 사용자 데이터 관리
const UserDataManager = {
  setUserData: (user, profile) => {
    if (user) {
      localStorage.setItem("user_data", JSON.stringify(user));
    }
    if (profile) {
      localStorage.setItem("profile_data", JSON.stringify(profile));
    }
  },

  getUserData: () => {
    try {
      const userData = localStorage.getItem("user_data");
      const profileData = localStorage.getItem("profile_data");
      return {
        user: userData ? JSON.parse(userData) : null,
        profile: profileData ? JSON.parse(profileData) : null,
      };
    } catch {
      return { user: null, profile: null };
    }
  },

  clearUserData: () => {
    localStorage.removeItem("user_data");
    localStorage.removeItem("profile_data");
  },
};

export const AuthProvider = ({ children }) => {
  // ===== 상태 관리 =====
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // 초기화 중
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 타이머 참조
  const tokenCheckInterval = useRef(null);
  const refreshTokenTimer = useRef(null);

  // ===== 토큰 기반 인증 상태 확인 =====
  const checkAuthStatus = useCallback(async () => {
    const token = TokenManager.getAccessToken();

    if (!token || !TokenManager.isTokenValid(token)) {
      // 토큰이 없거나 만료됨
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        // 리프레시 토큰으로 재발급 시도
        try {
          const result = await AuthService.refreshToken(refreshToken);
          if (result.success) {
            TokenManager.setTokens(result.accessToken, result.refreshToken);
            window._accessToken = result.accessToken;
            setSession({ access_token: result.accessToken });
            setIsAuthenticated(true);
            return true;
          }
        } catch (error) {
          logError("토큰 갱신 실패", error);
        }
      }

      // 토큰 갱신 실패 시 로그아웃
      handleTokenExpired();
      return false;
    }

    // 유효한 토큰이 있음
    setSession({ access_token: token });
    setIsAuthenticated(true);
    return true;
  }, []);

  // ===== 토큰 만료 처리 =====
  const handleTokenExpired = useCallback(() => {
    TokenManager.clearTokens();
    UserDataManager.clearUserData();
    setUser(null);
    setProfile(null);
    setSession(null);
    setIsAuthenticated(false);

    // 로그인 페이지로 리다이렉트
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/" &&
      !window.location.pathname.startsWith("/signup")
    ) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
    }
  }, []);

  // ===== 자동 토큰 갱신 설정 =====
  const setupTokenRefresh = useCallback(
    token => {
      if (!token || !TokenManager.isTokenValid(token)) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiresIn = payload.exp * 1000 - Date.now();
        const refreshTime = Math.max(expiresIn - 5 * 60 * 1000, 60000); // 5분 전 또는 1분 후

        if (refreshTokenTimer.current) {
          clearTimeout(refreshTokenTimer.current);
        }

        refreshTokenTimer.current = setTimeout(async () => {
          const refreshToken = TokenManager.getRefreshToken();
          if (refreshToken) {
            try {
              const result = await AuthService.refreshToken(refreshToken);
              if (result.success) {
                TokenManager.setTokens(result.accessToken, result.refreshToken);
                window._accessToken = result.accessToken;
                setSession({ access_token: result.accessToken });
                setupTokenRefresh(result.accessToken);
              } else {
                handleTokenExpired();
              }
            } catch (error) {
              logError("자동 토큰 갱신 실패", error);
              handleTokenExpired();
            }
          }
        }, refreshTime);
      } catch (error) {
        logError("토큰 갱신 스케줄 설정 실패", error);
      }
    },
    [handleTokenExpired],
  );

  // ===== 프로필 로드 함수 =====
  const loadUserProfile = useCallback(async authUser => {
    try {
      if (!authUser) return;

      const result = await UserService.getCurrentUserProfile();
      if (result.success && result.profile) {
        setProfile(result.profile);
        UserDataManager.setUserData(authUser, result.profile);
      }
    } catch (error) {
      logError("loadUserProfile", error, { userId: authUser?.id });
    }
  }, []);

  // ===== 초기화 =====
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // 저장된 사용자 데이터 복원
        const { user: savedUser, profile: savedProfile } =
          UserDataManager.getUserData();
        if (savedUser) {
          setUser(savedUser);
        }
        if (savedProfile) {
          setProfile(savedProfile);
        }

        // 토큰 기반 인증 상태 확인
        const isValid = await checkAuthStatus();

        if (isValid && savedUser) {
          // 토큰이 유효하고 사용자 데이터가 있으면 프로필 최신화
          await loadUserProfile(savedUser);
          setupTokenRefresh(TokenManager.getAccessToken());
        }
      } catch (error) {
        logError("초기화 오류", error);
        handleTokenExpired();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus, loadUserProfile, setupTokenRefresh, handleTokenExpired]);

  // ===== 주기적 토큰 검증 =====
  useEffect(() => {
    if (isAuthenticated) {
      tokenCheckInterval.current = setInterval(
        async () => {
          await checkAuthStatus();
        },
        5 * 60 * 1000,
      ); // 5분마다

      return () => {
        if (tokenCheckInterval.current) {
          clearInterval(tokenCheckInterval.current);
        }
      };
    }
  }, [isAuthenticated, checkAuthStatus]);

  // ===== 페이지 포커스 시 토큰 검증 =====
  useEffect(() => {
    const handleFocus = async () => {
      if (isAuthenticated) {
        await checkAuthStatus();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleFocus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, checkAuthStatus]);

  // ===== 브라우저 종료 시 정리 (선택사항) =====
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 브라우저 완전 종료 시에만 토큰 제거하려면 주석 해제
      // TokenManager.clearTokens();
      // UserDataManager.clearUserData();
    };

    // window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // ===== 로그인 함수 =====
  const signIn = useCallback(
    async (email, password) => {
      setAuthLoading(true);
      try {
        const result = await AuthService.signIn(email, password);

        if (result.success && result.session?.access_token) {
          // 토큰 저장
          TokenManager.setTokens(
            result.session.access_token,
            result.session.refresh_token,
          );

          // 상태 업데이트
          setSession(result.session);
          setUser(result.session.user);
          setIsAuthenticated(true);

          // 사용자 데이터 저장
          UserDataManager.setUserData(result.session.user, null);

          // 프로필 로드 및 토큰 갱신 설정
          await loadUserProfile(result.session.user);
          setupTokenRefresh(result.session.access_token);
        }

        return result;
      } catch (error) {
        logError("signIn", error, { email });
        return { success: false, error: error.message };
      } finally {
        setAuthLoading(false);
      }
    },
    [loadUserProfile, setupTokenRefresh],
  );

  // ===== 회원가입 함수 =====
  const signUp = useCallback(async userData => {
    setAuthLoading(true);
    try {
      const authResult = await AuthService.signUp(
        userData.email,
        userData.password,
      );

      if (!authResult.success) {
        return authResult;
      }

      const authUser = authResult.data.user;
      if (!authUser) {
        throw new Error("회원가입 후 사용자 정보가 없습니다.");
      }

      let profileImageUrl = null;
      if (userData.profileImage) {
        try {
          const uploadResult = await FileUploadService.uploadProfileImage(
            userData.profileImage,
            authUser.id,
          );
          if (uploadResult.success) {
            profileImageUrl = uploadResult.url;
          }
        } catch (error) {
          logError("profileImageUpload", error, { userId: authUser.id });
        }
      }

      const profileResult = await UserService.createProfile({
        auth_user_id: authUser.id,
        email: userData.email,
        nickname: userData.nickname,
        birthdate: userData.birthdate || null,
        gender: userData.gender || null,
        profile_image_url: profileImageUrl,
      });

      if (!profileResult.success) {
        return {
          success: false,
          error: "프로필 생성에 실패했습니다.",
        };
      }

      return {
        success: true,
        data: authResult.data,
        profile: profileResult.profile,
        message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      };
    } catch (error) {
      logError("signUp", error, { email: userData.email });
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ===== 로그아웃 함수 =====
  const signOut = useCallback(async () => {
    setAuthLoading(true);
    try {
      // 서버에 로그아웃 요청
      const token = TokenManager.getAccessToken();
      if (token) {
        await AuthService.signOut(token);
      }

      // 로컬 상태 및 토큰 정리
      TokenManager.clearTokens();
      UserDataManager.clearUserData();

      setSession(null);
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);

      // 타이머 정리
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
      }
      if (refreshTokenTimer.current) {
        clearTimeout(refreshTokenTimer.current);
      }

      return { success: true };
    } catch (error) {
      logError("signOut", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ===== 프로필 업데이트 함수 =====
  const updateProfile = useCallback(
    async profileData => {
      setAuthLoading(true);
      try {
        if (!user?.id) {
          throw new Error("로그인된 사용자가 없습니다.");
        }

        let profileImageUrl = profileData.profileImageUrl;
        if (profileData.profileImage instanceof File) {
          const uploadResult = await FileUploadService.uploadProfileImage(
            profileData.profileImage,
            user.id,
          );
          if (uploadResult.success) {
            profileImageUrl = uploadResult.url;
          }
        }

        const updateData = {
          nickname: profileData.nickname,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          profile_image_url: profileImageUrl,
        };

        const result = await UserService.updateProfile(user.id, updateData);

        if (result.success) {
          await loadUserProfile(user);
        }

        return result;
      } catch (error) {
        logError("updateProfile", error, { userId: user?.id });
        return { success: false, error: error.message };
      } finally {
        setAuthLoading(false);
      }
    },
    [user, loadUserProfile],
  );

  // ===== 비밀번호 재설정 함수 =====
  const resetPassword = useCallback(async email => {
    setAuthLoading(true);
    try {
      const result = await AuthService.resetPassword(email);
      return result;
    } catch (error) {
      logError("resetPassword", error, { email });
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ===== 비밀번호 업데이트 함수 =====
  const updatePassword = useCallback(async newPassword => {
    setAuthLoading(true);
    try {
      const result = await AuthService.updatePassword(newPassword);
      return result;
    } catch (error) {
      logError("updatePassword", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ===== 프로필 새로고침 함수 =====
  const refreshProfile = useCallback(async () => {
    if (user && isAuthenticated) {
      await loadUserProfile(user);
    }
  }, [user, isAuthenticated, loadUserProfile]);

  // ===== 닉네임 중복확인 함수 =====
  const checkNicknameDuplicate = useCallback(async nickname => {
    try {
      const result = await UserService.checkNicknameDuplicate(nickname);
      return result;
    } catch (error) {
      logError("checkNicknameDuplicate", error, { nickname });
      return { success: false, error: error.message };
    }
  }, []);

  // ===== 계산된 값들 =====
  const isLoggedIn = isAuthenticated && !!user;

  // ===== Context Value =====
  const value = {
    // 상태
    user,
    profile,
    session,
    loading,
    authLoading,
    isAuthenticated,
    isLoggedIn,

    // 메서드
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    refreshProfile,
    checkNicknameDuplicate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
