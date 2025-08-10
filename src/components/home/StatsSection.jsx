import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../css/home/statssection.css";

export function StatsSection() {
  const { isDarkMode } = useThemeContext();
  const { isLoggedIn, user } = useAuth();

  const iconSet = [
    [
      `/images/total_${isDarkMode ? "dark" : "light"}.svg`,
      " 3",
      "총 꿈 기록",
      "/dreamlist",
    ],
    [
      `/images/calendar_${isDarkMode ? "dark" : "light"}.svg`,
      "3",
      "총 감정 기록",
      "/emotionlist",
    ],
    [
      `/images/clock_${isDarkMode ? "dark" : "light"}.svg`,
      "7시간 12분",
      "평균 수면 시간",
      "/sleeprecord",
    ],
    [
      `/images/ai_${isDarkMode ? "dark" : "light"}.svg`,
      "4",
      "주간 꿈 해몽",
      "/aidreamsresult",
    ],
  ];

  return (
    <section className="main_section">
      <div className="my_state">
        <div className={`login_content ${!isLoggedIn ? "blurred" : ""}`}>
          {!isLoggedIn && (
            <div className="blur_overlay">로그인 시 이용 가능합니다</div>
          )}

          <div className="total">
            {iconSet.map(([icon, num, text, path], i) => (
              <div key={i} className="hoverBt">
                <Link to={path} className="mytotal">
                  <img src={icon} alt={text} />
                  <span>
                    <h3>{num}</h3>
                  </span>
                  <span>{text}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
