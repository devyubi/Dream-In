// src/pages/SignupPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../utils/errorHandler";
import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp, user, authLoading } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  /**
   * 회원가입 처리
   */
  const handleSignup = async formData => {
    setMessage("");
    setError("");

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        birthdate: formData.birthdate || null,
        gender: formData.gender || null,
        profileImage: formData.profileImage,
        marketingAgreed: formData.marketingAgreed || false,
      });

      if (result.success) {
        setMessage(
          result.message || "회원가입이 완료되었습니다. 이메일을 확인해주세요.",
        );

        // 회원가입 성공 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message: "회원가입이 완료되었습니다. 로그인해주세요.",
              email: formData.email,
            },
          });
        }, 2000);

        return { success: true };
      } else {
        const errorMessage = getErrorMessage(result.error);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * 닉네임 중복확인 성공 콜백
   */
  const handleNicknameCheckSuccess = nickname => {
    setMessage(`"${nickname}" 사용 가능한 닉네임입니다.`);

    // 2초 후 메시지 제거
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  /**
   * 메시지 자동 제거
   */
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /**
   * 에러 자동 제거
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #E8D5FF 0%, #F0E6FF 50%, #E8D5FF 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* 네비게이션 */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          style={{
            background: "rgba(139, 92, 246, 0.2)",
            border: "none",
            color: "#8B5CF6",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "8px 12px",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => navigate(-1)}
          disabled={authLoading}
          onMouseEnter={e => {
            e.target.style.background = "rgba(139, 92, 246, 0.3)";
            e.target.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={e => {
            e.target.style.background = "rgba(139, 92, 246, 0.2)";
            e.target.style.transform = "translateX(0)";
          }}
        >
          ←
        </button>
        <div></div>
      </nav>

      {/* 메인 컨테이너 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* 로고 섹션 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              overflow: "hidden",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Dream-in Logo"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#8B5CF6",
              margin: "0 0 8px 0",
              textShadow: "0 2px 4px rgba(139, 92, 246, 0.1)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Dream-In
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(139, 92, 246, 0.8)",
              margin: "0",
              fontWeight: "300",
            }}
          >
            꿈을 기록하고 나를 이해하는 여정
          </p>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontSize: "14px",
              fontWeight: "500",
              textAlign: "center",
              background: "rgba(16, 185, 129, 0.9)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontSize: "14px",
              fontWeight: "500",
              textAlign: "center",
              background: "rgba(239, 68, 68, 0.9)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            {error}
          </div>
        )}

        {/* 회원가입 폼 */}
        <SignupForm
          onSubmit={handleSignup}
          onNicknameCheck={handleNicknameCheckSuccess}
          loading={authLoading}
        />

        {/* 로그인 링크 */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            marginBottom: "20px",
            color: "rgba(139, 92, 246, 0.8)",
            fontSize: "14px",
          }}
        >
          <span>계정이 이미 있으신가요?</span>
          <Link
            to="/login"
            style={{
              color: "#8B5CF6",
              fontWeight: "600",
              textDecoration: "none",
              marginLeft: "8px",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.target.style.background = "rgba(139, 92, 246, 0.1)";
            }}
            onMouseLeave={e => {
              e.target.style.background = "transparent";
            }}
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
