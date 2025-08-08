// src/pages/ProfileEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProfileImageUpload } from "../hooks/useProfileImageUpload";
import ProfileImage from "../components/user/ProfileImage";

const ProfileEditPage = () => {
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user, profile, loading, isAuthenticated, reloadProfile } = useAuth();
  const { uploadProfileImage, deleteProfileImage } = useProfileImageUpload();
  const navigate = useNavigate();

  // Auth 부트가 끝났고 로그인 상태인데 profile이 없으면 한 번 더 불러오기
  useEffect(() => {
    if (!loading && isAuthenticated && !profile) {
      reloadProfile();
    }
  }, [loading, isAuthenticated, profile, reloadProfile]);

  // 보호 게이트: 부트 끝나고 비로그인이면 이동
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // 이미지 선택 핸들러
  const handleImageSelect = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setHasChanges(true);
    setIsDeleting(false);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      navigate("/profile");
      return;
    }
    if (!user?.id) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    setSaving(true);
    try {
      let result;
      if (isDeleting) {
        result = await deleteProfileImage(user.id);
      } else if (selectedFile) {
        result = await uploadProfileImage(selectedFile, user.id);
      } else {
        navigate("/profile");
        return;
      }

      if (result.success) {
        await reloadProfile(); // 저장 후 최신 프로필 동기화
        alert(
          isDeleting
            ? "프로필 이미지가 삭제되었습니다!"
            : "프로필 이미지가 업데이트되었습니다!",
        );
        navigate("/profile");
      } else {
        ("저장 실패:", result.error);
        alert("저장에 실패했습니다: " + result.error);
      }
    } catch (e) {
      ("저장 중 오류:", e);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      hasChanges &&
      !window.confirm("변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?")
    ) {
      return;
    }
    navigate("/profile");
  };

  const handleImageDelete = () => {
    if (window.confirm("프로필 이미지를 삭제하시겠습니까?")) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsDeleting(true);
      setHasChanges(true);
    }
  };

  // 초기 로딩 또는 프로필 아직 없음
  if (loading || (isAuthenticated && !profile)) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>로딩 중...</div>
    );
  }

  return (
    <div className="profile-edit-page">
      <h2>프로필 편집</h2>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <ProfileImage
          profile={profile}
          size={150}
          editable={true}
          onImageSelect={handleImageSelect}
          previewImage={isDeleting ? null : previewUrl}
          className="edit-mode"
        />

        {isDeleting && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#dc3545",
              fontWeight: "bold",
            }}
          >
            이미지가 삭제됩니다. 저장을 눌러주세요.
          </div>
        )}

        {previewUrl && !isDeleting && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#007bff",
              fontWeight: "bold",
            }}
          >
            새 이미지가 선택되었습니다. 저장을 눌러주세요.
          </div>
        )}
      </div>

      <div className="edit-actions">
        {(profile?.profile_image_url || previewUrl) && !isDeleting && (
          <button onClick={handleImageDelete} className="delete-button">
            프로필 이미지 삭제
          </button>
        )}

        <button
          onClick={handleSave}
          className="save-button"
          disabled={saving}
          style={{
            backgroundColor: hasChanges ? "#28a745" : "#6c757d",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "저장 중..." : hasChanges ? "변경사항 저장" : "저장"}
        </button>

        <button onClick={handleCancel} className="cancel-button">
          취소
        </button>
      </div>

      <style>{`
        .profile-edit-page { max-width: 400px; margin: 0 auto; text-align: center; padding: 2rem; }
        .edit-actions { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 10px; }
        .delete-button { background-color: #ef4444; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .save-button { color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; }
        .cancel-button { background-color: #6c757d; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .save-button:disabled { cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default ProfileEditPage;
