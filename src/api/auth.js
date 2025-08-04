// src/api/auth.js
import { supabase } from "./supabaseClient";

// ===== 프로필 관련 함수들 =====

export const getCurrentUserProfile = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return null;
    }

    return {
      // auth.users 정보
      id: session.user.id,
      email: session.user.email,
      email_confirmed_at: session.user.email_confirmed_at,
      created_at: session.user.created_at,
      updated_at: session.user.updated_at,
      last_sign_in_at: session.user.last_sign_in_at,
      app_metadata: session.user.app_metadata,
      user_metadata: session.user.user_metadata,
      // profiles 정보
      profile_id: profile.id,
      nickname: profile.nickname,
      birthdate: profile.birthdate,
      gender: profile.gender,
      profile_image_url: profile.profile_image_url,
      profile_created_at: profile.created_at,
      profile_updated_at: profile.updated_at,
    };
  } catch (error) {
    console.error("getCurrentUserProfile 예외:", error);
    return null;
  }
};

// 소셜 로그인 사용자 프로필 자동 생성
export const createSocialUserProfile = async user => {
  try {
    console.log("=== 소셜 로그인 사용자 프로필 생성 ===");

    const userMetadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};

    let nickname = null;
    let profileImageUrl = null;

    if (appMetadata.provider === "google") {
      nickname =
        userMetadata.full_name || userMetadata.name || user.email.split("@")[0];
      profileImageUrl = userMetadata.picture || userMetadata.avatar_url;
    } else if (appMetadata.provider === "kakao") {
      nickname =
        userMetadata.name || userMetadata.nickname || user.email.split("@")[0];
      profileImageUrl = userMetadata.picture || userMetadata.avatar_url;
    } else {
      nickname = user.email.split("@")[0];
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          auth_user_id: user.id,
          email: user.email,
          nickname: nickname,
          profile_image_url: profileImageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "auth_user_id",
        },
      )
      .select()
      .single();

    if (error) {
      console.error("소셜 프로필 생성 실패:", error);
      return null;
    }

    console.log("소셜 프로필 생성/업데이트 성공:", data);
    return data;
  } catch (error) {
    console.error("소셜 프로필 생성 예외:", error);
    return null;
  }
};

// ===== 파일 업로드 함수 =====

export const uploadProfileImage = async (file, userId) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("uploadProfileImage 실패:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ===== 소셜 로그인 함수들 =====

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "profile email",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("구글 로그인 에러:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("구글 로그인 예외:", error);
    return { success: false, error: error.message };
  }
};

export const signInWithKakao = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        scopes: "profile_nickname profile_image account_email",
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("카카오 로그인 에러:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("카카오 로그인 예외:", error);
    return { success: false, error: error.message };
  }
};

// ===== 유효성 검사 함수들 =====

export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = password => {
  const errors = [];
  if (password.length < 6) {
    errors.push("비밀번호는 6자 이상이어야 합니다.");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateNickname = nickname => {
  const re = /^[a-zA-Z0-9가-힣_-]{2,20}$/;
  const isValid = re.test(nickname);
  return {
    isValid,
    errors: isValid ? [] : ["닉네임 형식이 올바르지 않습니다."],
  };
};

export const validateBirthdate = birthdate => {
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(birthdate);
  return {
    isValid,
    errors: isValid ? [] : ["생년월일 형식이 올바르지 않습니다."],
  };
};

export const checkNicknameDuplicate = async nickname => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("nickname", nickname);

    if (error) {
      return { isDuplicate: false, error: error.message };
    }

    return {
      isDuplicate: data && data.length > 0,
      error: null,
    };
  } catch (error) {
    return { isDuplicate: false, error: error.message };
  }
};
