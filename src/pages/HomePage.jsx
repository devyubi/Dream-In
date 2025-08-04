import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import QuoteSwiper from "../components/QuoteSwiper";
import { useAuth } from "../contexts/AuthContext";
import "../css/homepage.css";
import FavoriteSection from "../components/home/FavoriteSection";
import RecordSection from "../components/home/RecordSection";
import StatsSection from "../components/home/StatsSection";
import QuoteSwiper from "../components/QuoteSwiper";
import { useAuth } from "../contexts/AuthContext";
import "../css/home/homepage.css";

function HomePage() {
  const { isDarkMode } = useTheme();
  const { isLoggedIn, user, profile } = useAuth();
  const navigate = useNavigate();

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
              <div className={`login_content ${isLoggedIn ? "" : "blurred"}`}>
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
          <FavoriteSection />

          {/* 나의 통계 */}
          <h2>나의 통계</h2>
          <StatsSection />
          {/* 기록하기 */}
          <h2>기록하기</h2>
          <RecordSection />
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
