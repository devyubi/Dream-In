/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import defaultProfileImage from "../../assets/images/unknown.svg";
import { useProfileImageUpload } from "../../hooks/useProfileImageUpload";

const ProfileImage = ({
  profile,
  size = 120,
  showDebugInfo = false,
  className = "",
  onClick = null,
  editable = false,
  onProfileUpdate = null,
  userId = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    profile?.profile_image_url,
  ); // 현재 이미지 URL 상태
  const { uploadProfileImage } = useProfileImageUpload();
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const actualUserId = userId || user?.id;

  // 프로필이 변경되면 currentImageUrl도 업데이트
  if (profile?.profile_image_url !== currentImageUrl && !uploading) {
    setCurrentImageUrl(profile?.profile_image_url);
  }

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file || !editable || !actualUserId) {
      console.log("업로드 조건 미충족:", {
        file: !!file,
        editable,
        actualUserId,
      });
      return;
    }

    setUploading(true);
    console.log("📸 이미지 업로드 시작:", file.name, "사용자ID:", actualUserId);

    // 파일을 미리 읽어서 즉시 UI에 표시
    const fileReader = new FileReader();
    fileReader.onload = e => {
      setCurrentImageUrl(e.target.result); // 업로드 중에도 새 이미지 표시
      setImageError(false);
      setImageLoading(false);
    };
    fileReader.readAsDataURL(file);

    try {
      const result = await uploadProfileImage(file, actualUserId);

      if (result.success) {
        console.log("🎉 업로드 성공! URL:", result.publicUrl);

        // 업로드 성공 시 실제 URL로 교체
        setCurrentImageUrl(result.publicUrl);

        // AuthContext의 프로필 새로고침
        await refreshProfile();

        // 부모 컴포넌트에 알림
        if (onProfileUpdate) {
          onProfileUpdate({ profile_image_url: result.publicUrl });
        }
      } else {
        console.error("업로드 실패:", result.error);
        // 업로드 실패 시 원래 이미지로 복구
        setCurrentImageUrl(profile?.profile_image_url);
        alert("이미지 업로드에 실패했습니다: " + result.error);
      }
    } catch (error) {
      console.error("업로드 중 예외:", error);
      // 오류 발생 시 원래 이미지로 복구
      setCurrentImageUrl(profile?.profile_image_url);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (editable && fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    } else if (onClick && !editable) {
      onClick();
    }
  };

  const hasValidImageUrl = currentImageUrl && !imageError;

  return (
    <div className={`profile-image-container ${className}`}>
      <div className="image-wrapper" style={{ position: "relative" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={uploading}
        />

        {uploading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: size + "px",
              height: size + "px",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color: "white",
              zIndex: 10,
              fontSize: "12px",
            }}
          >
            <div style={{ marginBottom: "5px" }}>📤</div>
            <div>업로드 중...</div>
          </div>
        )}

        {hasValidImageUrl ? (
          <>
            {imageLoading && (
              <div
                className="image-loading"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                <div className="loading-circle"></div>
              </div>
            )}
            <img
              src={currentImageUrl}
              alt={`${profile?.nickname || "사용자"}의 프로필`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={triggerFileInput}
              className="profile-image"
              style={{
                width: size,
                height: size,
                cursor: editable ? "pointer" : "default",
                borderRadius: "50%",
                objectFit: "cover",
                transition: "opacity 0.3s ease",
              }}
            />
          </>
        ) : (
          <img
            src={defaultProfileImage}
            alt="기본 프로필 이미지"
            onClick={triggerFileInput}
            className="profile-image"
            style={{
              width: size,
              height: size,
              cursor: editable ? "pointer" : "default",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
