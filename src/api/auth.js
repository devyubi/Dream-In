// src/api/auth.js

import { supabase } from "./supabaseClient";

// ✅ 현재 로그인된 사용자의 프로필 정보 불러오기
export const getCurrentUserProfile = async () => {
  try {
    console.log("🔍 getCurrentUserProfile 시작...");

    // 1. 현재 사용자 세션 확인
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ 세션 조회 실패:", sessionError);
      return null;
    }

    if (!session?.user) {
      console.warn("⚠️ 세션 또는 사용자 정보 없음");
      return null;
    }

    console.log("✅ 사용자 세션 확인:", session.user.email);

    // 2. 프로필 정보 조회 (테이블명을 profiles로 통일)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", session.user.id)
      .maybeSingle(); // single() 대신 maybeSingle() 사용

    if (profileError) {
      console.error("❌ 프로필 조회 실패:", profileError);
      console.error("에러 코드:", profileError.code);
      console.error("에러 메시지:", profileError.message);
      return null;
    }

    if (!profile) {
      console.warn("⚠️ 프로필 데이터가 없습니다. 사용자 ID:", session.user.id);
      return null;
    }

    console.log("✅ 프로필 조회 성공:", profile.nickname);

    // 3. auth.users 정보와 profiles 정보 결합
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
    console.error("❌ getCurrentUserProfile 예외 발생:", error);
    return null;
  }
};

// 프로필 이미지 업로드 함수
export const uploadProfileImage = async (file, userId) => {
  try {
    console.log("📸 프로필 이미지 업로드 시작...");

    // 파일 확장자 추출
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Storage에 업로드
    // eslint-disable-next-line no-unused-vars
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // 덮어쓰기 허용
      });

    if (error) {
      console.error("❌ 이미지 업로드 실패:", error);
      throw error;
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    console.log("✅ 이미지 업로드 성공:", publicUrl);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("❌ uploadProfileImage 실패:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// 이메일 유효성 검사
export const validateEmail = email => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 비밀번호 유효성 검사
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

// 닉네임 유효성 검사
export const validateNickname = nickname => {
  const re = /^[a-zA-Z0-9가-힣_-]{2,20}$/;
  const isValid = re.test(nickname);
  return {
    isValid,
    errors: isValid ? [] : ["닉네임 형식이 올바르지 않습니다."],
  };
};

// 생년월일 유효성 검사 (yyyy-mm-dd)
export const validateBirthdate = birthdate => {
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(birthdate);
  return {
    isValid,
    errors: isValid ? [] : ["생년월일 형식이 올바르지 않습니다."],
  };
};

// 닉네임 중복 확인
export const checkNicknameDuplicate = async nickname => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("nickname", nickname);

    if (error) {
      console.error("❌ 닉네임 중복 확인 실패:", error);
      return { isDuplicate: false, error: error.message };
    }

    return {
      isDuplicate: data && data.length > 0,
      error: null,
    };
  } catch (error) {
    console.error("❌ checkNicknameDuplicate 예외:", error);
    return { isDuplicate: false, error: error.message };
  }
};
