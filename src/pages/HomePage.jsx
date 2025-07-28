// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import "../css/homepage.css";
import QuoteSwiper from "../components/QuoteSwiper";

const mockDreams = [
  {
    id: 1,
    title: "하늘을 나는 꿈",
    description: "구름 위를 자유롭게 날아다니는 꿈을 꾸었어요",
    date: "2025.07.18",
    isBookmarked: true,
  },
  {
    id: 2,
    title: "바다 속 모험",
    description: "깊은 바다 속에서 신비로운 생물들을 만났어요.",
    date: "2025.07.16",
    isBookmarked: true,
  },
  {
    id: 3,
    title: "우주 여행",
    description: "행성과 별 사이를 유영하는 꿈을 꾸었어요.",
    date: "2025.07.14",
    isBookmarked: true,
  },
];

function HomePage() {
  const { isLoggedIn, user } = useAuthContext();
  const [bookmarkedDreams, setBookmarkedDreams] = useState([]);

  useEffect(() => {
    // 최신순 정렬
    const sortedDreams = [...mockDreams].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setBookmarkedDreams(sortedDreams);
  }, []);

  const toggleBookmark = id => {
    setBookmarkedDreams(prev => {
      const updated = prev
        .map(dream =>
          dream.id === id ? { ...dream, isBookmarked: false } : dream,
        )
        .filter(dream => dream.isBookmarked);

      // 모킹데이터라서 강제로 3번째 보여줌
      if (updated.length < 2) {
        const extra = mockDreams.find(
          d => d.id === 3 && !updated.some(u => u.id === 3),
        );
        if (extra) updated.push(extra);
      }
      return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  };

  return (
    <div className="mainpage">
      <div className="mainpage_wrap">
        <section className="greeting">
          <h1>
            안녕하세요{isLoggedIn && user?.name ? `, ${user.name}님` : "!"}
          </h1>
          <p>오늘도 새로운 꿈의 여행을 떠나보세요!</p>
          {isLoggedIn && (
            <div className="user_info">
              <img src={user?.image ?? "/default_user.svg"} alt="프로필" />
              <div>
                <p>{user.email}</p>
                <div>
                  <button>마이페이지</button> | <button>즐겨찾기</button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="dream_list">
          <h2>최근 꿈 기록</h2>
          {bookmarkedDreams.map(dream => (
            <div className="dream_card" key={dream.id}>
              <div className="dream_card_top">
                <span>{dream.title}</span>
                <img
                  src={dream.isBookmarked ? "/fullstar.svg" : "/star.svg"}
                  alt="즐겨찾기"
                  onClick={() => toggleBookmark(dream.id)}
                />
              </div>
              <p>{dream.description}</p>
              <span className="dream_date">{dream.date}</span>
            </div>
          ))}
        </section>

        <section className={`main_login ${!isLoggedIn ? "blur" : ""}`}>
          <h2>나의 통계</h2>
          {!isLoggedIn && (
            <div className="overlay">로그인 시 이용가능합니다</div>
          )}
          <div className="total">
            {[
              ["/total_light.svg", 24, "총 꿈 기록"],
              ["/calendar_light.svg", 13, "이번 달 기록"],
              ["/clock_light.svg", 8, "평균 수면 시간"],
              ["/ai_light.svg", 4, "주간 꿈 해몽"],
            ].map(([icon, num, text], i) => (
              <div key={i}>
                <img src={icon} alt={text} />
                <span>{num}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <h2>기록하기</h2>
          {!isLoggedIn && (
            <div className="overlay">로그인 시 이용가능합니다</div>
          )}
          <div className="record">
            {[
              [
                "/note_light.svg",
                "꿈 기록하기",
                "오늘 밤 꾼 꿈을 기록해보세요.",
              ],
              ["/moon_light.svg", "감정 일기", "오늘의 감정을 기록해 보세요."],
              [
                "/smile_light.svg",
                "수면 기록",
                "수면 패턴을 기록하고 관리해 보세요.",
              ],
            ].map(([icon, title, desc], i) => (
              <div key={i}>
                <img src={icon} alt={title} />
                <span>{title}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="quotes">
          <h3>꿈 관련 명언</h3>
          <QuoteSwiper />
        </section>
      </div>
    </div>
  );
}

export default HomePage;
