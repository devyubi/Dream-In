import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findEmailByInfo } from "../api/auth";
import "../css/user/FindEmailPage.css";
import { useThemeContext } from "../contexts/ThemeContext";

const FindEmailPage = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isDarkMode = useThemeContext();

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
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const foundEmail = await findEmailByInfo(
        formData.nickname,
        formData.birthdate,
      );

      if (foundEmail) {
        setResult({
          success: true,
          email: foundEmail,
        });
      } else {
        setError(
          "입력하신 닉네임과 생년월일로 등록된 계정을 찾을 수 없습니다.",
        );
      }
    } catch (err) {
      setError(
        "이메일 찾기 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ nickname: "", birthdate: "" });
    setResult(null);
    setError("");
  };

  return (
    <div className="find-email-container">
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
        <h1 className="app-title">Dream-in</h1>
      </div>

      {/* 이메일 찾기 모달 */}
      <div className="email-find-modal">
        <div className="modal-header">
          <h2>이메일 찾기</h2>
        </div>

        <div className="modal-content">
          {!result ? (
            <>
              <p className="modal-description">
                가입 시 입력한 닉네임과 생년월일을 입력해주세요
              </p>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="nickname">닉네임</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="가입 시 사용한 닉네임"
                    required
                    disabled={loading}
                    className={error && !formData.nickname ? "error" : ""}
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
                    required
                    disabled={loading}
                    className={error && !formData.birthdate ? "error" : ""}
                  />
                </div>

                {error && <div className="message error">{error}</div>}

                <div className="button-group">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={
                      loading || !formData.nickname || !formData.birthdate
                    }
                  >
                    {loading ? "찾는 중..." : "이메일 찾기"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="result-section">
              <div className="success-message">
                <span className="success-icon">✅</span>
                <h3>이메일을 찾았습니다!</h3>
              </div>

              <div className="email-result">
                <div className="email-display">
                  <span className="email-label">찾은 이메일:</span>
                  <span className="email-text">{result.email}</span>
                </div>
              </div>

              <div className="button-group">
                <button onClick={resetForm} className="cancel-button">
                  다시 찾기
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

      {/* 배경 그라데이션 */}
      <div className="background-gradient"></div>
    </div>
  );
};

export default FindEmailPage;
