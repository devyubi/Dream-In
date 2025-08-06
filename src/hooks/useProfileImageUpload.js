// src/hooks/useProfileImageUpload.js
import { supabase } from "../api/supabaseClient";

export const useProfileImageUpload = () => {
  const uploadProfileImage = async (file, userId) => {
    if (!file || !userId) {
      return { success: false, error: "파일 또는 유저 ID 없음" };
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // 업로드
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // public URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        return { success: false, error: "공개 URL 생성 실패" };
      }

      // profile 테이블 업데이트
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true, publicUrl };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteProfileImage = async userId => {
    try {
      // DB에서 프로필 이미지 URL 제거
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          profile_image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", userId);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { uploadProfileImage, deleteProfileImage };
};
