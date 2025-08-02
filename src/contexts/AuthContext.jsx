/* eslint-disable no-unused-vars */
// src/contexts/AuthContext.jsx
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUserProfile, uploadProfileImage } from "../api/auth";
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
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // 프로필 로드 함수
  const loadUserProfile = async authUser => {
    try {
      // console.log("사용자 프로필 로드 시작:", authUser?.email);

      if (!authUser) {
        setProfile(null);
        return;
      }

      const profileData = await getCurrentUserProfile();

      if (profileData) {
        // console.log("프로필 데이터 로드 성공:", profileData.nickname);
        setProfile(profileData);
      } else {
        // console.warn("프로필 데이터가 없습니다");
        setProfile(null);
      }
    } catch (error) {
      // console.log("프로필 로드 실패:", error);

      setProfile(null);
    }
  };

  // 초기 로드 시 사용자 세션 확인
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // console.log("초기 세션 확인 시작...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          // console.log("세션 확인 오류:", error);
          setUser(null);
          setProfile(null);
          return;
        }

        // console.log("세션 상태:", {
        //   hasSession: !!session,
        //   hasUser: !!session?.user,
        //   hasAccessToken: !!session?.access_token,
        //   userEmail: session?.user?.email,
        //   expiresAt: session?.expires_at
        //     ? new Date(session.expires_at * 1000).toLocaleString()
        //     : "N/A",
        // });

        if (session?.user && session?.access_token) {
          // console.log("유효한 세션 발견:", session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          // console.warn("유효하지 않은 세션 - 상태 초기화");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        // console.log("초기 세션 로드 실패:", error);

        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  // Auth 상태 변경 리스너
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth 상태 변경:", event, session?.user?.email);

      if (event === "SIGNED_OUT" || !session?.user || !session?.access_token) {
        // console.log("로그아웃 또는 무효한 세션 - 상태 초기화");
        setUser(null);
        setProfile(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // console.log("로그인 또는 토큰 갱신 - 프로필 로드");
        setUser(session.user);
        await loadUserProfile(session.user);
      }

      if (loading) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loading]);

  // 로그인
  const signIn = async (email, password) => {
    setAuthLoading(true);
    try {
      // console.log("로그인 시도:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // console.log("로그인 성공:", data.user?.email);

      // 상태는 onAuthStateChange에서 자동으로 설정됨
      return { success: true, data };
    } catch (error) {
      // console.log("로그인 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 회원가입
  const signUp = async userData => {
    setAuthLoading(true);
    try {
      // console.log("회원가입 시작:", userData.email);

      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        // console.log("Auth 회원가입 실패:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("회원가입 후 사용자 정보가 없습니다.");
      }

      // console.log("Auth 회원가입 성공:", authData.user.id);

      // 2. 프로필 이미지 업로드 (있다면)
      let profileImageUrl = null;
      if (userData.profileImage) {
        // console.log("프로필 이미지 업로드 시작...");
        const uploadResult = await uploadProfileImage(
          userData.profileImage,
          authData.user.id,
        );

        if (uploadResult.success) {
          profileImageUrl = uploadResult.url;
          // console.log("프로필 이미지 업로드 성공");
        } else {
          // console.log("프로필 이미지 업로드 실패:", uploadResult.error);
          // 이미지 업로드 실패해도 회원가입은 계속 진행
        }
      }

      // 3. 프로필 정보 저장
      // console.log("프로필 저장 시도...");
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
        // console.log("프로필 저장 실패:", profileError);
        // console.log("에러 코드:", profileError.code);
        // console.log("에러 메시지:", profileError.message);

        // RLS 정책 관련 에러 메시지 개선
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

      // console.log("프로필 저장 성공:", profileData);

      return {
        success: true,
        data: authData,
        profile: profileData,
        message: "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
      };
    } catch (error) {
      // console.log("회원가입 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    setAuthLoading(true);
    try {
      localStorage.clear();
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        console.log("Supabase 로그아웃 오류:", error);
        throw error;
      }

      console.log("Supabase 로그아웃 성공");

      // 상태는 onAuthStateChange에서 자동으로 초기화됨

      // 홈페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

      return { success: true };
    } catch (error) {
      // console.log("로그아웃 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 강제 로그아웃 (디버깅용)
  const forceSignOut = async () => {
    // console.log("강제 로그아웃 시작...");

    try {
      // 1. 로컬 스토리지 클리어
      localStorage.clear();
      sessionStorage.clear();

      // 2. Supabase 세션 강제 종료
      await supabase.auth.signOut({ scope: "global" });

      // 3. 상태 강제 초기화
      setUser(null);
      setProfile(null);
      setLoading(false);
      setAuthLoading(false);

      // console.log("강제 로그아웃 완료");

      // 4. 페이지 새로고침으로 완전히 초기화
      window.location.href = "/";

      return { success: true };
    } catch (error) {
      // console.log("강제 로그아웃 실패:", error);
      return { success: false, error: error.message };
    }
  };

  // 프로필 업데이트
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

      // console.log("프로필 업데이트 성공:", data);

      // 프로필 다시 로드
      await loadUserProfile(user);

      return { success: true, data };
    } catch (error) {
      // console.log("프로필 업데이트 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 비밀번호 재설정 이메일 발송
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
      // console.log("비밀번호 재설정 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 프로필 강제 새로고침 (디버깅용)
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Context value
  const value = {
    // 상태
    user,
    setUser,
    profile,
    loading,
    authLoading,
    isLoggedIn: !!user,

    // 인증 상태 확인
    isAuthenticated: !!user,

    // 메서드
    signIn,
    signUp,
    signOut,
    forceSignOut,
    updateProfile,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes 정의
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
