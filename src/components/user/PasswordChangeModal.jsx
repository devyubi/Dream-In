// src/components/user/PasswordChangeModal.jsx
import { useState, useEffect, useRef } from "react";
import { usePasswordChange } from "../../hooks/usePasswordChange.js";
import "./PasswordChangeModal.css";

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

  // 모달이 열릴 때마다 상태 초기화 + 포커스
  // 성공 시 모달 자동 닫기
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.currentPassword)
      errors.currentPassword = "현재 비밀번호를 입력해주세요.";
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
    ("폼 제출 시작");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      ("유효성 검사 실패:", errors);
      setValidationErrors(errors);
      return;
    }

    ("비밀번호 변경 요청 시작");
    const result = await handlePasswordChange(
      formData.currentPassword,
      formData.newPassword,
    );
    ("비밀번호 변경 결과:", result);

    if (result?.success) {
      alert("비밀번호가 변경되었습니다.");
      onClose();
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="password-modal-overlay"
      // 오버레이 빈 영역 클릭 시에만 닫기 + 로딩 중엔 닫기 금지
      onMouseDown={e => {
        if (isLoading) return;
        if (e.target === e.currentTarget) onClose();
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
            onClick={onClose}
            type="button"
            disabled={isLoading}
          >
            닫기
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
                // 입력 자체가 안 되면 일단 disabled는 잠시 빼고 원인 파악
                // disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("current")}
                disabled={isLoading}
                aria-label={showPasswords.current ? "숨김" : "보기"}
                title={showPasswords.current ? "숨김" : "보기"}
              >
                {showPasswords.current ? "숨김" : "보기"}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <span className="error-message">
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
                // disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isLoading}
                aria-label={showPasswords.new ? "숨김" : "보기"}
                title={showPasswords.new ? "숨김" : "보기"}
              >
                {showPasswords.new ? "숨김" : "보기"}
              </button>
            </div>
            {validationErrors.newPassword && (
              <span className="error-message">
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
                // disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isLoading}
                aria-label={showPasswords.confirm ? "숨김" : "보기"}
                title={showPasswords.confirm ? "숨김" : "보기"}
              >
                {showPasswords.confirm ? "숨김" : "보기"}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <span className="error-message">
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          {/* 에러/성공 메시지 */}
          {error && <div className="error-message global-error">{error}</div>}
          {success && (
            <div className="success-message">
              비밀번호가 성공적으로 변경되었습니다!
            </div>
          )}

          {/* 버튼 */}
          <div className="password-modal-buttons">
            <button
              type="button"
              onClick={onClose}
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
