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
        className: "profile-edit",
        icon: <img src="/images/edit_profile.svg" alt="Edit Profile" />,
        title: "프로필 수정",
        description: "개인정보 및 프로필 사진 변경",
        onClick: () => navigate("/profile/edit"),
      },
      {
        id: "password",
        className: "change-password",
        icon: <img src="/images/change_password.svg" alt="Change Password" />,
        title: "비밀번호 변경",
        description: "보안을 위해 정기적으로 변경하세요",
        onClick: () => navigate("/password/change"),
      },
      {
        id: "notification",
        className: "notification-settings",
        icon: <img src="/images/help.svg" alt="Notification Settings" />,
        title: "고객센터",
        description: "문의사항이나 도움이 필요하시면 연락주세요",
        onClick: () => navigate("/support"),
      },
      {
        id: "members",
        className: "members",
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
                editable={false} // 마이페이지에서는 클릭으로 이동만
              />
            </div>

            <div className="profile-details">
              <h1 className="profile-name">
                {profile?.nickname ?? "사용자"} 님
              </h1>
              <p className="profile-email">
                {profile?.email ?? "이메일 정보 없음"}
              </p>
            </div>
          </section>

          {/* 계정 관리 섹션 */}
          <section className="account-management-section">
            <h2 className="section-title">계정 관리</h2>
            <UserMenu items={menuItems} disabled={authLoading} />
          </section>
        </div>
      </main>
    </Container>
  );
};

export default Profile;
