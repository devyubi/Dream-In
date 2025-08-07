// src/components/user/PasswordChangeModal.jsx
import { useState, useEffect } from "react";
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

  const { isLoading, error, success, handlePasswordChange } =
    usePasswordChange();

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors({});
    }
  }, [isOpen]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러 메시지 제거
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: "",
      }));
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

    await handlePasswordChange(formData.currentPassword, formData.newPassword);
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div
        className="password-modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="password-modal-header">
          <h2>비밀번호 변경</h2>
          <button
            className="password-modal-close"
            onClick={onClose}
            type="button"
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
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="현재 비밀번호를 입력하세요"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
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
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
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
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
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
