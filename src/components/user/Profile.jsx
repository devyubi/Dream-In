// src/components/user/Profile.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { deleteAccount } from "../../api/auth";
import ProfileImage from "./ProfileImage";
import UserMenu from "./UserMenu";
import LoadingSpinner from "../common/LoadingSpinner";
import Container from "../common/Container";
import PasswordChangeModal from "./PasswordChangeModal";
import DeleteAccountModal from "./DeleteAccountModal";
import "../../css/Profile.css";

// 소셜 로그인 사용자 확인 함수
const isSocialLoginUser = user => {
  if (!user) return false;

  const socialProviders = user.identities?.filter(
    identity => identity.provider !== "email",
  );

  return socialProviders && socialProviders.length > 0;
};

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    profile,
    signOut,
    authLoading,
    loading,
    isAuthenticated,
    isLoggedIn,
  } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    // 로딩이 완료되고 인증되지 않은 경우 리다이렉트
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

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

  // 비밀번호 모달 핸들러
  const openPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
  }, []);

  // 회원탈퇴 모달 핸들러
  const openDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  // 회원탈퇴 성공 핸들러
  const handleDeleteSuccess = useCallback(async () => {
    await signOut();
    navigate("/", { replace: true });
    alert("회원탈퇴가 완료되었습니다.");
  }, [signOut, navigate]);

  // 메뉴 아이템 정의
  const menuItems = useMemo(() => {
    const baseItems = [
      {
        id: "profile-edit",
        className: "profile-edit",
        icon: <img src="/images/edit_profile.svg" alt="Edit Profile" />,
        title: "프로필 수정",
        description: "개인정보 및 프로필 사진 변경",
        onClick: () => navigate("/profile/edit"),
      },
    ];

    // 비밀번호 변경 메뉴 (일반 회원가입 사용자만) - 모달로 변경
    const passwordItem = {
      id: "password",
      className: "change-password",
      icon: <img src="/images/change_password.svg" alt="Change Password" />,
      title: "비밀번호 변경",
      description: "보안을 위해 정기적으로 변경하세요",
      onClick: openPasswordModal, // 페이지 이동 대신 모달 열기
    };

    const bottomItems = [
      {
        id: "notification",
        className: "notification-settings",
        icon: <img src="/images/help.svg" alt="Notification Settings" />,
        title: "고객센터",
        description: "문의사항이나 도움이 필요하시면 연락주세요",
        onClick: () => navigate("/support"),
      },
      // 회원탈퇴 메뉴 추가
      {
        id: "delete-account",
        icon: "🗑️",
        title: "회원탈퇴",
        description: "계정을 영구적으로 삭제합니다",
        onClick: openDeleteModal,
        isDestructive: true,
      },
    ];

    // 소셜 로그인 사용자가 아닌 경우에만 비밀번호 변경 메뉴 추가
    return [
      ...baseItems,
      ...(user && !isSocialLoginUser(user) ? [passwordItem] : []),
      ...bottomItems,
    ];
  }, [navigate, user, openPasswordModal, openDeleteModal]);

  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = useCallback(() => {
    navigate("/profile/edit");
  }, [navigate]);

  // 초기 로딩 중
  if (loading) {
    return (
      <Container className="profile-page loading">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LoadingSpinner message="인증 상태를 확인하고 있습니다..." />
        </div>
      </Container>
    );
  }

  // 인증되지 않은 상태
  if (!isAuthenticated) {
    return (
      <Container className="profile-page not-authenticated">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>인증이 필요합니다</h2>
          <p style={{ margin: 0, color: "#666" }}>
            로그인 페이지로 이동하고 있습니다...
          </p>
        </div>
      </Container>
    );
  }

  // Auth 작업 중
  if (authLoading) {
    return (
      <Container className="profile-page loading">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LoadingSpinner message="처리 중..." />
        </div>
      </Container>
    );
  }

  // 인증은 되었지만 사용자 정보가 없는 경우
  if (!user) {
    return (
      <Container className="profile-page no-user">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>
            사용자 정보를 불러올 수 없습니다
          </h2>
          <p style={{ margin: 0, color: "#666" }}>다시 로그인해주세요.</p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            로그인하러 가기
          </button>
        </div>
      </Container>
    );
  }

  // 사용자 정보는 있지만 프로필이 아직 로드되지 않은 경우
  if (!profile) {
    return (
      <Container className="profile-page profile-loading">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>프로필을 불러오는 중...</h2>
          <LoadingSpinner message="프로필 정보를 가져오고 있습니다." />
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
                {profile?.nickname ?? user?.email?.split("@")[0] ?? "사용자"} 님
              </h1>
              <p className="profile-email">
                {profile?.email ?? user?.email ?? "이메일 정보 없음"}
              </p>
              {/* 소셜 로그인 사용자 표시 */}
              {user && isSocialLoginUser(user) && (
                <p
                  className="social-login-badge"
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginTop: "0.25rem",
                  }}
                >
                  소셜 로그인 계정
                </p>
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

      {/* 비밀번호 변경 모달 */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
      />

      {/* 회원탈퇴 모달 */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        user={user}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Container>
  );
};

export default Profile;
