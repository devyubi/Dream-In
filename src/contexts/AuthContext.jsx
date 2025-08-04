// src/contexts/AuthContext.jsx
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUserProfile,
  uploadProfileImage,
  createSocialUserProfile,
} from "../api/auth";
import { supabase } from "../api/supabaseClient";

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

  // ===== 프로필 로드 함수 =====
  const loadUserProfile = async authUser => {
    try {
      console.log("=== loadUserProfile 시작 ===", authUser?.email);

      if (!authUser) {
        setProfile(null);
        return;
      }

      // 5초 타임아웃 설정
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("타임아웃")), 5000),
      );

      const profilePromise = getCurrentUserProfile();
      const profileData = await Promise.race([profilePromise, timeoutPromise]);

      console.log("getCurrentUserProfile 결과:", profileData);

      if (profileData) {
        console.log("프로필 데이터 로드 성공:", profileData.nickname);
        setProfile(profileData);
      } else {
        console.warn("프로필 데이터가 없습니다");
        setProfile(null);
      }
    } catch (error) {
      console.error("프로필 로드 실패:", error);
      setProfile(null);
    }
  };

  // ===== 초기 세션 확인 =====
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (session?.user && session?.access_token) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("초기 세션 로드 실패:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  // ===== Auth 상태 변경 리스너 =====
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth 상태 변경:", event, session?.user?.email);

      if (event === "SIGNED_OUT" || !session?.user || !session?.access_token) {
        setUser(null);
        setProfile(null);
      } else if (event === "SIGNED_IN") {
        setUser(session.user);

        // 소셜 로그인 사용자 프로필 자동 생성
        const provider = session.user.app_metadata?.provider;
        if (provider === "google" || provider === "kakao") {
          console.log(`${provider} 로그인 감지 - 프로필 자동 생성`);

          const existingProfile = await getCurrentUserProfile();
          if (!existingProfile) {
            await createSocialUserProfile(session.user);
          }
        }

        await loadUserProfile(session.user);
      } else if (event === "TOKEN_REFRESHED") {
        setUser(session.user);
        await loadUserProfile(session.user);
      }

      if (loading) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loading]);

  // ===== 로그인 함수 =====
  const signIn = async (email, password) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== 회원가입 함수 =====
  const signUp = async userData => {
    setAuthLoading(true);
    try {
      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) {
        throw new Error("회원가입 후 사용자 정보가 없습니다.");
      }

      // 2. 프로필 이미지 업로드 (있다면)
      let profileImageUrl = null;
      if (userData.profileImage) {
        const uploadResult = await uploadProfileImage(
          userData.profileImage,
          authData.user.id,
        );
        if (uploadResult.success) {
          profileImageUrl = uploadResult.url;
        }
      }

      // 3. 프로필 정보 저장
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          auth_user_id: authData.user.id,
          email: userData.email,
          nickname: userData.nickname,
          birthdate: userData.birthdate || null,
          gender: userData.gender || null,
          profile_image_url: profileImageUrl,
        })
        .select()
        .single();

      if (profileError) {
        if (
          profileError.code === "42501" ||
          profileError.message?.includes("row-level security")
        ) {
          throw new Error(
            "프로필 생성 권한이 없습니다. RLS 정책을 확인해주세요.",
          );
        }
        throw profileError;
      }

      return {
        success: true,
        data: authData,
        profile: profileData,
        message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== 로그아웃 함수 =====
  const signOut = async () => {
    setAuthLoading(true);
    try {
      localStorage.clear();
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;

      setTimeout(() => {
        window.location.href = "/";
      }, 100);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== 프로필 업데이트 함수 =====
  const updateProfile = async profileData => {
    setAuthLoading(true);
    try {
      if (!user?.id) {
        throw new Error("로그인된 사용자가 없습니다.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          nickname: profileData.nickname,
          birthdate: profileData.birthdate,
          gender: profileData.gender,
          profile_image_url: profileData.profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      await loadUserProfile(user);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== 비밀번호 재설정 함수 =====
  const resetPassword = async email => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      return {
        success: true,
        message: "비밀번호 재설정 이메일을 발송했습니다.",
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ===== 프로필 새로고침 함수 =====
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // ===== Context Value =====
  const value = {
    // 상태
    user,
    profile,
    loading,
    authLoading,
    isLoggedIn: !!user,
    isAuthenticated: !!user,

    // 메서드
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
