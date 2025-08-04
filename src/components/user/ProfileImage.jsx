// src/components/user/ProfileImage.jsx
import React, { useState } from "react";

/* eslint-disable react/prop-types */
const ProfileImage = ({
  profile,
  size = 120,
  showDebugInfo = false,
  className = "",
  onClick = null,
  editable = false,
  onImageChange = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = e => {
    console.warn("프로필 이미지 로드 실패:", profile?.profile_image_url);
    setImageError(true);
    setImageLoading(false);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  const hasValidImageUrl = profile?.profile_image_url && !imageError;

  return (
    <div className={`profile-image-container ${className}`}>
      <div className="image-wrapper">
        {hasValidImageUrl ? (
          <>
            {imageLoading && (
              <div className="image-loading">
                <div className="loading-circle"></div>
              </div>
            )}
            <img
              src={profile.profile_image_url}
              alt={`${profile.nickname || "사용자"}의 프로필`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={onClick}
              className="profile-image"
              style={{
                display: imageLoading ? "none" : "block",
              }}
            />
          </>
        ) : (
          <div className="default-profile-image" onClick={onClick}>
            <span className="default-icon">👤</span>
          </div>
        )}

        {/* 편집 가능한 경우 파일 업로드 버튼 */}
        {editable && (
          <div className="edit-overlay">
            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="profile-image-input"
              className="edit-button"
              title="프로필 이미지 변경"
            >
              📷
            </label>
          </div>
        )}
      </div>

      {/* 디버깅 정보 (개발 모드에서만 표시) */}
      {showDebugInfo && (
        <div className="debug-info">
          <p>
            <strong>이미지 URL:</strong> {profile?.profile_image_url || "없음"}
          </p>
          <p>
            <strong>상태:</strong>{" "}
            {imageError ? "로드 실패" : imageLoading ? "로딩 중" : "로드 완료"}
          </p>
          <p>
            <strong>크기:</strong> {size}px
          </p>
        </div>
      )}

      <style>{`
        .profile-image-container {
          position: relative;
          display: inline-block;
        }

        .image-wrapper {
          position: relative;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          overflow: hidden;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #e5e7eb;
          cursor: ${onClick ? "pointer" : "default"};
          transition: all 0.2s ease;
        }

        .profile-image:hover {
          ${onClick ? "border-color: #3b82f6;" : ""}
        }

        .default-profile-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 3px solid #e5e7eb;
          cursor: ${onClick ? "pointer" : "default"};
          transition: all 0.2s ease;
        }

        .default-profile-image:hover {
          ${onClick ? "border-color: #3b82f6; transform: scale(1.02);" : ""}
        }

        .default-icon {
          font-size: ${size * 0.4}px;
          color: white;
        }

        .image-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 50%;
        }

        .loading-circle {
          width: ${size * 0.3}px;
          height: ${size * 0.3}px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .edit-overlay {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 10;
        }

        .edit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size * 0.25}px;
          height: ${size * 0.25}px;
          background-color: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          font-size: ${size * 0.12}px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .edit-button:hover {
          background-color: #2563eb;
          transform: scale(1.1);
        }

        .debug-info {
          margin-top: 12px;
          padding: 8px 12px;
          background-color: #f3f4f6;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 11px;
          line-height: 1.4;
        }

        .debug-info p {
          margin: 4px 0;
          color: #374151;
        }

        .debug-info strong {
          font-weight: 600;
        }

        /* 반응형 디자인 */
        @media (max-width: 640px) {
          .image-wrapper {
            width: ${Math.min(size, 100)}px;
            height: ${Math.min(size, 100)}px;
          }

          .default-icon {
            font-size: ${Math.min(size, 100) * 0.4}px;
          }

          .loading-circle {
            width: ${Math.min(size, 100) * 0.3}px;
            height: ${Math.min(size, 100) * 0.3}px;
          }

          .edit-button {
            width: ${Math.min(size, 100) * 0.25}px;
            height: ${Math.min(size, 100) * 0.25}px;
            font-size: ${Math.min(size, 100) * 0.12}px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileImage;
