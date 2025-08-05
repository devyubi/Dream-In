// src/components/auth/SocialLoginButtons.jsx
import { signInWithGoogle, signInWithKakao } from "../../api/auth";
import styles from "./SocialLoginButtons.module.css";

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
    <div className={styles.socialLoginButtons}>
      {/* Kakao 로그인 버튼 */}
      <button
        type="button"
        onClick={handleKakaoLogin}
        disabled={disabled}
        className={`${styles.socialLoginButton} ${styles.kakaoLogin}`}
      >
        <span className={`${styles.socialIcon} ${styles.kakaoIcon}`}>TALK</span>
        <span className={styles.socialText}>카카오로 시작하기</span>
      </button>

      {/* Google 로그인 버튼 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={disabled}
        className={`${styles.socialLoginButton} ${styles.googleLogin}`}
      >
        <span className={`${styles.socialIcon} ${styles.googleIcon}`}>G</span>
        <span className={styles.socialText}>구글로 시작하기</span>
      </button>
    </div>
  );
};

export default SocialLoginButtons;
