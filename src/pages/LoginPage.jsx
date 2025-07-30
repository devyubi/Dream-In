// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../api/auth";

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

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // 입력값 변경 처리
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // 폼 유효성 검사
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

  // 로그인 처리
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
      // Supabase 에러 메시지를 사용자 친화적으로 변환
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

  // 비밀번호 재설정 처리
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

  // Enter 키 처리
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* 로고/헤더 */}
        <div className="login-header">
          <h1 className="app-title">Dream-In</h1>
          <p className="app-subtitle">꿈을 기록하고 나를 이해하는 여정</p>
        </div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>로그인</h2>

          {/* 성공/에러 메시지 */}
          {message && <div className="message success">{message}</div>}

          {errors.submit && (
            <div className="message error">{errors.submit}</div>
          )}

          {/* 이메일 입력 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="이메일을 입력하세요"
              className={errors.email ? "error" : ""}
              disabled={authLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="비밀번호를 입력하세요"
                className={errors.password ? "error" : ""}
                disabled={authLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={authLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button" disabled={authLoading}>
            {authLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* 링크들 */}
          <div className="login-links">
            <button
              type="button"
              className="link-button"
              onClick={() => setShowResetModal(true)}
              disabled={authLoading}
            >
              비밀번호를 잊으셨나요?
            </button>

            <div className="signup-link">
              아직 계정이 없으신가요?{" "}
              <Link to="/signup" className="link">
                회원가입
              </Link>
            </div>
          </div>
        </form>

        {/* 소셜 로그인 (선택사항) */}
        <div className="social-login">
          <p>또는</p>
          {/* 나중에 구글/카카오 로그인 추가 가능 */}
          <div className="social-buttons">
            {/* <button className="social-button google">구글로 로그인</button> */}
          </div>
        </div>
      </div>

      {/* 비밀번호 재설정 모달 */}
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
