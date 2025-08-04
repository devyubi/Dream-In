// src/pages/LoginPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithKakao, validateEmail } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import "../css/loginpage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword, user, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      setMessage("로그인 성공! 잠시 후 홈으로 이동합니다.");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } else {
      let errorMessage = result.error;

      if (result.error.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (result.error.includes("Email not confirmed")) {
        errorMessage =
          "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
      } else if (result.error.includes("Too many requests")) {
        errorMessage =
          "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      }

      setErrors({ submit: errorMessage });
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const result = await signInWithKakao();
      if (!result.success) {
        setErrors({ submit: "카카오 로그인에 실패했습니다." });
      }
    } catch (error) {
      setErrors({ submit: "카카오 로그인 중 오류가 발생했습니다." });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrors({ submit: "구글 로그인에 실패했습니다." });
      }
    } catch (error) {
      setErrors({ submit: "구글 로그인 중 오류가 발생했습니다." });
    }
  };

  const handlePasswordReset = async e => {
    e.preventDefault();

    if (!resetEmail) {
      setErrors({ reset: "이메일을 입력해주세요." });
      return;
    }

    if (!validateEmail(resetEmail)) {
      setErrors({ reset: "올바른 이메일 형식이 아닙니다." });
      return;
    }

    const result = await resetPassword(resetEmail);

    if (result.success) {
      setMessage(result.message);
      setShowResetModal(false);
      setResetEmail("");
      setErrors({});
    } else {
      setErrors({ reset: result.error });
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo-circle">
            <img
              src="/images/logo.png"
              alt="Dream-in Logo"
              className="logo-image"
            />
          </div>
          <h1 className="app-title">Dream-in</h1>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {message && <div className="message success">{message}</div>}
            {errors.submit && (
              <div className="message error">{errors.submit}</div>
            )}

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Dream-in@dream.in"
                  className={errors.email ? "error" : ""}
                  disabled={authLoading}
                />
                <span className="input-icon">
                  <img
                    className="input-svg svg-email"
                    src="/email_light.svg"
                    alt="email"
                  />
                </span>
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className={errors.password ? "error" : ""}
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="input-icon password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={authLoading}
                >
                  <img
                    className="input-svg showpass"
                    src="/lock_light.svg"
                    alt="lock_dark"
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={authLoading}
                />
                <span className="checkbox-custom"></span>
                자동 로그인
              </label>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={authLoading}
            >
              {authLoading ? "로그인 중..." : "로그인"}
            </button>

            <div className="login-links">
              <button
                type="button"
                className="link-button"
                onClick={() => setShowResetModal(true)}
                disabled={authLoading}
              >
                아이디 찾기
              </button>
              <button
                type="button"
                className="link-button"
                onClick={() => setShowResetModal(true)}
                disabled={authLoading}
              >
                비밀번호 찾기
              </button>
            </div>
          </form>
        </div>

        <div className="social-section">
          <div className="social-buttons">
            <button
              className="social-button kakao"
              onClick={handleKakaoLogin}
              disabled={authLoading}
            >
              <span className="social-icon">💬</span>
              카카오로 시작하기
            </button>
            <button
              className="social-button google"
              onClick={handleGoogleLogin}
              disabled={authLoading}
            >
              <span className="social-icon">G</span>
              구글로 시작하기
            </button>
          </div>
        </div>

        <div className="signup-section">
          <span>아직 계정이 없으신가요?</span>
          <Link to="/signup" className="signup-link">
            회원가입
          </Link>
        </div>
      </div>

      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>비밀번호 재설정</h3>
              <button
                className="close-button"
                onClick={() => setShowResetModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label htmlFor="resetEmail">이메일</label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="가입한 이메일을 입력하세요"
                  className={errors.reset ? "error" : ""}
                  disabled={authLoading}
                />
                {errors.reset && (
                  <span className="error-text">{errors.reset}</span>
                )}
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowResetModal(false)}
                  disabled={authLoading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={authLoading}
                >
                  {authLoading ? "발송 중..." : "재설정 이메일 발송"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
