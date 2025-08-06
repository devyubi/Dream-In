// src/components/auth/SignupForm.jsx
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useForm } from "../../hooks/useForm";
import { useImageUpload } from "../../hooks/useImageUpload";
import { validateSignupForm } from "../../utils/validation";
import { checkNicknameDuplicate } from "../../api/auth";
import styles from "./SignupForm.module.css";

const SignupForm = ({ onSubmit, onNicknameCheck, loading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameCheckLoading, setNicknameCheckLoading] = useState(false);

  const {
    values,
    errors,
    handleChange: formHandleChange,
    handleBlur,
    handleSubmit,
    getFieldState,
    formState,
    setFieldError,
    clearFieldError,
  } = useForm(
    {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      birthdate: "",
      gender: "",
      profileImage: null,
    },
    validateSignupForm,
    { validateOnBlur: true, validateOnChange: true },
  );

  const {
    preview: profileImagePreview,
    handleImageSelect,
    removeImage,
  } = useImageUpload();

  // 각 필드의 상태
  const emailState = getFieldState("email");
  const passwordState = getFieldState("password");
  const confirmPasswordState = getFieldState("confirmPassword");
  const nicknameState = getFieldState("nickname");
  const birthdateState = getFieldState("birthdate");
  const genderState = getFieldState("gender");
  const profileImageState = getFieldState("profileImage");

  /**
   * 파일 입력 처리
   */
  const handleFileChange = useCallback(
    e => {
      const file = e.target.files[0];

      // 폼 상태 업데이트
      formHandleChange({
        target: {
          name: "profileImage",
          value: file,
          type: "file",
          files: e.target.files,
        },
      });

      // 이미지 미리보기 업데이트
      handleImageSelect(file);
    },
    [formHandleChange, handleImageSelect],
  );

  /**
   * 일반 입력 처리
   */
  const handleChange = useCallback(
    e => {
      const { name } = e.target;

      // 닉네임 변경 시 중복확인 상태 초기화
      if (name === "nickname") {
        setNicknameChecked(false);
        clearFieldError("nickname");
      }

      formHandleChange(e);
    },
    [formHandleChange, clearFieldError],
  );

  /**
   * 닉네임 중복확인
   */
  const handleNicknameCheck = async () => {
    if (!values.nickname) {
      setFieldError("nickname", "닉네임을 먼저 입력해주세요.");
      return;
    }

    setNicknameCheckLoading(true);

    try {
      const result = await checkNicknameDuplicate(values.nickname);

      if (result.error) {
        setFieldError("nickname", "중복확인 중 오류가 발생했습니다.");
        setNicknameChecked(false);
      } else if (result.isDuplicate) {
        setFieldError("nickname", "이미 사용중인 닉네임입니다.");
        setNicknameChecked(false);
      } else {
        clearFieldError("nickname");
        setNicknameChecked(true);
        if (onNicknameCheck) {
          onNicknameCheck(values.nickname);
        }
      }
    } catch (error) {
      setFieldError("nickname", "중복확인 중 오류가 발생했습니다.");
      setNicknameChecked(false);
    } finally {
      setNicknameCheckLoading(false);
    }
  };

  /**
   * 프로필 이미지 제거
   */
  const handleRemoveImage = () => {
    formHandleChange({
      target: {
        name: "profileImage",
        value: null,
        type: "file",
        files: null,
      },
    });
    removeImage();
  };

  /**
   * 폼 제출
   */
  const handleFormSubmit = handleSubmit(async formData => {
    // 닉네임 중복확인 체크
    if (!nicknameChecked) {
      setFieldError("nickname", "닉네임 중복확인을 해주세요.");
      return { success: false };
    }

    const result = await onSubmit({
      ...formData,
    });
    return result;
  });

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  return (
    <div className={styles.signupForm}>
      <form onSubmit={handleFormSubmit} noValidate>
        {/* 이메일 */}
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일 *</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              id="email"
              name="email"
              value={emailState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="이메일을 입력하세요"
              className={emailState.showError ? styles.error : ""}
              disabled={loading}
              autoComplete="email"
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
            <span className={styles.errorText}>{emailState.error}</span>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호 *</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={passwordState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="6자 이상 입력하세요"
              className={passwordState.showError ? styles.error : ""}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`${styles.inputIcon} ${styles.passwordToggle}`}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <img
                className={styles.inputSvg}
                src="/images/lock_light.svg"
                alt="lock"
              />
            </button>
          </div>
          {passwordState.showError && (
            <span className={styles.errorText}>{passwordState.error}</span>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">비밀번호 확인 *</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPasswordState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호를 다시 입력하세요"
              className={confirmPasswordState.showError ? styles.error : ""}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`${styles.inputIcon} ${styles.passwordToggle}`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              <img
                className={styles.inputSvg}
                src="/images/lock_light.svg"
                alt="lock"
              />
            </button>
          </div>
          {confirmPasswordState.showError && (
            <span className={styles.errorText}>
              {confirmPasswordState.error}
            </span>
          )}
        </div>

        {/* 닉네임 */}
        <div className={styles.formGroup}>
          <label htmlFor="nickname">닉네임 *</label>
          <div className={styles.nicknameInputWrapper}>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={nicknameState.value || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="닉네임을 입력해주세요."
              className={
                nicknameState.showError
                  ? styles.error
                  : nicknameChecked
                    ? styles.success
                    : ""
              }
              disabled={loading}
            />
            <button
              type="button"
              className={styles.checkButton}
              onClick={handleNicknameCheck}
              disabled={loading || nicknameCheckLoading || !values.nickname}
            >
              {nicknameCheckLoading ? "확인중..." : "중복확인"}
            </button>
          </div>
          {nicknameState.showError && (
            <span className={styles.errorText}>{nicknameState.error}</span>
          )}
          {nicknameChecked && !nicknameState.showError && (
            <span className={styles.successText}>
              ✓ 사용 가능한 닉네임입니다
            </span>
          )}
        </div>

        {/* 생년월일과 성별을 한 줄에 */}
        <div className={styles.dateGenderWrapper}>
          {/* 생년월일 */}
          <div className={styles.formGroup}>
            <label htmlFor="birthdate">생년월일</label>
            <div className={styles.inputWrapper}>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={birthdateState.value || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className={birthdateState.showError ? styles.error : ""}
                disabled={loading}
                placeholder="yyyy/mm/dd"
              />
            </div>
            {birthdateState.showError && (
              <span className={styles.errorText}>{birthdateState.error}</span>
            )}
          </div>

          {/* 성별 */}
          <div className={styles.formGroup}>
            <label htmlFor="gender">성별</label>
            <div className={styles.inputWrapper}>
              <select
                id="gender"
                name="gender"
                value={genderState.value || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
              >
                <option value="">성별</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
              <span className={styles.inputIcon}>
                <svg
                  className={styles.inputSvg}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* 프로필 이미지 */}
        <div className={styles.formGroup}>
          <label htmlFor="profileImage">프로필 이미지 (선택사항)</label>
          <div className={styles.profileImageWrapper}>
            {profileImagePreview && (
              <div className={styles.imagePreview}>
                <img
                  src={profileImagePreview}
                  alt="프로필 미리보기"
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              className={profileImageState.showError ? styles.error : ""}
              disabled={loading}
            />
            <small className={styles.fileInfo}>
              JPG, PNG, WebP, GIF 파일만 가능 (최대 5MB)
            </small>
          </div>
          {profileImageState.showError && (
            <span className={styles.errorText}>{profileImageState.error}</span>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={styles.signupButton}
          disabled={loading || !formState.isValid || !nicknameChecked}
        >
          {loading ? "처리 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

SignupForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onNicknameCheck: PropTypes.func,
  loading: PropTypes.bool,
};

export default SignupForm;
