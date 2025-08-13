// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import PasswordResetModal from "../components/auth/PasswordResetModal";
import Container from "../components/common/Container";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import "../css/loginpage.css";
import { getErrorMessage } from "../utils/errorHandler";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword, user, authLoading } = useAuth();

  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useThemeContext();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  /**
   * 로그인 처리
   */
  const handleLogin = async formData => {
    setMessage("");
    setError("");

    try {
      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        setMessage("로그인 성공! 잠시 후 홈으로 이동합니다.");

        // 자동 로그인 설정 처리 (필요시)
        if (formData.rememberMe) {
          localStorage.setItem("rememberLogin", "true");
        }

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);

        return { success: true };
      } else {
        const errorMessage = getErrorMessage(result.error);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * 비밀번호 재설정 모달 열기
   */
  const handlePasswordResetClick = (email = "") => {
    setShowResetModal(true);
  };

  /**
   * 비밀번호 재설정 요청
   */
  const handlePasswordReset = async email => {
    setMessage("");
    setError("");

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setMessage(result.message || "비밀번호 재설정 이메일을 발송했습니다.");
        setShowResetModal(false);
        return { success: true };
      } else {
        const errorMessage = getErrorMessage(result.error);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * 메시지 자동 제거
   */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * 에러 자동 제거
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container className="login-page">
      <div className="login-page-container">
        {/* 로고 섹션 */}
        <div className="login-page-logo-section">
          <div className="login-page-logo-circle">
            <img
              src={
                isDarkMode ? "/images/icon-dark.png" : "/images/icon-light.png"
              }
              alt="Dream-in Logo"
              className="login-page-logo-image"
            />
          </div>
          <h1 className="login-page-app-title">Dream-in</h1>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className="login-page-message login-page-message-success">
            {message}
          </div>
        )}

        {error && (
          <div className="login-page-message login-page-message-error">
            {error}
          </div>
        )}

        {/* 로그인 폼 */}
        <LoginForm
          onSubmit={handleLogin}
          onPasswordReset={handlePasswordResetClick}
          loading={authLoading}
          showSocialLogin={true}
          showRememberMe={true}
          showPasswordReset={true}
        />

        {/* 회원가입 링크 */}
        <div className="login-page-signup-section">
          <span>아직 계정이 없으신가요?</span>
          <Link to="/signup" className="login-page-signup-link">
            회원가입
          </Link>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
      {showResetModal && (
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onSubmit={handlePasswordReset}
          loading={authLoading}
        />
      )}
    </Container>
  );
};

export default LoginPage;
