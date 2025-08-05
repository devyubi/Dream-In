// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorHandler";
import LoginForm from "../components/auth/LoginForm";
import PasswordResetModal from "../components/auth/PasswordResetModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword, user, authLoading } = useAuth();

  const [showResetModal, setShowResetModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E8D5FF 0%, #F0E6FF 50%, #E8D5FF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      {/* 배경 장식 */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "60px",
          height: "60px",
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🏠
      </div>

      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          width: "60px",
          height: "60px",
          background: "rgba(139, 92, 246, 0.1)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🌙
      </div>

      {/* 로고 섹션 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/logo.png"
            alt="Dream-in Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#8B5CF6",
            margin: "0",
            textShadow: "0 2px 4px rgba(139, 92, 246, 0.1)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Dream-in
        </h1>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            background: "rgba(16, 185, 129, 0.9)",
            color: "white",
            backdropFilter: "blur(10px)",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.9)",
            color: "white",
            backdropFilter: "blur(10px)",
          }}
        >
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
      <div
        style={{
          textAlign: "center",
          marginTop: "24px",
          color: "rgba(139, 92, 246, 0.8)",
          fontSize: "14px",
        }}
      >
        <span>아직 계정이 없으신가요?</span>
        <Link
          to="/signup"
          style={{
            color: "#8B5CF6",
            fontWeight: "600",
            textDecoration: "none",
            marginLeft: "8px",
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.target.style.background = "rgba(139, 92, 246, 0.1)";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
          }}
        >
          회원가입
        </Link>
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
    </div>
  );
};

export default LoginPage;
