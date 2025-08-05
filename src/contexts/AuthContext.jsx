// src/contexts/AuthContext.jsx
import PropTypes from "prop-types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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

export const AuthProvider = ({ children }) => {
  // ===== 상태 관리 =====
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState(null);

  // ===== 프로필 로드 함수 =====
  const loadUserProfile = useCallback(async authUser => {
    try {
      if (!authUser) {
        setProfile(null);
        return;
      }

      const result = await UserService.getCurrentUserProfile();

      if (result.success && result.profile) {
        setProfile(result.profile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      logError("loadUserProfile", error, { userId: authUser?.id });
      setProfile(null);
    }
  }, []);

  // ===== 초기 세션 확인 =====
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const result = await AuthService.getCurrentSession();

        if (
          result.success &&
          result.session?.user &&
          result.session?.access_token
        ) {
          setSession(result.session);
          setUser(result.session.user);
          await loadUserProfile(result.session.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        logError("initializeAuth", error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [loadUserProfile]);

  // ===== Auth 상태 변경 리스너 =====
  useEffect(() => {
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      try {
        console.log("Auth 상태 변경:", event, session?.user?.email);

        if (
          event === "SIGNED_OUT" ||
          !session?.user ||
          !session?.access_token
        ) {
          setSession(null);
          setUser(null);
          setProfile(null);
        } else if (event === "SIGNED_IN") {
          setSession(session);
          setUser(session.user);

          // 소셜 로그인 사용자 프로필 자동 생성
          const provider = session.user.app_metadata?.provider;
          if (provider === "google" || provider === "kakao") {
            try {
              const existingProfile = await UserService.getCurrentUserProfile();
              if (!existingProfile.success || !existingProfile.profile) {
                await UserService.createSocialUserProfile(session.user);
              }
            } catch (error) {
              logError("createSocialUserProfile", error, {
                provider,
                userId: session.user.id,
              });
            }
          }

          await loadUserProfile(session.user);
        } else if (event === "TOKEN_REFRESHED") {
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user);
        }

        if (loading) {
          setLoading(false);
        }
      } catch (error) {
        logError("onAuthStateChange", error, { event });
        if (loading) {
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [loading, loadUserProfile]);

  // ===== 자동 토큰 갱신 설정 =====
  useEffect(() => {
    if (!session) return;

    const cleanup = SessionService.setupAutoRefresh(newSession => {
      setSession(newSession);
      setUser(newSession.user);
      loadUserProfile(newSession.user);
    });

    return cleanup;
  }, [session, loadUserProfile]);

  // ===== 로그인 함수 =====
  const signIn = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } catch (error) {
      logError("signIn", error, { email });
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ===== 회원가입 함수 =====
  const signUp = useCallback(async userData => {
    setAuthLoading(true);
    try {
      // 1. Supabase Auth 회원가입
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

      // 2. 프로필 이미지 업로드 (있다면)
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
          // 이미지 업로드 실패는 회원가입을 막지 않음
        }
      }

      // 3. 프로필 정보 저장
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
      const result = await AuthService.signOut("local");

      if (result.success) {
        // 상태 초기화
        setSession(null);
        setUser(null);
        setProfile(null);

        // 페이지 이동
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }

      return result;
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

        // 프로필 이미지 업로드 (새 이미지가 있다면)
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
    if (user) {
      await loadUserProfile(user);
    }
  }, [user, loadUserProfile]);

  // ===== 세션 새로고침 함수 =====
  const refreshSession = useCallback(async () => {
    try {
      const result = await AuthService.refreshSession();
      if (result.success) {
        setSession(result.session);
        setUser(result.user);
        await loadUserProfile(result.user);
      }
      return result;
    } catch (error) {
      logError("refreshSession", error);
      return { success: false, error: error.message };
    }
  }, [loadUserProfile]);

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
  const isLoggedIn = !!user && !!session;
  const isAuthenticated = isLoggedIn && SessionService.isSessionValid(session);
  const sessionTimeLeft = session
    ? SessionService.getTimeUntilExpiry(session)
    : 0;

  // ===== Context Value =====
  const value = {
    // 상태
    user,
    profile,
    session,
    loading,
    authLoading,
    isLoggedIn,
    isAuthenticated,
    sessionTimeLeft,

    // 메서드
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    refreshProfile,
    refreshSession,
    checkNicknameDuplicate,

    // 유틸리티
    setUser,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
