import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../css/home/statssection.css";

export function RecordSection() {
  const { isDarkMode } = useThemeContext();
  const { isLoggedIn, user } = useAuth();

  return (
    <section className="main_record">
      {/* 기록하기 */}
      <div className="main_record_wrap">
        <h2>기록하기</h2>
        {!isLoggedIn ? (
          <div className="overlay">로그인 시 이용 가능합니다</div>
        ) : (
          <div className="record">
            {[
              [
                "/images/note_light.svg",
                "꿈 기록하기",
                "오늘 밤 꾼 꿈을 기록해보세요.",
                "/write",
              ],
              [
                "/images/moon_light.svg",
                "감정 일기",
                "오늘의 감정을 기록해 보세요.",
                "/emotion",
              ],
              [
                "/images/smile_light.svg",
                "수면 기록",
                "수면 패턴을 기록하고 관리해 보세요.",
                "/sleep",
              ],
            ].map(([icon, title, desc, link], i) => (
              <Link to={link} className="record_box" key={i}>
                <img src={icon} alt={title} />
                <span>{title}</span>
                <span>{desc}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecordSection;
