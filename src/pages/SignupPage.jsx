// src/pages/SignupPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkNicknameDuplicate,
  validateBirthdate,
  validateEmail,
  validateNickname,
  validatePassword,
} from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import "../css/signuppage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, user, authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthdate: "",
    gender: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // 입력값 변경 처리
  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));

      // 이미지 미리보기
      if (file) {
        const reader = new FileReader();
        reader.onload = e => setProfileImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setProfileImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // 실시간 유효성 검사 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    // 닉네임 변경 시 중복확인 상태 초기화
    if (name === "nickname") {
      setNicknameChecked(false);
    }
  };

  // 전체 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 비밀번호 검증
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    // 비밀번호 확인
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 닉네임 검증
    const nicknameValidation = validateNickname(formData.nickname);
    if (!nicknameValidation.isValid) {
      newErrors.nickname = nicknameValidation.errors[0];
    } else if (!nicknameChecked) {
      newErrors.nickname = "닉네임 중복확인을 해주세요.";
    }

    // 생년월일 검증 (선택사항)
    if (formData.birthdate) {
      const birthdateValidation = validateBirthdate(formData.birthdate);
      if (!birthdateValidation.isValid) {
        newErrors.birthdate = birthdateValidation.errors[0];
      }
    }

    // 프로필 이미지 검증 (선택사항)
    if (formData.profileImage) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(formData.profileImage.type)) {
        newErrors.profileImage =
          "지원되지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)";
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.profileImage.size > maxSize) {
        newErrors.profileImage = "파일 크기는 5MB 이하여야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 닉네임 중복확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname) {
      setErrors(prev => ({ ...prev, nickname: "닉네임을 먼저 입력해주세요." }));
      return;
    }

    const nicknameValidation = validateNickname(formData.nickname);
    if (!nicknameValidation.isValid) {
      setErrors(prev => ({ ...prev, nickname: nicknameValidation.errors[0] }));
      return;
    }

    const result = await checkNicknameDuplicate(formData.nickname);

    if (result.error) {
      setErrors(prev => ({
        ...prev,
        nickname: "중복확인 중 오류가 발생했습니다.",
      }));
    } else if (result.isDuplicate) {
      setErrors(prev => ({ ...prev, nickname: "이미 사용중인 닉네임입니다." }));
      setNicknameChecked(false);
    } else {
      setErrors(prev => ({ ...prev, nickname: "" }));
      setNicknameChecked(true);
      setMessage("사용 가능한 닉네임입니다.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // 회원가입 처리
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      birthdate: formData.birthdate || null,
      gender: formData.gender || null,
      profileImage: formData.profileImage,
    });

    if (result.success) {
      setMessage(result.message);
      // 회원가입 성공 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } else {
      // Supabase 에러 메시지를 사용자 친화적으로 변환
      let errorMessage = result.error;

      if (result.error.includes("User already registered")) {
        errorMessage = "이미 가입된 이메일입니다.";
      } else if (result.error.includes("Password should be at least")) {
        errorMessage = "비밀번호는 6자 이상이어야 합니다.";
      } else if (result.error.includes("Storage 권한 오류")) {
        errorMessage =
          "프로필 이미지 업로드 권한이 없습니다. 이미지 없이 가입을 완료했습니다.";
      }

      setErrors({ submit: errorMessage });
    }
  };

  // Enter 키 처리
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="signup-page">
      {/* 네비게이션 */}
      <nav className="signup-nav">
        <button
          className="nav-icon"
          onClick={() => navigate(-1)}
          disabled={authLoading}
        >
          ←
        </button>
        <div></div>
      </nav>

      {/* 메인 컨테이너 */}
      <div className="signup-container">
        {/* 로고 섹션 */}
        <div className="logo-section">
          <div className="logo-circle">
            <div className="logo-placeholder">
              <img src="/logo.png" alt="Dream-in Logo" className="logo-image" />
            </div>
          </div>
          <h1 className="app-title">Dream-In</h1>
          <p className="app-subtitle">꿈을 기록하고 나를 이해하는 여정</p>
        </div>

        {/* 회원가입 카드 */}
        <div className="signup-card">
          {/* 메시지 */}
          {message && <div className="message success">{message}</div>}
          {errors.submit && (
            <div className="message error">{errors.submit}</div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* 이메일 */}
            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <div className="input-wrapper">
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
                <span className="input-icon">
                  <img
                    className="input-svg"
                    src="/email_light.svg"
                    alt="email"
                  />
                </span>
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            {/* 비밀번호 */}
            <div className="form-group">
              <label htmlFor="password">비밀번호 *</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="8자 이상, 대/소문자, 숫자 포함"
                  className={errors.password ? "error" : ""}
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="input-icon"
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

            {/* 비밀번호 확인 */}
            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인 *</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={errors.confirmPassword ? "error" : ""}
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="input-icon password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={authLoading}
                >
                  <img
                    className="input-svg showpass"
                    src="/lock_light.svg"
                    alt="lock_dark"
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            {/* 닉네임 */}
            <div className="form-group">
              <label htmlFor="nickname">닉네임 *</label>
              <div className="nickname-input-wrapper">
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  placeholder="2-20자, 한글/영문/숫자/_/- 가능"
                  className={
                    errors.nickname ? "error" : nicknameChecked ? "success" : ""
                  }
                  disabled={authLoading}
                />
                <button
                  type="button"
                  className="check-button"
                  onClick={handleNicknameCheck}
                  disabled={authLoading || !formData.nickname}
                >
                  중복확인
                </button>
              </div>
              {errors.nickname && (
                <span className="error-text">{errors.nickname}</span>
              )}
              {nicknameChecked && (
                <span className="success-text">✓ 사용 가능한 닉네임입니다</span>
              )}
            </div>

            {/* 생년월일 */}
            <div className="form-group">
              <label htmlFor="birthdate">생년월일 (선택사항)</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={errors.birthdate ? "error" : ""}
                  disabled={authLoading}
                />
                <span className="input-icon"></span>
              </div>
              {errors.birthdate && (
                <span className="error-text">{errors.birthdate}</span>
              )}
            </div>

            {/* 성별 */}
            <div className="form-group">
              <label htmlFor="gender">성별 (선택사항)</label>
              <div className="input-wrapper">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={authLoading}
                >
                  <option value="">선택안함</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
                <span className="input-icon">
                  <svg
                    className="input-svg"
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

            {/* 프로필 이미지 */}
            <div className="form-group">
              <label htmlFor="profileImage">프로필 이미지 (선택사항)</label>
              <div className="profile-image-wrapper">
                {profileImagePreview && (
                  <div className="image-preview">
                    <img
                      src={profileImagePreview}
                      alt="프로필 미리보기"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, profileImage: null }));
                        setProfileImagePreview(null);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  className={errors.profileImage ? "error" : ""}
                  disabled={authLoading}
                />
                <small className="file-info">
                  JPG, PNG, WebP, GIF 파일만 가능 (최대 5MB)
                </small>
              </div>
              {errors.profileImage && (
                <span className="error-text">{errors.profileImage}</span>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="signup-button"
              disabled={authLoading}
            >
              {authLoading ? "처리 중..." : "회원가입"}
            </button>
          </form>
        </div>

        {/* 로그인 링크 */}
        <div className="login-section">
          이미 계정이 있으신가요?
          <Link to="/login" className="login-link">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
