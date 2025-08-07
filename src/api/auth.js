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
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
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
// src/api/auth.js에 추가할 함수들

/**
 * 비밀번호 변경 함수
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    // 1. 현재 사용자 확인
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
      };
    }

    // 2. 현재 비밀번호로 재인증
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.user.email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "현재 비밀번호가 올바르지 않습니다.",
      };
    }

    // 3. 새 비밀번호로 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      };
    }

    return {
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    };
  } catch (error) {
    console.error("비밀번호 변경 중 오류:", error);
    return {
      success: false,
      error: "비밀번호 변경 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 아이디(이메일) 찾기 함수
 * @param {string} nickname - 사용자 닉네임
 * @param {string} birthdate - 생년월일 (YYYY-MM-DD 형식)
 * @returns {Object} 성공/실패 결과
 */
export const findUserEmail = async (nickname, birthdate) => {
  try {
    // 프로필 테이블에서 닉네임과 생년월일이 일치하는 사용자 조회
    const { data, error } = await supabase
      .from("profiles") // 프로필 테이블명 확인 필요
      .select("email, nickname, birthdate, created_at")
      .eq("nickname", nickname)
      .eq("birthdate", birthdate)
      .single(); // 단일 결과만 반환

    if (error) {
      if (error.code === "PGRST116") {
        // 데이터를 찾을 수 없는 경우
        return {
          success: false,
          error: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
        };
      }

      console.error("아이디 찾기 에러:", error);
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

    // 이메일 마스킹 처리 (선택사항 - 보안을 위해)
    const maskedEmail = maskEmail(data.email);

    return {
      success: true,
      data: {
        email: data.email, // 또는 maskedEmail 사용
        maskedEmail: maskedEmail,
        nickname: data.nickname,
        joinDate: data.created_at,
      },
    };
  } catch (error) {
    console.error("아이디 찾기 중 예외 발생:", error);
    return {
      success: false,
      error: "아이디 찾기 중 오류가 발생했습니다.",
    };
  }
};

/**
 * 이메일 마스킹 함수 (보안을 위해 일부 문자를 * 처리)
 * @param {string} email - 원본 이메일
 * @returns {string} 마스킹된 이메일
 */
const maskEmail = email => {
  if (!email) return "";

  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  // 로컬 파트 마스킹 (앞 2자리와 뒤 1자리만 보여주기)
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
 * 여러 계정이 있을 수 있는 경우를 위한 함수
 * @param {string} nickname - 사용자 닉네임
 * @param {string} birthdate - 생년월일
 * @returns {Object} 성공/실패 결과 (복수 결과 가능)
 */
export const findUserEmails = async (nickname, birthdate) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("email, nickname, birthdate, created_at")
      .eq("nickname", nickname)
      .eq("birthdate", birthdate);

    if (error) {
      console.error("아이디 찾기 에러:", error);
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

    // 여러 계정 처리
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
    console.error("아이디 찾기 중 예외 발생:", error);
    return {
      success: false,
      error: "아이디 찾기 중 오류가 발생했습니다.",
    };
  }
};
