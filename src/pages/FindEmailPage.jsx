import React, { useState } from "react";
import { Link } from "react-router-dom";
import { findEmailByInfo } from "../api/auth";
import "./FindEmailPage.css";

const FindEmailPage = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 입력 시 에러 메시지 초기화
    if (error) setError("");
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
      console.error("이메일 찾기 오류:", err);
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
      <div className="find-email-card">
        <div className="card-header">
          <h1 className="title">이메일 찾기</h1>
          <p className="subtitle">
            가입 시 입력한 닉네임과 생년월일을 입력해주세요
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="find-form">
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
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !formData.nickname || !formData.birthdate}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  찾는 중...
                </>
              ) : (
                "이메일 찾기"
              )}
            </button>
          </form>
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

            <div className="action-buttons">
              <button onClick={resetForm} className="retry-btn">
                다시 찾기
              </button>
              <Link to="/login" className="login-btn">
                로그인하기
              </Link>
            </div>
          </div>
        )}

        <div className="footer-links">
          <Link to="/login" className="link">
            로그인
          </Link>
          <span className="separator">|</span>
          <Link to="/signup" className="link">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindEmailPage;
