import React, { useState, useEffect } from "react";
import "../css/header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../api/supabaseClient";
import { useNavigate } from "react-router-dom";

function Header() {
  const { isDarkMode, setIsDarkMode, isLoggedIn, setIsLoggedIn, setUser } =
    useAuth();

  const navigate = useNavigate();

  // 다크모드 & 로그인 상태에 따라 이미지 경로 변경
  const logoSrc = "/logo.png";
  const authIconSrc = isDarkMode
    ? isLoggedIn
      ? "/logout_dark.svg"
      : "/login_dark.svg"
    : isLoggedIn
      ? "/logout_light.svg"
      : "/login_light.svg";

  const authText = isLoggedIn ? "로그아웃" : "로그인";

  // 로그인, 로그아웃 버튼
  const handleAuthClick = async () => {
    if (isLoggedIn) {
      // 로그아웃
      await supabase.auth.signOut(); // 세션 종료
      setIsLoggedIn(false); // 전역 로그인 상태는 false로 처리했습니다
      setUser(null); // 유저 정보 초기화함
    } else {
      // 이건 새로고침 없이 로그인 페이지로 이동함다
      navigate("/login");
    }
  };

  // 다크모드 테마 변경 전역변수
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  return (
    <header className="header_top">
      <Link to="/">
        <img src={logoSrc} alt="로고" className="header_logo" />
      </Link>

      <div className="header_rightMenu">
        <button
          className="header_button"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          <img
            src={isDarkMode ? "/lightmode.svg" : "/darkmode.svg"}
            alt={isDarkMode ? "라이트모드" : "다크모드"}
            className="header__icon"
          />
          {isDarkMode ? "라이트모드" : "다크모드"}
        </button>
        <button
          className="header_button"
          onClick={handleAuthClick}
          aria-label={authText}
        >
          <img src={authIconSrc} alt={authText} className="header__icon" />
          {authText}
        </button>
      </div>
    </header>
  );
}

export default Header;
