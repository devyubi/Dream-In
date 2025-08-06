// src/components/auth/PasswordResetModal.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "../../hooks/useForm";
import { validateEmail } from "../../utils/validation";

const PasswordResetModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialEmail = "",
}) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldState,
    formState,
    setValue,
  } = useForm(
    { email: initialEmail },
    formData => {
      const emailValidation = validateEmail(formData.email);
      return {
        isValid: emailValidation.isValid,
        errors: emailValidation.isValid
          ? {}
          : { email: emailValidation.message },
      };
    },
    { validateOnBlur: true },
  );

  const emailState = getFieldState("email");

  // 초기 이메일 설정
  useEffect(() => {
    if (initialEmail && initialEmail !== values.email) {
      setValue("email", initialEmail);
    }
  }, [initialEmail, setValue, values.email]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = e => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, loading]);

  const handleFormSubmit = handleSubmit(async formData => {
    const result = await onSubmit(formData.email);
    return result;
  });

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal-content"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 id="modal-title">비밀번호 재설정</h3>
          <button
            className="close-button"
            onClick={onClose}
            disabled={loading}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            가입하신 이메일 주소를 입력하시면, 비밀번호 재설정 링크를
            보내드립니다.
          </p>

          <form onSubmit={handleFormSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="resetEmail">이메일</label>
              <input
                type="email"
                id="resetEmail"
                name="email"
                value={emailState.value || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="가입한 이메일을 입력하세요"
                className={emailState.showError ? "error" : ""}
                disabled={loading}
                autoComplete="email"
                autoFocus
                aria-describedby={
                  emailState.showError ? "email-error" : undefined
                }
              />
              {emailState.showError && (
                <span id="email-error" className="error-text" role="alert">
                  {emailState.error}
                </span>
              )}
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading || !formState.isValid}
              >
                {loading ? "발송 중..." : "재설정 이메일 발송"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 400px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.2s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 18px;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          transition: all 0.2s ease;
        }

        .close-button:hover:not(:disabled) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .close-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .modal-body {
          padding: 0 24px 24px 24px;
        }

        .modal-description {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background-color: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error {
          border-color: #ef4444;
        }

        .form-group input:disabled {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .error-text {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #ef4444;
          font-weight: 500;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .modal-buttons button {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .cancel-button {
          background-color: #f3f4f6;
          color: #374151;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .submit-button {
          background-color: #3b82f6;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .cancel-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* 반응형 디자인 */
        @media (max-width: 480px) {
          .modal-overlay {
            padding: 16px;
          }

          .modal-content {
            max-width: 100%;
          }

          .modal-header {
            padding: 20px 20px 0 20px;
            margin-bottom: 20px;
          }

          .modal-header h3 {
            font-size: 16px;
          }

          .modal-body {
            padding: 0 20px 20px 20px;
          }

          .modal-buttons {
            flex-direction: column-reverse;
            gap: 8px;
          }

          .modal-buttons button {
            width: 100%;
            padding: 12px 16px;
          }
        }

        /* 다크 모드 대응 */
        @media (prefers-color-scheme: dark) {
          .modal-content {
            background: #1f2937;
            color: #f3f4f6;
          }

          .modal-header {
            border-bottom-color: #374151;
          }

          .modal-header h3 {
            color: #f3f4f6;
          }

          .close-button {
            color: #9ca3af;
          }

          .close-button:hover:not(:disabled) {
            background-color: #374151;
            color: #f3f4f6;
          }

          .modal-description {
            color: #d1d5db;
          }

          .form-group label {
            color: #f3f4f6;
          }

          .form-group input {
            background-color: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .form-group input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
          }

          .form-group input:disabled {
            background-color: #111827;
            color: #9ca3af;
          }

          .cancel-button {
            background-color: #374151;
            color: #f3f4f6;
          }

          .cancel-button:hover:not(:disabled) {
            background-color: #4b5563;
          }
        }
      `}</style>
    </div>
  );
};

PasswordResetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialEmail: PropTypes.string,
};

export default PasswordResetModal;
