import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordByInfo } from "../api/auth";
import "../css/user/FindPasswordPage.css";
import { useThemeContext } from "../contexts/ThemeContext";

const FindPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    birthdate: "",
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useThemeContext();

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 입력 시 에러 메시지 초기화
    if (error) setError("");
  };

  const handleClose = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.email || !formData.nickname || !formData.birthdate) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("=== FindPasswordPage에서 API 호출 ===");
      console.log("전송할 데이터:", {
        email: formData.email,
        nickname: formData.nickname,
        birthdate: formData.birthdate,
      });

      // 사용자 정보 확인 및 초기 비밀번호 생성
      const newPassword = await resetPasswordByInfo(
        formData.email,
        formData.nickname,
        formData.birthdate,
      );

      console.log("=== API 응답 결과 ===");
      console.log("newPassword:", newPassword);

      if (newPassword && newPassword.success) {
        console.log("=== 성공 처리 ===");
        setResult({
          success: true,
          password: newPassword.tempPassword,
          message: newPassword.message,
        });
      } else {
        console.log("=== 실패 처리 (success가 false) ===");
        setError(
          "입력하신 정보와 일치하는 계정을 찾을 수 없습니다. 이메일, 닉네임, 생년월일을 다시 확인해주세요.",
        );
      }
    } catch (err) {
      console.log("=== catch 블록에서 에러 처리 ===");
      console.error("에러 객체:", err);
      console.error("에러 메시지:", err.message);

      // 에러 메시지 처리
      let errorMessage =
        err.message ||
        "비밀번호 재설정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      if (err.message?.includes("User not found")) {
        errorMessage = "등록되지 않은 사용자입니다.";
      } else if (err.message?.includes("Invalid information")) {
        errorMessage = "입력하신 정보가 일치하지 않습니다.";
      } else if (err.message?.includes("rate limit")) {
        errorMessage =
          "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
      } else if (err.message?.includes("찾을 수 없습니다")) {
        errorMessage = err.message; // 원본 메시지 사용
      }

      console.log("=== 최종 에러 메시지 ===");
      console.log("errorMessage:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", nickname: "", birthdate: "" });
    setResult(null);
    setError("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.password);
      alert("비밀번호가 클립보드에 복사되었습니다.");
    } catch (err) {
      // 클립보드 API가 지원되지 않는 경우 fallback
      const textArea = document.createElement("textarea");
      textArea.value = result.password;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("비밀번호가 클립보드에 복사되었습니다.");
    }
  };

  return (
    <div className="find-password-container">
      {/* 로고 섹션 */}
      <div className="logo-section">
        <div className="logo-circle">
          <img
            src={
              isDarkMode ? "/images/icon-dark.png" : "/images/icon-light.png"
            }
            alt="Dream-in Logo"
            className="logo-image"
          />
        </div>
        <h1 className={`app-title ${isDarkMode ? "dark-mode" : "light-mode"}`}>
          Dream-in
        </h1>
      </div>

      {/* 비밀번호 재설정 모달 */}
      <div className="password-reset-modal">
        <div className="modal-header">
          <h2>비밀번호 재설정</h2>
        </div>

        <div className="modal-content">
          {!result ? (
            <>
              <p className="modal-description">
                가입하신 이메일, 닉네임, 생년월일을 입력하시면 임시 비밀번호를
                생성해드립니다.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="가입한 이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={error && !formData.email ? "error" : ""}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="nickname">닉네임</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="가입 시 사용한 닉네임"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className={error && !formData.nickname ? "error" : ""}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="birthdate">생년월일</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    className={error && !formData.birthdate ? "error" : ""}
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && <div className="message error">{error}</div>}

                <div className="button-group">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={
                      isLoading ||
                      !formData.email ||
                      !formData.nickname ||
                      !formData.birthdate
                    }
                  >
                    {isLoading ? "생성 중..." : "임시 비밀번호 생성"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="result-section">
              <div className="success-message">
                <span className="success-icon">🔑</span>
                <h3>임시 비밀번호가 생성되었습니다!</h3>
              </div>

              <div className="password-result">
                <div className="password-display">
                  <span className="password-label">임시 비밀번호:</span>
                  <div className="password-container">
                    <span className="password-text">{result.password}</span>
                    <button
                      onClick={copyToClipboard}
                      className="copy-button"
                      title="클립보드에 복사"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <p className="password-note">
                  ⚠️{" "}
                  {result.message ||
                    "보안을 위해 로그인 후 반드시 비밀번호를 변경해주세요."}
                </p>
              </div>

              <div className="button-group">
                <button onClick={resetForm} className="cancel-button">
                  다시 생성
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="submit-button"
                >
                  로그인하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
