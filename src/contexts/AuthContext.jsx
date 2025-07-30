// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../api/supabaseClient";
import { getCurrentUserProfile } from "../api/auth";

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

  // 초기 로드 시 사용자 세션 확인
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log("🔍 초기 세션 확인 시작...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ 세션 확인 오류:", error);
          // 세션 오류 시 상태 초기화
          setUser(null);
          setProfile(null);
          return;
        }

        console.log("📊 세션 상태:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          hasAccessToken: !!session?.access_token,
          hasRefreshToken: !!session?.refresh_token,
          expiresAt: session?.expires_at
            ? new Date(session.expires_at * 1000).toLocaleString()
            : "N/A",
        });

        if (session?.user && session?.access_token) {
          console.log("✅ 유효한 세션 발견:", session.user.email);
          setUser(session.user);

          // 프로필 정보 로드
          const profileData = await getCurrentUserProfile();
          setProfile(profileData);
        } else {
          console.warn("⚠️ 유효하지 않은 세션 - 상태 초기화");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("❌ 초기 세션 로드 실패:", error);
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
      console.log("🔄 Auth 상태 변경:", event, session?.user?.email);
      console.log("📊 세션 상세:", {
        event,
        hasUser: !!session?.user,
        hasAccessToken: !!session?.access_token,
        userId: session?.user?.id?.slice(0, 8) + "...",
      });

      if (event === "SIGNED_OUT" || !session?.user || !session?.access_token) {
        console.log("🚪 로그아웃 또는 무효한 세션 - 상태 초기화");
        setUser(null);
        setProfile(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        console.log("🔑 로그인 또는 토큰 갱신 - 프로필 로드");
        setUser(session.user);
        // 프로필 정보 로드
        const profileData = await getCurrentUserProfile();
        setProfile(profileData);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 로그인
  const signIn = async (email, password) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("로그인 성공:", data.user?.email);

      // 프로필 정보 로드
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);

      return { success: true, data };
    } catch (error) {
      console.error("로그인 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 회원가입
  const signUp = async userData => {
    setAuthLoading(true);
    try {
      console.log("🎯 회원가입 시작:", userData.email);

      // 1. Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error("❌ Auth 회원가입 실패:", authError);
        throw authError;
      }

      console.log("✅ Auth 회원가입 성공:", authData.user.id);

      // 2. 잠시 대기 (세션 안정화)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 3. 현재 세션 확인
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("현재 세션 상태:", session?.user?.id || "no session");

      // 4. 프로필 이미지 업로드 (있다면)
      let profileImageUrl = null;
      if (userData.profileImage) {
        console.log("📸 프로필 이미지 업로드 시작...");
        const { uploadProfileImage } = await import("../api/auth");
        const uploadResult = await uploadProfileImage(
          userData.profileImage,
          authData.user.id,
        );

        if (uploadResult.success) {
          profileImageUrl = uploadResult.url;
          console.log("✅ 프로필 이미지 업로드 성공");
        } else {
          console.warn("⚠️ 프로필 이미지 업로드 실패:", uploadResult.error);
          // 이미지 업로드 실패해도 회원가입은 계속 진행
        }
      }

      // 5. 프로필 정보 저장
      console.log("👤 프로필 저장 시도...");
      const { data: profileData, error: profileError } = await supabase
        .from("users")
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
        console.error("❌ 프로필 저장 실패:", profileError);
        console.error("에러 코드:", profileError.code);
        console.error("에러 메시지:", profileError.message);
        throw profileError;
      }

      console.log("✅ 프로필 저장 성공:", profileData);

      return {
        success: true,
        data: authData,
        profile: profileData,
        message: "회원가입이 완료되었습니다.",
      };
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);

      // RLS 에러인지 확인
      if (error.message?.includes("row-level security")) {
        return {
          success: false,
          error: "RLS 정책 오류입니다. SQL 정책을 확인해주세요.",
        };
      }

      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    setAuthLoading(true);
    try {
      console.log("🚪 로그아웃 시작...");
      console.log("현재 사용자:", user?.email);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ Supabase 로그아웃 오류:", error);
        throw error;
      }

      console.log("✅ Supabase 로그아웃 성공");

      // 상태 강제 초기화
      setUser(null);
      setProfile(null);

      console.log("✅ 로컬 상태 초기화 완료");

      return { success: true };
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // 강제 로그아웃 (디버깅용)
  const forceSignOut = async () => {
    console.log("🔥 강제 로그아웃 시작...");

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

      console.log("✅ 강제 로그아웃 완료");

      // 4. 페이지 새로고침
      window.location.href = "/login";

      return { success: true };
    } catch (error) {
      console.error("❌ 강제 로그아웃 실패:", error);
      return { success: false, error: error.message };
    }
  };

  // 프로필 업데이트
  const updateProfile = async profileData => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
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

      console.log("프로필 업데이트 성공:", data);
      setProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
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
      console.error("비밀번호 재설정 실패:", error);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Context value
  const value = {
    // 상태
    user,
    profile,
    loading,
    authLoading,

    // 인증 상태 확인
    isAuthenticated: !!user,

    // 메서드
    signIn,
    signUp,
    signOut,
    forceSignOut,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypes 정의
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
