import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import "../../css/home/recordsection.css";

export function RecordSection() {
  const { isDarkMode } = useThemeContext();
  const { isLoggedIn } = useAuth();

  const recordItems = [
    {
      icon: `/images/note_${isDarkMode ? "dark" : "light"}.svg`,
      label: "꿈 기록하기",
      desc: "오늘 밤 꾼 꿈을 기록해보세요.",
      path: "/dreamwrite",
    },
    {
      icon: `/images/moon_${isDarkMode ? "dark" : "light"}.svg`,
      label: "감정 일기",
      desc: "오늘의 감정을 기록해 보세요.",
      path: "/emotionwrite",
    },
    {
      icon: `/images/smile_${isDarkMode ? "dark" : "light"}.svg`,
      label: "수면 기록",
      desc: "수면 패턴을 기록하고 관리해 보세요.",
      path: "/sleeprecord",
    },
  ];

  return (
    <section className="main_record">
      <div className="main_record_wrap">
        <div className="hoverbtn">
          {recordItems.map((item, i) => (
            <Link
              to={isLoggedIn ? item.path : "/login"}
              className="record_box"
              key={i}
            >
              <div className="record_title">
                <img src={item.icon} alt={item.label} />
                <span>
                  <strong>{item.label}</strong>
                </span>
                <span>{item.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecordSection;
