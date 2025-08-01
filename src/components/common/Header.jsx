import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../css/header.css";

function Header() {
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  const { isLoggedIn, setUser } = useAuth();

  const navigate = useNavigate();

  // 다크모드 & 로그인 상태에 따라 이미지 경로 변경
  const logoSrc = "/images/logo.png";
  const authIconSrc = isDarkMode
    ? isLoggedIn
      ? "/images/logout_dark.svg"
      : "/images/login_dark.svg"
    : isLoggedIn
      ? "/images/logout_light.svg"
      : "/images/login_light.svg";

  const authText = isLoggedIn ? "로그아웃" : "로그인";

  // 로그인, 로그아웃 버튼
  const handleAuthClick = async () => {
    if (isLoggedIn) {
      // 로그아웃

      await supabase.auth.signOut(); // 세션 종료
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
            src={isDarkMode ? "/images/lightmode.svg" : "/images/darkmode.svg"}
            alt={isDarkMode ? "라이트모드" : "다크모드"}
            className="header_icon"
          />
          {isDarkMode ? "라이트모드" : "다크모드"}
        </button>
        <button
          className="header_button"
          onClick={handleAuthClick}
          aria-label={authText}
        >
          <img src={authIconSrc} alt={authText} className="header_icon" />
          {authText}
        </button>
      </div>
    </header>
  );
}

export default Header;
