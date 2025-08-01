// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("인증 콜백 에러:", error);
          navigate("/login");
        } else if (data.session) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("콜백 처리 중 오류:", error);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback">
      <div className="loading-container">
        <h2>로그인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
