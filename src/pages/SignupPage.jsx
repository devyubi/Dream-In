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

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, user, authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: 기본정보, 2: 추가정보, 3: 완료

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

  // 1단계 유효성 검사 (기본정보)
  const validateStep1 = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2단계 유효성 검사 (추가정보)
  const validateStep2 = () => {
    const newErrors = {};

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

  // 다음 단계로
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  // 이전 단계로
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 회원가입 처리
  const handleSubmit = async () => {
    setMessage("");

    // 프로필 이미지 업로드는 회원가입 후에 처리
    const result = await signUp({
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      birthdate: formData.birthdate || null,
      gender: formData.gender || null,
      profileImage: formData.profileImage, // 파일 객체 전달
    });

    if (result.success) {
      setCurrentStep(3);
      setMessage(result.message);
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
      setCurrentStep(1);
    }
  };

  // Enter 키 처리
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep === 1) {
        handleNextStep();
      } else if (currentStep === 2) {
        handleSubmit();
      }
    }
  };

  // 프로그레스 바
  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
      <div className="step-labels">
        <span className={currentStep >= 1 ? "active" : ""}>기본정보</span>
        <span className={currentStep >= 2 ? "active" : ""}>추가정보</span>
        <span className={currentStep >= 3 ? "active" : ""}>완료</span>
      </div>
    </div>
  );

  // 1단계: 기본정보 입력
  const renderStep1 = () => (
    <div className="step-content">
      <h2>기본정보 입력</h2>
      <p>Dream-In에 오신 것을 환영합니다!</p>

      {/* 이메일 */}
      <div className="form-group">
        <label htmlFor="email">이메일 *</label>
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

      {/* 비밀번호 */}
      <div className="form-group">
        <label htmlFor="password">비밀번호 *</label>
        <div className="password-input-wrapper">
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

      {/* 비밀번호 확인 */}
      <div className="form-group">
        <label htmlFor="confirmPassword">비밀번호 확인 *</label>
        <div className="password-input-wrapper">
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
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={authLoading}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
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
    </div>
  );

  // 2단계: 추가정보 입력
  const renderStep2 = () => (
    <div className="step-content">
      <h2>추가정보 입력</h2>
      <p>더 나은 서비스를 위해 추가 정보를 입력해주세요. (선택사항)</p>

      {/* 생년월일 */}
      <div className="form-group">
        <label htmlFor="birthdate">생년월일</label>
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          className={errors.birthdate ? "error" : ""}
          disabled={authLoading}
        />
        {errors.birthdate && (
          <span className="error-text">{errors.birthdate}</span>
        )}
      </div>

      {/* 성별 */}
      <div className="form-group">
        <label htmlFor="gender">성별</label>
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
      </div>

      {/* 프로필 이미지 */}
      <div className="form-group">
        <label htmlFor="profileImage">프로필 이미지</label>
        <div className="profile-image-wrapper">
          {profileImagePreview && (
            <div className="image-preview">
              <img
                src={profileImagePreview}
                alt="프로필 미리보기"
                style={{ width: "50px", height: "50px" }}
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
          <small>JPG, PNG, WebP, GIF 파일만 가능 (최대 5MB)</small>
        </div>
        {errors.profileImage && (
          <span className="error-text">{errors.profileImage}</span>
        )}
      </div>
    </div>
  );

  // 3단계: 완료
  const renderStep3 = () => (
    <div className="step-content completion">
      <div className="completion-icon">🎉</div>
      <h2>회원가입 완료!</h2>
      <p>Dream-In에 가입해주셔서 감사합니다.</p>
      <p className="email-notice">
        가입하신 이메일(<strong>{formData.email}</strong>)로 인증 메일을
        발송했습니다.
        <br />
        이메일 인증 후 로그인해주세요.
      </p>

      <div className="completion-buttons">
        <button className="login-button" onClick={() => navigate("/login")}>
          로그인 페이지로
        </button>
      </div>
    </div>
  );

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        {/* 로고/헤더 */}
        <div className="signup-header">
          <h1 className="app-title">Dream-In</h1>
          <p className="app-subtitle">꿈을 기록하고 나를 이해하는 여정</p>
        </div>

        {/* 프로그레스 바 */}
        {renderProgressBar()}

        {/* 폼 */}
        <form className="signup-form" onSubmit={e => e.preventDefault()}>
          {/* 메시지 */}
          {message && <div className="message success">{message}</div>}

          {errors.submit && (
            <div className="message error">{errors.submit}</div>
          )}

          {/* 단계별 콘텐츠 */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* 버튼들 */}
          {currentStep < 3 && (
            <div className="form-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="prev-button"
                  onClick={handlePrevStep}
                  disabled={authLoading}
                >
                  이전
                </button>
              )}

              <button
                type="button"
                className="next-button"
                onClick={handleNextStep}
                disabled={authLoading}
              >
                {authLoading
                  ? "처리 중..."
                  : currentStep === 2
                    ? "회원가입"
                    : "다음"}
              </button>
            </div>
          )}

          {/* 로그인 링크 */}
          {currentStep < 3 && (
            <div className="login-link">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="link">
                로그인
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
