// src/api/auth.js
import { supabase } from "./supabaseClient";

// =================================================
// 사용자 프로필 관련 함수들
// =================================================

/**
 * 현재 로그인된 사용자의 완전한 프로필 정보 조회
 */
export const getCurrentUserProfile = async () => {
  try {
    console.log("🔍 getCurrentUserProfile 시작...");

    // 1. 현재 인증된 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("❌ Auth 사용자 확인 실패:", authError);
      throw new Error(`인증 확인 실패: ${authError.message}`);
    }

    if (!user) {
      console.warn("⚠️ 로그인된 사용자가 없습니다");
      return null;
    }

    console.log("✅ Auth 사용자 확인:", user.id, user.email);

    // 2. public.users에서 프로필 정보 조회
    console.log("🔍 public.users 테이블 조회 시도...");
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(
        `
        id,
        auth_user_id,
        email,
        nickname,
        birthdate,
        gender,
        profile_image_url,
        created_at,
        updated_at
      `,
      )
      .eq("auth_user_id", user.id)
      .single();

    if (profileError) {
      console.error("❌ 프로필 조회 실패:", profileError);

      // 프로필이 없는 경우 (회원가입 미완료)
      if (profileError.code === "PGRST116") {
        console.warn("⚠️ 프로필 데이터가 존재하지 않습니다 (PGRST116)");

        // 추가 디버깅: 직접 count 조회
        const { data: countData, error: countError } = await supabase
          .from("users")
          .select("count")
          .eq("auth_user_id", user.id);

        console.log("📊 프로필 개수 확인:", countData, countError);
        return null;
      }

      // RLS 정책 문제인지 확인
      if (profileError.message?.includes("row-level security")) {
        console.error("🔒 RLS 정책 문제:", profileError.message);
        throw new Error("접근 권한이 없습니다. RLS 정책을 확인해주세요.");
      }

      throw profileError;
    }

    if (!profile) {
      console.warn("⚠️ 프로필 데이터가 null입니다");
      return null;
    }

    console.log("✅ 프로필 조회 성공:", profile.nickname);

    // 3. auth 정보와 프로필 정보 결합
    const combinedProfile = {
      ...user, // auth 정보 (id, email, email_confirmed_at 등)
      ...profile, // 프로필 정보 (nickname, birthdate, gender 등)
    };

    console.log("✅ getCurrentUserProfile 완료");
    return combinedProfile;
  } catch (error) {
    console.error("❌ getCurrentUserProfile 실패:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return null;
  }
};

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfile = async profileData => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

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

    if (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error;
    }

    console.log("✅ 프로필 업데이트 성공:", data);
    return { success: true, data };
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 닉네임 중복 확인
 */
export const checkNicknameDuplicate = async nickname => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("nickname")
      .eq("nickname", nickname)
      .limit(1);

    if (error) {
      console.error("닉네임 중복 확인 실패:", error);
      throw error;
    }

    console.log(
      "닉네임 중복 확인 결과:",
      data?.length > 0 ? "중복됨" : "사용 가능",
    );

    return {
      isDuplicate: data.length > 0,
      available: data.length === 0,
    };
  } catch (error) {
    console.error("닉네임 중복 확인 실패:", error);
    return { isDuplicate: false, available: false, error: error.message };
  }
};

// =================================================
// 프로필 이미지 관련 함수들
// =================================================

/**
 * 프로필 이미지 업로드
 */
export const uploadProfileImage = async (file, userId = null) => {
  try {
    if (!file) {
      throw new Error("파일이 선택되지 않았습니다.");
    }

    console.log("📸 프로필 이미지 업로드 시작:", file.name);

    // 파일 확장자 확인
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "지원되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)",
      );
    }

    // 파일 크기 확인 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("파일 크기는 5MB 이하여야 합니다.");
    }

    // 현재 사용자 ID 가져오기
    let actualUserId = userId;
    if (!actualUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }
      actualUserId = user.id;
    }

    // 파일명 생성 (사용자 ID를 폴더로 사용)
    const fileExt = file.name.split(".").pop();
    const fileName = `${actualUserId}/profile_${Date.now()}.${fileExt}`;

    console.log("📁 업로드 경로:", fileName);

    // 파일 업로드
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Storage 업로드 실패:", error);
      throw error;
    }

    console.log("✅ Storage 업로드 성공:", data.path);

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(fileName);

    console.log("🔗 공개 URL 생성:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("❌ 프로필 이미지 업로드 실패:", error);

    // Storage RLS 에러인지 확인
    if (error.message?.includes("row-level security")) {
      return {
        success: false,
        error: "Storage 권한 오류입니다. 관리자에게 문의하세요.",
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 기존 프로필 이미지 삭제
 */
export const deleteProfileImage = async imagePath => {
  try {
    if (!imagePath) return { success: true };

    // URL에서 파일 경로 추출
    const pathMatch = imagePath.match(/profile-images\/(.+)$/);
    if (!pathMatch) {
      throw new Error("잘못된 이미지 경로입니다.");
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from("profile-images")
      .remove([filePath]);

    if (error) {
      console.error("이미지 삭제 실패:", error);
      throw error;
    }

    console.log("✅ 이미지 삭제 성공:", filePath);
    return { success: true };
  } catch (error) {
    console.error("프로필 이미지 삭제 실패:", error);
    return { success: false, error: error.message };
  }
};

// =================================================
// 인증 관련 유틸리티 함수들
// =================================================

/**
 * 이메일 형식 검증
 */
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = password => {
  const errors = [];

  if (password.length < 8) {
    errors.push("비밀번호는 8자 이상이어야 합니다.");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("소문자를 포함해야 합니다.");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("대문자를 포함해야 합니다.");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("숫자를 포함해야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 닉네임 유효성 검증
 */
export const validateNickname = nickname => {
  const errors = [];

  if (!nickname || nickname.trim().length === 0) {
    errors.push("닉네임을 입력해주세요.");
  }

  if (nickname.length < 2) {
    errors.push("닉네임은 2자 이상이어야 합니다.");
  }

  if (nickname.length > 20) {
    errors.push("닉네임은 20자 이하여야 합니다.");
  }

  // 특수문자 제한 (한글, 영문, 숫자, 일부 특수문자만 허용)
  const nicknameRegex = /^[가-힣a-zA-Z0-9_-]+$/;
  if (!nicknameRegex.test(nickname)) {
    errors.push("닉네임은 한글, 영문, 숫자, _, - 만 사용 가능합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 생년월일 유효성 검증
 */
export const validateBirthdate = birthdate => {
  if (!birthdate) return { isValid: true, errors: [] };

  const errors = [];
  const birth = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();

  if (isNaN(birth.getTime())) {
    errors.push("올바른 날짜 형식이 아닙니다.");
  }

  if (birth > today) {
    errors.push("미래 날짜는 선택할 수 없습니다.");
  }

  if (age > 120) {
    errors.push("올바른 생년월일을 입력해주세요.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// =================================================
// 개발용 유틸리티 (프로덕션에서는 제거)
// =================================================

/**
 * Supabase 연결 테스트
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Supabase 연결 실패:", error.message);
      return false;
    } else {
      console.log(
        "✅ Supabase 연결 성공!",
        data ? `데이터 ${data.length}개 확인` : "",
      );
      return true;
    }
  } catch (err) {
    console.error("❌ 연결 테스트 중 오류:", err);
    return false;
  }
};
