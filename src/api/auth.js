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

    // 삭제된 계정인지 먼저 확인
    const { deleted } = await checkAccountDeleted(session.user.id);
    if (deleted) {
      // 삭제된 계정이면 로그아웃 처리
      await supabase.auth.signOut();
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .eq("is_deleted", false) // 삭제되지 않은 계정만
      .is("deleted_at", null) // 삭제 시간이 null인 계정만
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

    // eslint-disable-next-line
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
      .select("nickname, is_deleted, deleted_at")
      .eq("nickname", nickname)
      .eq("is_deleted", false) // 삭제되지 않은 계정만 중복 체크
      .is("deleted_at", null); // 삭제 시간이 null인 계정만

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
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // 한 번만 호출
    // eslint-disable-next-line
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    };
  } catch (error) {
    return {
      success: false,
      error: "비밀번호 변경 중 오류가 발생했습니다.",
    };
  }
};

// ===== 이메일 찾기 및 탈퇴 관련 함수들 =====

// 이메일 찾기 함수 (삭제된 계정 제외)
export const findEmailByInfo = async (nickname, birthDate) => {
  try {
    // profiles 테이블에서 닉네임과 생년월일로 이메일 찾기 (삭제되지 않은 계정만)
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("nickname", nickname)
      .eq("birthdate", birthDate)
      .eq("is_deleted", false) // 삭제되지 않은 계정만
      .is("deleted_at", null) // 삭제 시간이 null인 계정만
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // 데이터를 찾을 수 없음
      }
      throw error;
    }

    return data?.email || null;
  } catch (error) {
    throw error;
  }
};

// 탈퇴한 이메일인지 체크하는 함수
export const checkDeletedEmail = async email => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_deleted, deleted_at, email")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      // 프로필이 없는 경우 (사용 가능한 이메일)
      return { isDeleted: false, isExisting: false };
    }

    if (error) {
      throw error;
    }

    // 삭제된 계정인지 확인
    if (data?.is_deleted || data?.deleted_at) {
      return { isDeleted: true, isExisting: true };
    }

    // 활성 계정이 존재하는 경우
    return { isDeleted: false, isExisting: true };
  } catch (error) {
    throw error;
  }
};

// 이메일 사용 가능 여부 종합 체크 함수
export const checkEmailAvailability = async email => {
  try {
    const { isDeleted, isExisting } = await checkDeletedEmail(email);

    if (isDeleted) {
      return {
        available: false,
        reason: "deleted",
        message: "탈퇴한 유저 이메일입니다.",
      };
    }

    if (isExisting) {
      return {
        available: false,
        reason: "existing",
        message: "이미 가입된 이메일입니다.",
      };
    }

    return {
      available: true,
      reason: "available",
      message: "사용 가능한 이메일입니다.",
    };
  } catch (error) {
    return {
      available: false,
      reason: "error",
      message: "이메일 확인 중 오류가 발생했습니다.",
    };
  }
};

// 회원탈퇴 함수 (소프트 삭제 - 이메일/닉네임 보존)
export const deleteAccount = async userId => {
  try {
    // 1. profiles 테이블에서 소프트 삭제 처리 (이메일/닉네임은 보존)
    const timestamp = new Date().toISOString();

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        is_deleted: true,
        deleted_at: timestamp,
        // ✅ 이메일과 닉네임은 그대로 보존
        // email: email 그대로 유지
        // nickname: nickname 그대로 유지

        // 문제없으면 아래 전부 주석 제거

        // 개인정보만 제거
        // profile_image_url: null,
        // gender: null,
        // 추가로 제거할 개인정보가 있다면 여기에 추가
      })
      .eq("auth_user_id", userId);

    if (profileError) {
      throw profileError;
    }

    // 2. 관련 데이터도 소프트 삭제 (필요한 테이블들 추가)
    try {
      // dreams 테이블이 있다면 소프트 삭제
      const { error: dreamError } = await supabase
        .from("dreams")
        .update({
          is_deleted: true,
          deleted_at: timestamp,
        })
        .eq("user_id", userId);

      if (dreamError && dreamError.code !== "PGRST116") {
      }
    } catch (err) {}

    // 3. 현재 세션에서 로그아웃
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};

// 삭제된 계정 체크 함수
export const checkAccountDeleted = async userId => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_deleted, deleted_at")
      .eq("auth_user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // 프로필이 없는 경우
      return { deleted: true, reason: "profile_not_found" };
    }

    if (error) {
      throw error;
    }

    // 삭제된 계정인지 확인
    if (data?.is_deleted || data?.deleted_at) {
      return { deleted: true, reason: "soft_deleted" };
    }

    return { deleted: false };
  } catch (error) {
    throw error;
  }
};
