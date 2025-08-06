// src/services/userService.js
import { supabase } from "../api/supabaseClient";
import {
  withErrorHandling,
  withTimeout,
  withRetry,
} from "../utils/errorHandler";

/**
 * 사용자 프로필 관련 서비스 클래스
 */
export class UserService {
  /**
   * 현재 사용자 프로필 조회
   * @returns {Promise<object>}
   */
  static getCurrentUserProfile = withErrorHandling(async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    const { data: profile, error: profileError } = await withTimeout(
      supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", session.user.id)
        .maybeSingle(),
      5000,
    );

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return { success: true, profile: null };
    }

    // auth.users 정보와 profiles 정보 결합
    const combinedProfile = {
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

    return {
      success: true,
      profile: combinedProfile,
    };
  }, "UserService.getCurrentUserProfile");

  /**
   * 프로필 생성
   * @param {object} profileData
   * @returns {Promise<object>}
   */
  static createProfile = withErrorHandling(async profileData => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        auth_user_id: profileData.auth_user_id,
        email: profileData.email,
        nickname: profileData.nickname,
        birthdate: profileData.birthdate || null,
        gender: profileData.gender || null,
        profile_image_url: profileData.profile_image_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (
        error.code === "42501" ||
        error.message?.includes("row-level security")
      ) {
        throw new Error(
          "프로필 생성 권한이 없습니다. RLS 정책을 확인해주세요.",
        );
      }
      throw error;
    }

    return {
      success: true,
      profile: data,
    };
  }, "UserService.createProfile");

  /**
   * 소셜 로그인 사용자 프로필 자동 생성
   * @param {object} user
   * @returns {Promise<object>}
   */
  static createSocialUserProfile = withErrorHandling(async user => {
    const userMetadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};

    let nickname = null;
    let profileImageUrl = null;

    // 제공자별 정보 추출
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
      throw error;
    }

    return {
      success: true,
      profile: data,
    };
  }, "UserService.createSocialUserProfile");

  /**
   * 프로필 업데이트
   * @param {string} userId
   * @param {object} updateData
   * @returns {Promise<object>}
   */
  static updateProfile = withErrorHandling(async (userId, updateData) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        nickname: updateData.nickname,
        birthdate: updateData.birthdate,
        gender: updateData.gender,
        profile_image_url: updateData.profile_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      success: true,
      profile: data,
    };
  }, "UserService.updateProfile");

  /**
   * 닉네임 중복 확인
   * @param {string} nickname
   * @returns {Promise<object>}
   */
  static checkNicknameDuplicate = withErrorHandling(async nickname => {
    const { data, error } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("nickname", nickname);

    if (error) {
      throw error;
    }

    return {
      success: true,
      isDuplicate: data && data.length > 0,
    };
  }, "UserService.checkNicknameDuplicate");

  /**
   * 사용자 검색 (관리자 기능)
   * @param {object} searchParams
   * @returns {Promise<object>}
   */
  static searchUsers = withErrorHandling(async searchParams => {
    const { query, limit = 10, offset = 0 } = searchParams;

    let supabaseQuery = supabase
      .from("profiles")
      .select("id, nickname, email, created_at, profile_image_url")
      .range(offset, offset + limit - 1);

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `nickname.ilike.%${query}%,email.ilike.%${query}%`,
      );
    }

    const { data, error, count } = await supabaseQuery;

    if (error) {
      throw error;
    }

    return {
      success: true,
      users: data || [],
      totalCount: count || 0,
    };
  }, "UserService.searchUsers");

  /**
   * 프로필 삭제
   * @param {string} userId
   * @returns {Promise<object>}
   */
  static deleteProfile = withErrorHandling(async userId => {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("auth_user_id", userId);

    if (error) {
      throw error;
    }

    return { success: true };
  }, "UserService.deleteProfile");
}

/**
 * 파일 업로드 서비스 클래스
 */
export class FileUploadService {
  /**
   * 프로필 이미지 업로드
   * @param {File} file
   * @param {string} userId
   * @returns {Promise<object>}
   */
  static uploadProfileImage = withRetry(
    withErrorHandling(async (file, userId) => {
      if (!file) {
        throw new Error("업로드할 파일이 없습니다.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // 파일 업로드
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // 공개 URL 생성
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
        fileName: fileName,
      };
    }, "FileUploadService.uploadProfileImage"),
    3,
    1000,
  );

  /**
   * 파일 삭제
   * @param {string} filePath
   * @returns {Promise<object>}
   */
  static deleteFile = withErrorHandling(async filePath => {
    const { error } = await supabase.storage
      .from("profile-images")
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  }, "FileUploadService.deleteFile");

  /**
   * 파일 목록 조회
   * @param {string} folder
   * @returns {Promise<object>}
   */
  static listFiles = withErrorHandling(async (folder = "profiles") => {
    const { data, error } = await supabase.storage
      .from("profile-images")
      .list(folder, {
        limit: 100,
        offset: 0,
      });

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data || [],
    };
  }, "FileUploadService.listFiles");

  /**
   * 파일 URL 생성
   * @param {string} filePath
   * @returns {Promise<object>}
   */
  static getFileUrl = withErrorHandling(async filePath => {
    const {
      data: { publicUrl },
      error,
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    if (error) {
      throw error;
    }

    return {
      success: true,
      url: publicUrl,
    };
  }, "FileUploadService.getFileUrl");

  /**
   * 서명된 URL 생성 (임시 접근용)
   * @param {string} filePath
   * @param {number} expiresIn - 초 단위
   * @returns {Promise<object>}
   */
  static createSignedUrl = withErrorHandling(
    async (filePath, expiresIn = 3600) => {
      const { data, error } = await supabase.storage
        .from("profile-images")
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw error;
      }

      return {
        success: true,
        signedUrl: data.signedUrl,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      };
    },
    "FileUploadService.createSignedUrl",
  );
}

/**
 * 사용자 통계 서비스 클래스
 */
export class UserStatsService {
  /**
   * 사용자 활동 통계 조회
   * @param {string} userId
   * @returns {Promise<object>}
   */
  static getUserStats = withErrorHandling(async userId => {
    // 프로필 정보 조회
    const profileResult = await UserService.getCurrentUserProfile();

    if (!profileResult.success || !profileResult.profile) {
      throw new Error("사용자 프로필을 찾을 수 없습니다.");
    }

    const profile = profileResult.profile;
    const joinDate = new Date(profile.created_at);
    const daysSinceJoin = Math.floor(
      (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // 기본 통계 반환 (추후 확장 가능)
    const stats = {
      joinDate: profile.created_at,
      daysSinceJoin,
      lastLoginAt: profile.last_sign_in_at,
      profileCompleteness: this.calculateProfileCompleteness(profile),
      // 추후 꿈 일기, 분석 등의 통계 추가 가능
    };

    return {
      success: true,
      stats,
    };
  }, "UserStatsService.getUserStats");
}
