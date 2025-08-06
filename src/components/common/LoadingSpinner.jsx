// src/components/common/LoadingSpinner.jsx
import PropTypes from "prop-types";

const LoadingSpinner = ({
  size = "medium",
  message = "",
  variant = "primary",
  inline = false,
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  const variantClasses = {
    primary: "spinner-primary",
    secondary: "spinner-secondary",
    white: "spinner-white",
  };

  const containerClass = `
    loading-spinner-container 
    ${inline ? "inline" : ""} 
    ${fullScreen ? "full-screen" : ""}
  `.trim();

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={`spinner ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        <div className="spinner-circle"></div>
      </div>
      {message && (
        <p className="loading-message" aria-label={`로딩 중: ${message}`}>
          {message}
        </p>
      )}

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .loading-spinner-container.inline {
          display: inline-flex;
          flex-direction: row;
          gap: 8px;
        }

        .loading-spinner-container.full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(2px);
          z-index: 9999;
        }

        .spinner {
          display: inline-block;
          position: relative;
        }

        .spinner-circle {
          border-radius: 50%;
          border-style: solid;
          animation: spin 1s linear infinite;
        }

        /* 크기 변형 */
        .spinner-small .spinner-circle {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .spinner-medium .spinner-circle {
          width: 24px;
          height: 24px;
          border-width: 3px;
        }

        .spinner-large .spinner-circle {
          width: 40px;
          height: 40px;
          border-width: 4px;
        }

        /* 색상 변형 */
        .spinner-primary .spinner-circle {
          border-color: #e5e7eb;
          border-top-color: #3b82f6;
        }

        .spinner-secondary .spinner-circle {
          border-color: #e5e7eb;
          border-top-color: #6b7280;
        }

        .spinner-white .spinner-circle {
          border-color: rgba(255, 255, 255, 0.3);
          border-top-color: white;
        }

        .loading-message {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          text-align: center;
          font-weight: 500;
        }

        .loading-spinner-container.inline .loading-message {
          font-size: 13px;
        }

        .loading-spinner-container.full-screen .loading-message {
          font-size: 16px;
          color: #374151;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* 다크 모드 */
        @media (prefers-color-scheme: dark) {
          .loading-spinner-container.full-screen {
            background: rgba(17, 24, 39, 0.9);
          }

          .loading-message {
            color: #d1d5db;
          }

          .loading-spinner-container.full-screen .loading-message {
            color: #f3f4f6;
          }

          .spinner-primary .spinner-circle {
            border-color: #374151;
            border-top-color: #60a5fa;
          }

          .spinner-secondary .spinner-circle {
            border-color: #374151;
            border-top-color: #9ca3af;
          }
        }

        /* 접근성 개선 */
        @media (prefers-reduced-motion: reduce) {
          .spinner-circle {
            animation: none;
            border-top-color: transparent;
            border-right-color: transparent;
          }
        }

        /* 반응형 디자인 */
        @media (max-width: 480px) {
          .loading-spinner-container.full-screen .loading-message {
            font-size: 14px;
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  message: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "white"]),
  inline: PropTypes.bool,
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
