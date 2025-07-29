// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../css/homepage.css";
import QuoteSwiper from "../components/QuoteSwiper";
import { Link } from "react-router-dom";

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
];

function HomePage() {
  const { isLoggedIn, user } = useAuth();
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

      // 모킹데이터라서 강제로 2번째 보여줌
      if (updated.length < 1) {
        const extra = mockDreams.find(
          d => d.id === 2 && !updated.some(u => u.id === 3),
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
              <img src={user?.image ?? "/unknown.svg"} alt="프로필" />
              <div>
                <p>{user.email}</p>
                <div>
                  <button>
                    <img src="/mypage_light.svg" alt="마이페이지" />
                    마이페이지
                  </button>
                  |
                  <button>
                    <img src="/fullstar.svg" alt="즐겨찾기" />
                    즐겨찾기
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <h2>최근 꿈 기록</h2>
        <section className="dream_list">
          <div>
            {bookmarkedDreams.map(dream => (
              <div className="dream_card" key={dream.id}>
                <div className="dream_card_top">
                  <span>
                    {dream.title}
                    <span className="dream_date">{dream.date}</span>
                  </span>

                  <img
                    src={dream.isBookmarked ? "/fullstar.svg" : "/star.svg"}
                    alt="즐겨찾기"
                    onClick={() => toggleBookmark(dream.id)}
                  />
                </div>
                <div className="dream_item">
                  <p>{dream.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="auth_box">
            {user ? (
              <div className="user_info">
                <Link to="/profile">
                  <img
                    src={user.profile_img || "/default_profile.png"}
                    alt="유저 프로필"
                    className="user_profile_img"
                  />
                </Link>

                <div className="user_text">
                  <p className="welcome">{user.nickname}님 어서오세요!</p>
                  <p className="email">{user.email}</p>
                  <div className="user_links">
                    <Link to="/profile">
                      <img src="mypage_light.svg" alt="마이페이지" />
                      마이페이지
                    </Link>
                    <Link to="/favorites">
                      <img src="fullstar.svg" alt="즐겨찾기" />
                      즐겨찾기
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login_prompt">
                <p className="main_msg">Dream-in을 편리하게 관리해보세요!</p>
                <Link to="/login" className="login_btn">
                  Dream-in 로그인
                </Link>
                <div className="sub_links">
                  <Link to="/find-id">아이디 찾기</Link>
                  <span>|</span>
                  <Link to="/find-password">비밀번호 찾기</Link>
                  <span>|</span>
                  <Link to="/signup">회원가입</Link>
                </div>
              </div>
            )}
          </div>
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
