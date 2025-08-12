// src/pages/SignupPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorHandler";
import SignupForm from "../components/auth/SignupForm";
import Container from "../components/common/Container";
import { useThemeContext } from "../contexts/ThemeContext";
import "../css/signuppage.css"; // 스타일시트 임포트

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, user, authLoading } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { isDarkMode, setIsDarkMode } = useThemeContext();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  /**
   * 회원가입 처리
   */
  const handleSignup = async formData => {
    setMessage("");
    setError("");

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        birthdate: formData.birthdate,
        gender: formData.gender,
        profileImage: formData.profileImage,
      });

      if (result.success) {
        setMessage(
          result.message || "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
        );

        // 회원가입 성공 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message: "회원가입이 완료되었습니다. 로그인해주세요.",
              email: formData.email,
            },
          });
        }, 2000);

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
   * 닉네임 중복확인 성공 콜백
   */
  const handleNicknameCheckSuccess = nickname => {
    setMessage(`"${nickname}" 사용 가능한 닉네임입니다.`);

    // 2초 후 메시지 제거
    setTimeout(() => {
      setMessage("");
    }, 2000);
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
    <Container>
      {/* 메인 컨테이너 */}
      <div className="signup-main-container">
        {/* 로고 섹션 */}
        <div className="signup-logo-section">
          <div className="signup-logo-container">
            <img
              src={
                isDarkMode ? "/images/icon-dark.png" : "/images/icon-light.png"
              }
              alt="Dream-in Logo"
              className="signup-logo-image"
            />
          </div>
          <h1 className="signup-app-title">Dream-In</h1>
          <p className="signup-app-subtitle">
            꿈을 기록하고 나를 이해하는 여정
          </p>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className="signup-message signup-message-success">{message}</div>
        )}

        {error && (
          <div className="signup-message signup-message-error">{error}</div>
        )}

        {/* 회원가입 폼 */}
        <SignupForm
          onSubmit={handleSignup}
          onNicknameCheck={handleNicknameCheckSuccess}
          loading={authLoading}
        />

        {/* 로그인 링크 */}
        <div className="signup-login-section">
          <span>계정이 이미 있으신가요?</span>
          <Link to="/login" className="signup-login-link">
            로그인
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SignupPage;
