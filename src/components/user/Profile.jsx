// src/components/user/Profile.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileImage from "./ProfileImage";
import UserMenu from "./UserMenu";
import LoadingSpinner from "../common/LoadingSpinner";
import Container from "../common/Container";
import "../../css/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, authLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로그인하지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 다크 모드 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = e => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 로그아웃 핸들러
  const handleSignOut = useCallback(async () => {
    if (window.confirm("정말 로그아웃하시겠습니까?")) {
      const result = await signOut();
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    }
  }, [signOut, navigate]);

  // 메뉴 아이템 정의
  const menuItems = useMemo(
    () => [
      {
        id: "profile-edit",
        icon: <img src="/images/edit_profile.svg" alt="Edit Profile" />,
        title: "프로필 수정",
        description: "개인정보 및 프로필 사진 변경",
        onClick: () => navigate("/profile/edit"),
      },
      {
        id: "password",
        icon: <img src="/images/change_password.svg" alt="Change Password" />,
        title: "비밀번호 변경",
        description: "보안을 위해 정기적으로 변경하세요",
        onClick: () => navigate("/password/change"),
      },
      {
        id: "notification",
        icon: <img src="/images/help.svg" alt="Notification Settings" />,
        title: "고객센터",
        description: "문의사항이나 도움이 필요하시면 연락주세요",
        onClick: () => navigate("/support"),
      },
      {
        id: "logout",
        icon: <img src="/images/logout.svg" alt="Logout" />,
        title: "로그아웃",
        description: "현재 계정에서 로그아웃합니다",
        onClick: handleSignOut,
      },
      {
        id: "members",
        icon: <img src="/images/delete_account.svg" alt="Members" />,
        title: "회원탈퇴",
        description: "계정을 영구적으로 삭제합니다",
        onClick: () => navigate("/account/delete"),
        isDestructive: true,
      },
    ],
    [navigate, handleSignOut],
  );

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = useCallback(() => {
    navigate("/profile/edit");
  }, [navigate]);

  // 로딩 상태
  if (authLoading) {
    return (
      <Container className="profile-page loading">
        <LoadingSpinner message="로딩 중..." />
      </Container>
    );
  }

  // 사용자 정보 없음
  if (user && !profile) {
    return (
      <Container className="profile-page no-profile">
        <div className="error-state">
          <h2>프로필을 찾을 수 없습니다</h2>
          <p>회원정보가 없습니다. 관리자에게 문의하세요.</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className={`profile-page ${isDarkMode ? "dark-mode" : ""}`}>
      <main className="profile-main">
        <div className="profile-container">
          {/* 프로필 정보 섹션 */}
          <section className="profile-info-section">
            <div className="profile-avatar">
              <ProfileImage
                profile={profile}
                size={120}
                onClick={handleProfileImageClick}
                className="clickable"
              />
              <div className="avatar-badge">
                <span className="badge-icon">✓</span>
              </div>
            </div>

            <div className="profile-details">
              <h1 className="profile-name">
                {profile?.nickname ?? "사용자"} 님
              </h1>
              <p className="profile-email">
                {profile?.email ?? "이메일 정보 없음"}
              </p>

              {/* 프로필 완성도 표시 */}
              {profile && (
                <div className="profile-completeness">
                  <div className="completeness-bar">
                    <div
                      className="completeness-fill"
                      style={{
                        width: `${calculateProfileCompleteness(profile)}%`,
                      }}
                    />
                  </div>
                  <span className="completeness-text">
                    프로필 {calculateProfileCompleteness(profile)}% 완성
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* 계정 관리 섹션 */}
          <section className="account-management-section">
            <h2 className="section-title">계정 관리</h2>
            <UserMenu items={menuItems} disabled={authLoading} />
          </section>
        </div>
      </main>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 20px 0;
        }

        .profile-page.dark-mode {
          background-color: #1a202c;
          color: #e2e8f0;
        }

        .profile-main {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-page.dark-mode .profile-container {
          background: #2d3748;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .profile-info-section {
          padding: 40px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
          margin-bottom: 24px;
        }

        .profile-avatar .clickable {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .profile-avatar .clickable:hover {
          transform: scale(1.05);
        }

        .avatar-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: #10b981;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-icon {
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .profile-details {
          max-width: 400px;
          margin: 0 auto;
        }

        .profile-name {
          font-size: 28px;
          font-weight: bold;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .profile-email {
          font-size: 16px;
          opacity: 0.9;
          margin: 0 0 20px 0;
        }

        .profile-completeness {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(10px);
        }

        .completeness-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .completeness-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .completeness-text {
          font-size: 14px;
          font-weight: 500;
        }

        .account-management-section {
          padding: 40px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px 0;
        }

        .profile-page.dark-mode .section-title {
          color: #f7fafc;
        }

        .error-state {
          text-align: center;
          padding: 60px 20px;
        }

        .error-state h2 {
          color: #ef4444;
          margin-bottom: 12px;
        }

        .error-state p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .retry-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background: #2563eb;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .profile-page {
            padding: 10px 0;
          }

          .profile-container {
            margin: 0 16px;
            border-radius: 12px;
          }

          .profile-info-section {
            padding: 30px 20px;
          }

          .profile-name {
            font-size: 24px;
          }

          .profile-email {
            font-size: 14px;
          }

          .account-management-section {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .profile-info-section {
            padding: 24px 16px;
          }

          .profile-name {
            font-size: 20px;
          }

          .account-management-section {
            padding: 24px 16px;
          }
        }
      `}</style>
    </Container>
  );
};

/**
 * 프로필 완성도 계산
 * @param {object} profile
 * @returns {number}
 */
const calculateProfileCompleteness = profile => {
  if (!profile) return 0;

  const fields = [
    "email",
    "nickname",
    "birthdate",
    "gender",
    "profile_image_url",
  ];

  const completedFields = fields.filter(field => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== "";
  });

  return Math.round((completedFields.length / fields.length) * 100);
};

export default Profile;
