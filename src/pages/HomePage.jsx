import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import QuoteSwiper from "../components/QuoteSwiper";
import { useAuth } from "../contexts/AuthContext";
import "../../css/homepage.css";
import RecordSection from "../components/home/RecordSection";
import StatsSection from "../components/home/StatsSection";

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
    title: "뺑소니 당하는 꿈",
    description:
      "뺑소니를 당하는 꿈을 꿨는데 꿈이 아니었어요. 경찰에 신고할거에요.ㅉ",
    date: "2025.07.14",
    isBookmarked: true,
  },
];

// [
//   ["total", 24, "총 꿈 기록"],
//   ["calendar", 13, "이번 달 기록"],
//   ["clock", 8, "평균 수면 시간"],
//   ["ai", 4, "주간 꿈 해몽"],
// ].map(([name, value, label]) => (
//   <div key={label}>
//     <img src={`/${name}_${isDarkMode ? "darkmode" : "lightmode"}.svg`} alt={label} />
//     <span>{value}</span>
//     <span>{label}</span>
//   </div>
// ));

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

      // 모킹데이터라서 강제로 3번째 보여줌
      if (updated.length < 2) {
        const extra = mockDreams.find(
          d => d.id === 3 && !updated.some(u => u.id === 4),
        );
        if (extra) updated.push(extra);
      }
      return updated.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
  };

  return (
    <Container className="mainpage">
      <div className="mainpage_wrap">
        <div className="mainpage_inner">
          <section className="greeting">
            <h1>
              안녕하세요{isLoggedIn && user?.name ? `, ${user.name}님` : "!"}
            </h1>
            <p>오늘도 새로운 꿈의 여행을 떠나보세요!</p>
          </section>
          {/* 즐겨찾기 */}
          <section className="dream_list">
            <div className="main_login">
              <h2>즐겨찾기</h2>
              <div className={`login_content ${isLoggedIn ? "blurred" : ""}`}>
                {!isLoggedIn && (
                  <div className="blur_overlay">로그인 시 이용 가능합니다</div>
                )}
                {bookmarkedDreams.map(dream => (
                  <div className="dream_card" key={dream.id}>
                    <div className="dream_card_top">
                      <span>
                        {dream.title}
                        <span className="dream_date">{dream.date}</span>
                      </span>

                      <img
                        src={
                          dream.isBookmarked
                            ? "/images/fullstar.svg"
                            : "/images/star.svg"
                        }
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
            </div>
            {/* 유저 프로필 및 로그인창 - 로그인 완료한 화면*/}
            <div className="login_box">
              <div className="auth_box">
                {user ? (
                  <div className="user_info">
                    <Link to="/profile">
                      <img
                        className="user_profile_img"
                        src={user.profile_img || "/images/unknown.svg"}
                        alt="유저 프로필"
                      />
                    </Link>
                    <div className="user_text">
                      <p className="main_welcome">
                        {user.nickname}님 어서오세요!
                      </p>
                      <p className="email">{user.email}</p>
                      <div className="user_links">
                        <Link to="/profile">
                          <img
                            className="main_mypage"
                            src="/images/mypage_light.svg"
                            alt="마이페이지"
                          />
                          마이페이지
                        </Link>
                        <Link to="/favorites">
                          <img
                            className="main_favorite"
                            src="/images/fullstar.svg"
                            alt="즐겨찾기"
                          />
                          즐겨찾기
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 유저 프로필 및 로그인창 - 로그인 안한 화면
                  <div className="login_prompt">
                    <p className="main_msg">
                      Dream-in을 편리하게 관리해보세요!
                    </p>
                    <button className="login_btn">
                      <Link to="/login">Dream-in 로그인</Link>
                    </button>
                    <div className="sub_links">
                      <Link to="/find-id" className="sub_link">
                        아이디 찾기
                      </Link>
                      <span>|</span>
                      <Link to="/find-password" className="sub_link">
                        비밀번호 찾기
                      </Link>
                      <span>|</span>
                      <Link to="/signup" className="sub_link">
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* 나의 통계 */}
          <RecordSection />
          {/* 기록하기 */}
          <StatsSection />
          {/* 스와이퍼 */}
          <section className="quotes">
            <h3>꿈 관련 명언</h3>
            <QuoteSwiper />
          </section>
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
