/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import defaultProfileImage from "../../assets/images/unknown.svg";

const ProfileImage = ({
  profile,
  size = 120,
  showDebugInfo = false,
  className = "",
  onClick = null,
  editable = false,
  onImageSelect = null, // 이미지 선택 콜백 (실제 업로드 X)
  previewImage = null, // 미리보기 이미지
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

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
    if (!file || !editable) {
      return;
    }

    console.log("📸 이미지 선택:", file.name);

    // 파일을 미리보기용으로 읽기
    const fileReader = new FileReader();
    fileReader.onload = e => {
      if (onImageSelect) {
        onImageSelect(file, e.target.result); // 파일과 미리보기 URL 전달
      }
      setImageError(false);
      setImageLoading(false);
    };
    fileReader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (onClick && !editable) {
      onClick();
    }
  };

  // 미리보기 이미지가 있으면 우선 표시, 없으면 기존 프로필 이미지
  const displayImage = previewImage || profile?.profile_image_url;
  const hasValidImageUrl = displayImage && !imageError;

  return (
    <div className={`profile-image-container ${className}`}>
      <div
        className="image-wrapper"
        style={{ position: "relative", display: "inline-block" }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

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
              src={displayImage}
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
                border: previewImage ? "3px solid #007bff" : "none", // 미리보기일 때 파란 테두리
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

        {/* 미리보기 상태 표시 */}
        {previewImage && (
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#007bff",
              color: "white",
              padding: "2px 8px",
              borderRadius: "10px",
              fontSize: "10px",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            미리보기
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
