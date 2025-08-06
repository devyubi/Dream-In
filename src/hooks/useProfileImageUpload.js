// src/hooks/useProfileImageUpload.js
import { supabase } from "../api/supabaseClient";

export const useProfileImageUpload = () => {
  const uploadProfileImage = async (file, userId) => {
    if (!file || !userId) {
      return { success: false, error: "파일 또는 유저 ID 없음" };
    }

    try {
      console.log("🚀 업로드 시작:", { fileName: file.name, userId });

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`; // 타임스탬프 추가로 캐시 문제 해결
      const filePath = `profiles/${fileName}`;

      // 🔼 1. 업로드
      const { data, error } = await supabase.storage
        .from("profile-images") // auth.js와 동일한 버킷 이름
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("이미지 업로드 실패:", error);
        return { success: false, error: error.message };
      }

      console.log("📤 업로드 성공:", data);

      // 🔗 2. public URL 가져오기
      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        return { success: false, error: "공개 URL 생성 실패" };
      }

      console.log("🔗 생성된 URL:", publicUrl);

      // 📝 3. profile 테이블 업데이트
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", userId); // auth_user_id로 수정!

      if (updateError) {
        console.error("프로필 업데이트 실패:", updateError);
        return { success: false, error: updateError.message };
      }

      console.log("✅ 프로필 업데이트 완료");
      return { success: true, publicUrl };
    } catch (error) {
      console.error("uploadProfileImage 예외:", error);
      return { success: false, error: error.message };
    }
  };

  return { uploadProfileImage };
};
