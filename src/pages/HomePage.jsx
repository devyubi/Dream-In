import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
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
