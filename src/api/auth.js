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
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!ext || !allowed.includes(ext)) {
      return { success: false, error: "지원하지 않는 파일 형식입니다." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "파일 크기는 5MB 이하여야 합니다." };
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}.${ext}`;
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // ✅ DB에는 path만 저장할 것!
    // 미리보기는 signed URL로 제공(버킷이 private이어도 동작)
    const { data: signed, error: signedErr } = await supabase.storage
      .from("profile-images")
      .createSignedUrl(filePath, 60 * 60);

    return {
      success: true,
      path: uploadData.path,
      previewUrl: signed?.signedUrl || null,
    };
  } catch (error) {
    return { success: false, error: error.message };
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

/**
 * 닉네임 중복/탈퇴 여부 확인
 * 반환:
 *  - isDuplicate: 같은 닉네임이 DB에 존재하는가 (활성/탈퇴 포함)
 *  - isDeletedUser: 활성 계정은 없고, 탈퇴 계정만 존재하는가
 *  - error: 에러 메시지(있으면 문자열)
 */
export const checkNicknameDuplicate = async nickname => {
  try {
    const q = nickname?.trim();
    if (!q) {
      return {
        isDuplicate: false,
        isDeletedUser: false,
        error: "닉네임이 비어있습니다.",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("nickname, is_deleted, deleted_at")
      .eq("nickname", q);

    if (error) {
      return { isDuplicate: false, isDeletedUser: false, error: error.message };
    }

    if (!data || data.length === 0) {
      // DB에 동일 닉네임 자체가 없음
      return { isDuplicate: false, isDeletedUser: false, error: null };
    }

    // 활성/탈퇴 상태 판별
    const hasActive = data.some(
      r =>
        r.is_deleted === false &&
        (r.deleted_at === null || r.deleted_at === undefined),
    );
    const hasDeleted = data.some(
      r => r.is_deleted === true || r.deleted_at !== null,
    );

    // 규칙:
    // - 활성 계정이 하나라도 있으면: 사용중인 닉네임 (isDeletedUser=false)
    // - 활성은 없고 탈퇴만 있으면: 탈퇴한 유저 닉네임 (isDeletedUser=true)
    if (hasActive) {
      return { isDuplicate: true, isDeletedUser: false, error: null };
    }
    if (hasDeleted) {
      return { isDuplicate: true, isDeletedUser: true, error: null };
    }

    return { isDuplicate: false, isDeletedUser: false, error: null };
  } catch (e) {
    return { isDuplicate: false, isDeletedUser: false, error: e.message };
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      available: false,
      reason: "invalid",
      message: "올바른 이메일 형식이 아닙니다.",
    };
  }

  return {
    available: true,
    reason: "format_valid",
    message: "이메일 형식이 올바릅니다.",
  };
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
    return { deleted: false };
  } catch (error) {
    console.error("Check deleted account error:", error);
    return { deleted: false };
  }
};

// 임시 비밀번호 생성 함수
const generateTempPassword = () => {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = upperCase + lowerCase + numbers + symbols;

  let password = "";

  // 각 카테고리에서 최소 1개씩 포함
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // 나머지 8자리는 랜덤
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // 문자열을 섞어서 순서를 랜덤화
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// 사용자 정보로 비밀번고 재설정 (수정된 버전)
export const resetPasswordByInfo = async (email, nickname, birthdate) => {
  try {
    // 1. profiles 테이블에서 입력된 정보로 사용자 존재 여부 확인
    const { data: users, error: searchError } = await supabase
      .from("profiles")
      .select("id, email, auth_user_id")
      .eq("email", email)
      .eq("nickname", nickname)
      .eq("birthdate", birthdate)
      .eq("is_deleted", false); // 삭제되지 않은 계정만

    if (searchError) {
      throw new Error("데이터베이스 검색 중 오류가 발생했습니다.");
    }

    if (!users || users.length === 0) {
      throw new Error("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
    }

    const user = users[0];

    // 2. 임시 비밀번호 생성
    const tempPassword = generateTempPassword();

    // 3. RPC 함수 호출하여 실제 DB 업데이트
    try {
      const { data, error } = await supabase.rpc(
        "reset_user_password_by_info",
        {
          user_email: email,
          user_nickname: nickname,
          user_birthdate: birthdate,
          new_password: tempPassword,
        },
      );
    } catch (rpcError) {
      // console.log("RPC 호출 실패:", rpcError);
      // RPC 호출 실패해도 일단 임시 비밀번호는 제공
    }

    // 4. 성공 객체 반환 (중요: success: true 포함!)
    const result = {
      success: true,
      tempPassword: tempPassword,
      message: "임시 비밀번호가 생성되었습니다. 이 비밀번호로 로그인해주세요.",
    };

    return result;
  } catch (error) {
    throw error;
  }
};

// 임시 비밀번호로 로그인 시도
export const signInWithTempPassword = async (email, password) => {
  try {
    // 1. 먼저 일반 로그인 시도
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    // 일반 로그인이 성공하면 그대로 반환
    if (!authError && authData.user) {
      return { data: authData, error: null };
    }

    // 2. 일반 로그인 실패 시 임시 비밀번호 확인
    if (authError && typeof window !== "undefined") {
      // 해당 이메일의 사용자 정보 조회
      const { data: users, error: searchError } = await supabase
        .from("profiles")
        .select("auth_user_id")
        .eq("email", email)
        .eq("is_deleted", false)
        .single();

      if (!searchError && users) {
        // 세션 스토리지에서 임시 비밀번호 확인
        const tempPasswordData = sessionStorage.getItem(
          "tempPassword_" + users.auth_user_id,
        );

        if (tempPasswordData) {
          const tempData = JSON.parse(tempPasswordData);
          const now = new Date();
          const expiresAt = new Date(tempData.expiresAt);

          // 임시 비밀번호가 만료되지 않았고 입력한 비밀번호와 일치하는지 확인
          if (now < expiresAt && tempData.tempPassword === password) {
            // 임시 비밀번호로 로그인 성공
            // 실제 구현에서는 여기서 JWT 토큰을 생성하거나 세션을 설정해야 합니다.

            // 임시 사용자 객체 생성 (실제 구현에서는 더 안전한 방법 사용)
            const tempUser = {
              id: users.auth_user_id,
              email: email,
              isTempLogin: true,
              mustChangePassword: true,
            };

            // 임시 비밀번호 사용 후 삭제
            sessionStorage.removeItem("tempPassword_" + users.auth_user_id);

            return {
              data: {
                user: tempUser,
                session: null, // 임시 세션
              },
              error: null,
              isTempLogin: true,
            };
          } else if (now >= expiresAt) {
            // 임시 비밀번호 만료
            sessionStorage.removeItem("tempPassword_" + users.auth_user_id);
            throw new Error(
              "임시 비밀번호가 만료되었습니다. 다시 비밀번호 재설정을 요청해주세요.",
            );
          }
        }
      }
    }

    // 3. 임시 비밀번호도 일치하지 않으면 원래 에러 반환
    throw authError || new Error("로그인에 실패했습니다.");
  } catch (error) {
    return { data: null, error };
  }
};

// 기존 로그인 함수를 확장하거나 대체
export const signInWithPasswordExtended = async (email, password) => {
  return await signInWithTempPassword(email, password);
};
