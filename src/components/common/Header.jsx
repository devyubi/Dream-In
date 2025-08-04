import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../css/header.css";

function Header() {
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  const { isLoggedIn, setUser, signOut } = useAuth();

  const navigate = useNavigate();

  // 로그인 상태 및 다크모드 상태에 따라 로고 및 아이콘 경로 설정
  const logoSrc = "/images/logo.png";
  const authIconSrc = isDarkMode
    ? isLoggedIn
      ? "/images/logout_dark.svg"
      : "/images/login_dark.svg"
    : isLoggedIn
      ? "/images/logout_light.svg"
      : "/images/login_light.svg";

  const authText = isLoggedIn ? "로그아웃" : "로그인";

  // 로그인 또는 로그아웃 버튼 클릭 시 동작
  const handleAuthClick = async () => {
    if (isLoggedIn) {
      // 로그아웃
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      // 로그아웃 처리
      try {
        await signOut();
        localStorage.clear(); // 저장된 토큰 및 사용자 정보 제거 (로컬스토리지에서 제거)
        sessionStorage.clear();
        setUser(null);
        navigate("/");
      } catch (error) {
        // console.error("또오류났냐")
      }
    } else {
      navigate("/login");
    }
  };

  // 다크모드 테마 설정 변경 (body 태그에 data-theme 속성 적용)
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
