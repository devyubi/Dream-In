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
    return null;
  }
};

// 소셜 로그인 사용자 프로필 자동 생성
export const createSocialUserProfile = async user => {
  try {
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
      return null;
    }

    return data;
  } catch (error) {
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
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInWithKakao = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        scopes: "profile_nickname profile_image account_email",
        redirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        }/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
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

export const getUserLoginType = user => {
  if (!user) return null;

  const socialProviders = user.identities?.filter(
    identity => identity.provider !== "email",
  );

  return socialProviders && socialProviders.length > 0 ? "social" : "email";
};

export const isSocialLoginUser = user => {
  return getUserLoginType(user) === "social";
};

// ===== 비밀번호 변경 함수(정리 버전) =====
// 중복 호출 제거, 에러/경고 로그를 console.log로 통일
export const changePassword = async (currentPassword, newPassword) => {
  try {
    console.log("=== 비밀번호 변경 시작 ===");

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.log("로그인 상태가 아닙니다.");
      return { success: false, error: "로그인이 필요합니다." };
    }

    // 한 번만 호출
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log("비밀번호 변경 실패:", error);
      return { success: false, error: error.message };
    }

    console.log("비밀번호 변경 성공:", data);
    return {
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    };
  } catch (error) {
    console.log("비밀번호 변경 중 예외 발생:", error);
    return {
      success: false,
      error: "비밀번호 변경 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 아이디(이메일) 찾기 함수
 */
export const findUserEmail = async (nickname, birthdate) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, nickname, birthdate, created_at")
      .eq("nickname", nickname)
      .eq("birthdate", birthdate)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
        };
      }
      console.log("아이디 찾기 에러:", error);
      return {
        success: false,
        error: "아이디 찾기 중 오류가 발생했습니다.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
      };
    }

    const maskedEmail = maskEmail(data.email);

    return {
      success: true,
      data: {
        email: data.email,
        maskedEmail: maskedEmail,
        nickname: data.nickname,
        joinDate: data.created_at,
      },
    };
  } catch (error) {
    console.log("아이디 찾기 중 예외 발생:", error);
    return {
      success: false,
      error: "아이디 찾기 중 오류가 발생했습니다.",
    };
  }
};

// 이메일 마스킹
const maskEmail = email => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  let maskedLocal;
  if (localPart.length <= 3) {
    maskedLocal = localPart[0] + "*".repeat(localPart.length - 1);
  } else {
    maskedLocal =
      localPart.slice(0, 2) +
      "*".repeat(localPart.length - 3) +
      localPart.slice(-1);
  }
  return `${maskedLocal}@${domain}`;
};

/**
 * 여러 계정이 있을 수 있는 경우
 */

export const findUserEmails = async (nickname, birthdate) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, nickname, birthdate, created_at")
      .eq("nickname", nickname)
      .eq("birthdate", birthdate);

    if (error) {
      console.log("아이디 찾기 에러:", error);
      return {
        success: false,
        error: "아이디 찾기 중 오류가 발생했습니다.",
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        error: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
      };
    }

    const accounts = data.map(account => ({
      email: account.email,
      maskedEmail: maskEmail(account.email),
      nickname: account.nickname,
      joinDate: account.created_at,
    }));

    return {
      success: true,
      data: accounts,
      count: accounts.length,
    };
  } catch (error) {
    console.log("아이디 찾기 중 예외 발생:", error);
    return {
      success: false,
      error: "아이디 찾기 중 오류가 발생했습니다.",
    };
  }
};
