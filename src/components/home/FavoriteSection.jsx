import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo, useState } from "react";

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
      "뺑소니 당하는 꿈을 꿨어요. 와 이거 꿈인줄 알았는데 실화였어요. 젠장할",
    date: "2025.07.14",
    isBookmarked: true,
  },
];

function FavoriteSection() {
  const { isLoggedIn, user, profile } = useAuth();
  const [dreams, setDreams] = useState(mockDreams);
  const navigate = useNavigate();

  // 즐겨찾기 정렬 (useMemo로 최적화)
  const bookmarkedDreams = useMemo(() => {
    return dreams
      .filter(d => d.isBookmarked)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2);
  }, [dreams]);
  // const bookmarkedDreams = dreams
  //   .filter(d => d.isBookmarked)
  //   .sort((a, b) => new Date(b.date) - new Date(a.date))
  //   .slice(0, 2);

  const handleBookmarkClick = (e, id, isBookmarked) => {
    e.stopPropagation();
    if (isBookmarked && !window.confirm("즐겨찾기를 해제하시겠습니까?")) return;
    toggleBookmark(id);
  };

  const toggleBookmark = id => {
    setDreams(prev =>
      prev.map(dream =>
        dream.id === id
          ? { ...dream, isBookmarked: !dream.isBookmarked }
          : dream,
      ),
    );
  };

  // 즐겨찾기 카드 클릭 시 /favorites 페이지로 이동 추가
  const onDreamClick = () => {
    navigate("/favorites");
  };

  return (
    <section className="dream_list">
      <div className="main_login">
        <h2>즐겨찾기</h2>
        <div className={`login_content ${isLoggedIn ? "" : "blurred"}`}>
          {!isLoggedIn && (
            <div className="blur_overlay">로그인 시 이용 가능합니다</div>
          )}

          {isLoggedIn && bookmarkedDreams.length === 0 && (
            <p className="no-bookmarks">즐겨찾기가 없습니다.</p>
          )}

          {bookmarkedDreams.map(dream => (
            <div className="dream_card" key={dream.id}>
              <div
                className="dream_card_top"
                style={{ cursor: "pointer" }}
                onClick={onDreamClick}
              >
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
                  onClick={e =>
                    handleBookmarkClick(e, dream.id, dream.isBookmarked)
                  }
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div
                className="dream_item"
                style={{ cursor: "pointer" }}
                onClick={onDreamClick}
              >
                <p>{dream.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 유저 프로필 및 로그인창 - 로그인 완료한 화면 */}
      <div className="login_box">
        <div className="auth_box">
          {user ? (
            <div className="user_info">
              <div className="user_top">
                <Link to="/profile/edit">
                  <img
                    className="user_profile_img"
                    src={profile?.profile_image_url || "/images/unknown.svg"}
                    alt="유저 프로필"
                  />
                </Link>
                <p className="main_welcome">
                  <strong>{profile?.nickname || "회원"}</strong> 님 어서오세요!
                </p>
              </div>
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
          ) : (
            // 유저 프로필 및 로그인창 - 로그인 안한 화면
            <div className="login_prompt">
              <p className="main_msg">Dream-in을 편리하게 관리해보세요!</p>
              <Link to="/login" className="login_btn">
                Dream-in 로그인
              </Link>
              <div className="sub_links">
                <Link to="/find-email" className="sub_link">
                  이메일 찾기
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
  );
}

export default FavoriteSection;
