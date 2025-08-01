import { useAuth } from "../../contexts/AuthContext";

/* eslint-disable no-unused-vars */
function RecordSection() {
  const { isLoggedIn, user } = useAuth();
  return (
    <section className="main_section">
      <div className="my_state">
        <h2>나의 통계</h2>
        {!isLoggedIn ? (
          <div className="overlay">로그인 시 이용 가능합니다</div>
        ) : (
          <div className="total">
            {[
              ["/images/total_light.svg", 24, "총 꿈 기록"],
              ["/images/calendar_light.svg", 13, "이번 달 기록"],
              ["/images/clock_light.svg", 8, "평균 수면 시간"],
              ["/images/ai_light.svg", 4, "주간 꿈 해몽"],
            ].map(([icon, num, text], i) => (
              <div key={i}>
                <img src={icon} alt={text} />
                <span>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecordSection;
