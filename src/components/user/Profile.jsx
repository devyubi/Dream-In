// src/pages/Profile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../css/Profile.css";
import Container from "../common/Container";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, authLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = async () => {
    if (window.confirm("정말 로그아웃하시겠습니까?")) {
      const result = await signOut();
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    }
  };

  const menuItems = [
    {
      id: "profile-edit",
      icon: "👤",
      title: "프로필 수정",
      description: "개인정보 및 프로필 사진 변경",
      onClick: () => navigate("/profile/edit"),
    },
    {
      id: "password",
      icon: "🔒",
      title: "비밀번호 변경",
      description: "보안을 위해 정기적으로 변경하세요",
      onClick: () => navigate("/password/change"),
    },
    {
      id: "notification",
      icon: "🔔",
      title: "고객센터",
      description: "문의사항이나 도움이 필요하시면 연락주세요",
      onClick: () => navigate("/support"),
    },
    {
      id: "members",
      icon: "👥",
      title: "회원탈퇴",
      description: "계정을 영구적으로 삭제합니다",
      onClick: () => navigate("/account/delete"),
      isDestructive: true,
    },
  ];

  if (!user || !profile) {
    return (
      <div className="profile-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Container className={`profile-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 메인 컨텐츠 */}
      <main className="profile-main">
        <div className="profile-container">
          {/* 프로필 정보 섹션 */}
          <section className="profile-info-section">
            <div className="profile-avatar">
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={`${profile.nickname}의 프로필`}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  <span className="avatar-icon">👤</span>
                </div>
              )}
              <div className="avatar-badge">
                <span className="badge-icon">✓</span>
              </div>
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{profile.nickname}</h1>
              <p className="profile-email">{profile.email}</p>
            </div>
          </section>

          {/* 계정 관리 섹션 */}
          <section className="account-management-section">
            <h2 className="section-title">계정 관리</h2>

            <div className="menu-list">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`menu-item ${item.isDestructive ? "destructive" : ""}`}
                  onClick={item.onClick}
                  disabled={authLoading}
                >
                  <div className="menu-icon">
                    <span>{item.icon}</span>
                  </div>
                  <div className="menu-content">
                    <h3 className="menu-title">{item.title}</h3>
                    <p className="menu-description">{item.description}</p>
                  </div>
                  <div className="menu-arrow">
                    <span>›</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Container>
  );
};

export default Profile;
