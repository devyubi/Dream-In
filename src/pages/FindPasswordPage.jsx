import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient"; // 프로젝트의 supabase 클라이언트 import
import "./FindPasswordPage.css";

const FindPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/login"); // 로그인 페이지로 이동
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email) {
      setMessage("이메일을 입력해주세요.");
      setIsError(true);
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("올바른 이메일 형식을 입력해주세요.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Supabase 비밀번호 재설정 이메일 발송
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // 비밀번호 재설정 페이지 URL
      });

      if (error) {
        throw error;
      }

      setMessage(
        "비밀번호 재설정 링크를 이메일로 발송했습니다. 이메일을 확인해주세요.",
      );
      setIsError(false);

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      // console.log("Password reset error:", error);

      // Supabase 에러 메시지에 따른 한국어 처리
      let errorMessage = "오류가 발생했습니다. 다시 시도해주세요.";

      if (error.message?.includes("Invalid email")) {
        errorMessage = "올바른 이메일 형식을 입력해주세요.";
      } else if (error.message?.includes("User not found")) {
        errorMessage = "등록되지 않은 이메일입니다.";
      } else if (error.message?.includes("rate limit")) {
        errorMessage =
          "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.";
      }

      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="find-password-container">
      {/* 로고 섹션 */}
      <div className="logo-section">
        <div className="logo-circle">
          <img
            src="/images/logo.png"
            alt="Dream-in Logo"
            className="logo-image"
          />
        </div>
        <h1 className="app-title">Dream-in</h1>
      </div>

      {/* 비밀번호 재설정 모달 */}
      <div className="password-reset-modal">
        <div className="modal-header">
          <h2>비밀번호 재설정</h2>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            가입하신 이메일 주소를 입력하시면, 비밀번호 재설정 링크를
            보내드립니다.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>이메일</label>
              <input
                type="email"
                placeholder="가입한 이메일을 입력하세요"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (message) {
                    setMessage("");
                  }
                }}
                className={isError && !email ? "error" : ""}
                disabled={isLoading}
              />
            </div>

            {message && (
              <div className={`message ${isError ? "error" : "success"}`}>
                {message}
              </div>
            )}

            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={handleClose}
                disabled={isLoading}
              >
                {/* 취소  */}
                아이메일이기억났어요로그인하러갈께요!!!!!!!
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !email}
              >
                {isLoading ? "발송 중..." : "재설정 이메일 발송"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 배경 그라데이션 */}
      <div className="background-gradient"></div>
    </div>
  );
};

export default FindPasswordPage;
