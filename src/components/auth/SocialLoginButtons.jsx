// src/components/auth/SocialLoginButtons.jsx
import { signInWithGoogle, signInWithKakao } from "../../api/auth";

// eslint-disable-next-line react/prop-types
const SocialLoginButtons = ({ disabled = false, onError = null }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        const errorMessage = "Google 로그인 실패: " + result.error;
        if (onError) {
          onError(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = "Google 로그인 중 오류 발생: " + error.message;
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const result = await signInWithKakao();
      if (!result.success) {
        const errorMessage = "카카오 로그인 실패: " + result.error;
        if (onError) {
          onError(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = "카카오 로그인 중 오류 발생: " + error.message;
      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="social-login-buttons">
      {/* Google 로그인 버튼 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={disabled}
        className="social-login-button google-login"
      >
        <span className="social-icon">🔍</span>
        <span className="social-text">Google로 로그인</span>
      </button>

      {/* Kakao 로그인 버튼 */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={disabled}
        className="social-login-button kakao-login"
      >
        <span className="social-icon">💬</span>
        <span className="social-text">카카오로 로그인</span>
      </button>

      <style>{`
        .social-login-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          margin: 16px 0;
        }

        .social-login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .social-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .google-login {
          background-color: #4285f4;
          color: white;
        }

        .google-login:hover:not(:disabled) {
          background-color: #3367d6;
          transform: translateY(-1px);
        }

        .kakao-login {
          background-color: #fee500;
          color: #000;
        }

        .kakao-login:hover:not(:disabled) {
          background-color: #fdd835;
          transform: translateY(-1px);
        }

        .social-icon {
          font-size: 18px;
        }

        .social-text {
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .social-login-button {
            padding: 12px 16px;
            font-size: 13px;
          }

          .social-icon {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SocialLoginButtons;
