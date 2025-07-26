import React, { useState, useEffect } from "react";
import "../css/header.css";

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

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

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="header">
      <img src={logoSrc} alt="로고" className="header__logo" />
      <div className="header__rightMenu">
        <button
          className="header__button"
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
          className="header__button"
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
