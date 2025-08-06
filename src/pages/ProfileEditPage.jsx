// src/pages/ProfileEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserProfile, uploadProfileImage } from "../api/auth";
import { supabase } from "../api/supabaseClient";
import ProfileImage from "../components/user/ProfileImage";

const ProfileEditPage = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getCurrentUserProfile();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);
  const handleProfileUpdate = updatedData => {
    // 로컬 상태도 업데이트
    setProfile(prev => ({
      ...prev,
      ...updatedData,
    }));
  };
  const handleImageChange = async file => {
    if (!profile?.id) return;

    const { success, url } = await uploadProfileImage(file, profile.id);
    if (success) {
      await supabase
        .from("profiles")
        .update({
          profile_image_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", profile.id);
      setProfile(prev => ({ ...prev, profile_image_url: url }));
    }
  };

  const handleImageDelete = async () => {
    if (!profile?.profile_image_url) return;

    // 파일 경로 추출
    const filePath = profile.profile_image_url.split(
      "/storage/v1/object/public/profile-images/",
    )[1];

    // 1. Storage 파일 삭제
    const { error } = await supabase.storage
      .from("profile-images")
      .remove([filePath]);

    if (error) {
      alert("이미지 삭제 실패");
      return;
    }

    // 2. DB 이미지 URL 초기화
    await supabase
      .from("profiles")
      .update({ profile_image_url: null, updated_at: new Date().toISOString() })
      .eq("auth_user_id", profile.id);

    setProfile(prev => ({ ...prev, profile_image_url: null }));
  };

  const handleSave = () => {
    // 필요한 추가 저장 로직이 있다면 여기에 작성
    navigate("/profile");
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (!profile) return <p>로딩 중...</p>;

  return (
    <div className="profile-edit-page">
      <h2>프로필 편집</h2>

      <ProfileImage
        profile={profile}
        size={150}
        editable={true}
        onProfileUpdate={handleProfileUpdate}
        className="edit-mode"
      />

      <div className="edit-actions">
        <button onClick={handleImageDelete} className="delete-button">
          프로필 이미지 삭제
        </button>
        <button onClick={handleSave} className="save-button" disabled={saving}>
          저장
        </button>
        <button onClick={handleCancel} className="cancel-button">
          취소
        </button>
      </div>

      <style>{`
        .profile-edit-page {
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
          padding: 2rem;
        }
        .edit-actions {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .delete-button {
          background-color: #ef4444;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .save-button {
          background-color: #3b82f6;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .cancel-button {
          background-color: #d1d5db;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ProfileEditPage;
