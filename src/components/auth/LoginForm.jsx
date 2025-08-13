// src/components/auth/LoginForm.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/user/LoginForm.module.css";
import { useForm } from "../../hooks/useForm";
import { validateLoginForm } from "../../utils/validation";
import PasswordResetModal from "./PasswordResetModal";
import SocialLoginButtons from "./SocialLoginButtons";

const LoginForm = ({
  onSubmit,
  // onPasswordReset,
  loading = false,
  showSocialLogin = true,
  showRememberMe = true,
  // showPasswordReset = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);

  const {
    values,
    // errors,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldState,
    formState,
  } = useForm({ email: "", password: "" }, validateLoginForm, {
    validateOnBlur: true,
  });

  const emailState = getFieldState("email");
  const passwordState = getFieldState("password");

  // 비밀번호 찾기 모달 핸들러
  // eslint-disable-next-line
  const openResetPasswordModal = () => {
    setIsResetPasswordModalOpen(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  const handleFormSubmit = handleSubmit(async formData => {
    const result = await onSubmit({
      ...formData,
      rememberMe,
    });

    return result;
  });

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleFormSubmit(e);
    }
  };

  return (
    <div className={styles.loginForm}>
      <form onSubmit={handleFormSubmit} noValidate>
        {/* 이메일 필드 */}
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              id="email"
              name="email"
              value={emailState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="Dream-in@dream.in"
              className={emailState.showError ? styles.error : ""}
              disabled={loading}
              autoComplete="email"
              aria-describedby={
                emailState.showError ? "email-error" : undefined
              }
            />
            <span className={styles.inputIcon}>
              <img
                className={styles.inputSvg}
                src="/images/email_light.svg"
                alt="email"
              />
            </span>
          </div>
          {emailState.showError && (
            <span id="email-error" className={styles.errorText} role="alert">
              {emailState.error}
            </span>
          )}
        </div>

        {/* 비밀번호 필드 */}
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={passwordState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              className={passwordState.showError ? styles.error : ""}
              disabled={loading}
              autoComplete="current-password"
              aria-describedby={
                passwordState.showError ? "password-error" : undefined
              }
            />
            <button
              type="button"
              className={`${styles.inputIcon} ${styles.passwordToggle}`}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img
                className={styles.inputSvg}
                src="/images/lock_light.svg"
                alt="lock"
              />
            </button>
          </div>
          {passwordState.showError && (
            <span id="password-error" className={styles.errorText} role="alert">
              {passwordState.error}
            </span>
          )}
        </div>

        {/* 자동 로그인 체크박스 */}
        {showRememberMe && (
          <div className={styles.rememberMe}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className={styles.checkboxCustom}></span>
              자동 로그인
            </label>
          </div>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className={styles.loginButton}
          disabled={loading || !formState.isValid}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 이메일/비밀번호 찾기 링크 */}
      <div className={styles.loginLinksWrapper}>
        {/* 이메일 찾기 링크 */}
        <Link to="/find-email" className={styles.linkButton}>
          이메일 찾기
        </Link>
        <span className={styles.linkSeparator}>|</span>
        {/* 비밀번호 찾기 링크 */}
        <Link to="/find-password" className={styles.linkButton}>
          비밀번호 찾기
        </Link>
      </div>

      {/* 소셜 로그인 */}
      {showSocialLogin && (
        <div className={styles.socialSection}>
          <SocialLoginButtons disabled={loading} />
        </div>
      )}

      {/* 비밀번호 찾기 모달 */}
      <PasswordResetModal
        isOpen={isResetPasswordModalOpen}
        onClose={closeResetPasswordModal}
        prefillEmail={values.email}
      />
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onPasswordReset: PropTypes.func,
  loading: PropTypes.bool,
  showSocialLogin: PropTypes.bool,
  showRememberMe: PropTypes.bool,
  showPasswordReset: PropTypes.bool,
};

export default LoginForm;
