import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";

export function StatsSection() {
  const { isDarkMode } = useThemeContext();
  const { isLoggedIn, user } = useAuth();

  const iconSet = [
    [`/images/total_${isDarkMode ? "dark" : "light"}.svg`, 24, "총 꿈 기록"],
    [
      `/images/calendar_${isDarkMode ? "dark" : "light"}.svg`,
      13,
      "이번 달 기록",
    ],
    [`/images/clock_${isDarkMode ? "dark" : "light"}.svg`, 8, "평균 수면 시간"],
    [`/images/ai_${isDarkMode ? "dark" : "light"}.svg`, 4, "주간 꿈 해몽"],
  ];

  return (
    <section className="main_section">
      <div className="my_state">
        <div className={`login_content ${!isLoggedIn ? "" : "blurred"}`}>
          {!isLoggedIn && (
            <div className="blur_overlay">로그인 시 이용 가능합니다</div>
          )}

          {!isLoggedIn && (
            <div className="total">
              {iconSet.map(([icon, num, text], i) => (
                <button className="mytotal" key={i}>
                  <img src={icon} alt={text} />
                  <span><h3>{num}</h3></span>
                  <span>{text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
