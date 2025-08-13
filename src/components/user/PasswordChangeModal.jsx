// src/components/user/PasswordChangeModal.jsx
import { useEffect, useRef, useState } from "react";
import "../../css/user/PasswordChangeModal.css";
import { usePasswordChange } from "../../hooks/usePasswordChange.js";

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { isLoading, error, success, handlePasswordChange, resetState } =
    usePasswordChange();

  const firstInputRef = useRef(null);

  // 모달이 처음 열릴 때만 상태 초기화 + 포커스
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      // 폼 데이터 초기화
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // 유효성 검사 에러 초기화
      setValidationErrors({});

      // 비밀번호 표시 상태 초기화
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });

      // 패스워드 변경 훅 상태 초기화
      if (resetState) {
        resetState();
      }

      setIsInitialized(true);

      // 첫 번째 입력 필드에 포커스
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    } else if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen, isInitialized, resetState]);

  // 성공 시 모달 자동 닫기
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  // 모달 닫기 함수 (상태 초기화 포함)
  const handleClose = () => {
    // 모달 닫기 전에 상태 초기화
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setValidationErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    resetState();

    // 부모 컴포넌트의 onClose 호출
    onClose();
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 해당 필드의 유효성 검사 에러 제거
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }

    if (!formData.newPassword) {
      errors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "비밀번호는 최소 6자 이상이어야 합니다.";
    } else if (formData.newPassword === formData.currentPassword) {
      errors.newPassword = "현재 비밀번호와 다른 비밀번호를 입력해주세요.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "새 비밀번호를 다시 입력해주세요.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "새 비밀번호가 일치하지 않습니다.";
    }

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const result = await handlePasswordChange(
      formData.currentPassword,
      formData.newPassword,
    );

    if (result?.success) {
      alert("비밀번호가 변경되었습니다.");
      handleClose(); // 성공 시 상태 초기화와 함께 모달 닫기
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = e => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isOpen, isLoading]);

  if (!isOpen) return null;

  return (
    <div
      className="password-modal-overlay"
      onMouseDown={e => {
        if (isLoading) return;
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="password-modal-content"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="password-modal-header">
          <h2>비밀번호 변경</h2>
          <button
            className="password-modal-close"
            onClick={handleClose}
            type="button"
            disabled={isLoading}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="password-change-form">
          {/* 현재 비밀번호 */}
          <div className="password-input-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                ref={firstInputRef}
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="현재 비밀번호를 입력하세요"
                autoComplete="current-password"
                aria-describedby={
                  validationErrors.currentPassword
                    ? "currentPassword-error"
                    : undefined
                }
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("current")}
                aria-label={
                  showPasswords.current ? "비밀번호 숨김" : "비밀번호 보기"
                }
                title={showPasswords.current ? "숨김" : "보기"}
              >
                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <span
                id="currentPassword-error"
                className="error-message"
                role="alert"
              >
                {validationErrors.currentPassword}
              </span>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div className="password-input-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                autoComplete="new-password"
                aria-describedby={
                  validationErrors.newPassword ? "newPassword-error" : undefined
                }
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isLoading}
                aria-label={
                  showPasswords.new ? "비밀번호 숨김" : "비밀번호 보기"
                }
                title={showPasswords.new ? "숨김" : "보기"}
              >
                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {validationErrors.newPassword && (
              <span
                id="newPassword-error"
                className="error-message"
                role="alert"
              >
                {validationErrors.newPassword}
              </span>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="password-input-group">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isLoading}
                autoComplete="new-password"
                aria-describedby={
                  validationErrors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isLoading}
                aria-label={
                  showPasswords.confirm ? "비밀번호 숨김" : "비밀번호 보기"
                }
                title={showPasswords.confirm ? "숨김" : "보기"}
              >
                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span
                id="confirmPassword-error"
                className="error-message"
                role="alert"
              >
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="error-message global-error" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="success-message" role="alert">
              비밀번호가 성공적으로 변경되었습니다!
            </div>
          )}

          {/* 버튼 */}
          <div className="password-modal-buttons">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-btn"
              disabled={isLoading}
            >
              취소
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "변경 중..." : "변경하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
