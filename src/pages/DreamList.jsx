import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";
import { useFavorites } from "../contexts/FavoriteContext";

function DreamList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [dreamList, setDreamList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const deletedId = location.state?.deletedId;
  const { favoriteDreams, toggleDreamFavorite } = useFavorites();
  const postsPerPage = 5;

  // 감정 카테고리 필터
  const filteredDreams =
    selectedCategory === "전체"
      ? dreamList
      : dreamList.filter(dream => dream.category === selectedCategory);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const currentPosts = filteredDreams.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredDreams.length / postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (deletedId) {
      setDreamList(prevList => prevList.filter(d => d.id !== deletedId));
    }
  }, [deletedId]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "박송문",
        time: "1시간 전",
        title: "하늘을 나는 꿈을 꾸었습니다.",
        category: "행복한",
        detail:
          "하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman. 하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman.",
        photo: "/images/photo1.png",
      },
      {
        id: 2,
        name: "송문박",
        time: "1시간 전",
        title: "하늘에서 아이언맨이 날고 있는 것을 보는 꿈을 꾸었습니다.",
        category: "신기한",
        detail:
          "하늘을 올려다 보았을 때 아이언맨처럼 빠른 사람이 날고 있었어요. He is ironman.",
        photo: "/images/photo2.png",
      },
      {
        id: 3,
        name: "문박송",
        time: "1시간 전",
        title:
          "하늘에서 아이언맨이 날고 있는 것을 보는 사람을 보는 꿈을 꾸었습니다.",
        category: "몽환적",
        detail:
          "하늘을 나르는 아이언맨을 보고 있는 사람을 보는 꿈을 꾸었어요. He is man.",
        photo: "/images/photo3.png",
      },
      {
        id: 4,
        name: "문박송",
        time: "1시간 전",
        title:
          "하늘에서 아이언맨이 날고 있는 것을 보는 사람을 보는 꿈을 꾸었습니다.",
        category: "몽환적",
        detail:
          "하늘을 나르는 아이언맨을 보고 있는 사람을 보는 꿈을 꾸었어요. He is man.",
        photo: "/images/photo3.png",
      },
      {
        id: 5,
        name: "문박송",
        time: "1시간 전",
        title:
          "하늘에서 아이언맨이 날고 있는 것을 보는 사람을 보는 꿈을 꾸었습니다.",
        category: "몽환적",
        detail:
          "하늘을 나르는 아이언맨을 보고 있는 사람을 보는 꿈을 꾸었어요. He is man.",
        photo: "/images/photo3.png",
      },
      {
        id: 6,
        name: "문박송",
        time: "1시간 전",
        title:
          "하늘에서 아이언맨이 날고 있는 것을 보는 사람을 보는 꿈을 꾸었습니다.",
        category: "몽환적",
        detail:
          "하늘을 나르는 아이언맨을 보고 있는 사람을 보는 꿈을 꾸었어요. He is man.",
        photo: "/images/photo3.png",
      },
    ];

    if (deletedId) {
      setDreamList(mockData.filter(d => d.id !== deletedId));
      navigate("/dreamlist", { replace: true });
    } else {
      setDreamList(mockData);
    }
  }, []);

  const emojiCategories = [
    "전체",
    "빛나는",
    "행복한",
    "몽환적",
    "부끄러움",
    "신기한",
    "태몽",
    "무서운",
    "기타",
  ];

  const categoryCounts = emojiCategories.reduce((acc, category) => {
    if (category === "전체") {
      acc[category] = dreamList.length;
    } else {
      acc[category] = dreamList.filter(d => d.category === category).length;
    }
    return acc;
  }, {});

  return (
    <Container>
      <Title title="꿈 이야기 목록" />
      <List.EmojiCategoryWrap>
        <BackButton to="/" />
        {emojiCategories.map((categorylist, index) => (
          <List.EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(categorylist)}
            isActive={selectedCategory === categorylist}
          >
            {categorylist} ({categoryCounts[categorylist] || 0})
          </List.EmojiCategoryItem>
        ))}
      </List.EmojiCategoryWrap>
      {filteredDreams.length > 0 && (
        <List.ListWrap>
          {currentPosts.map(dream => {
            const isFavorite =
              favoriteDreams?.some(f => f.id === dream.id) ?? false; // 즐겨찾기 여부 확인

            return (
              <List.ListItem
                key={dream.id}
                onClick={() =>
                  navigate(`/dreamdetail/${dream.id}`, { state: dream })
                }
              >
                <List.ListItemUser>
                  <List.ListItemUserPhoto>
                    <img src={dream.photo} alt="유저이미지" />
                  </List.ListItemUserPhoto>
                  <List.ListItemUserName>{dream.name}</List.ListItemUserName>
                  <List.ListItemTime>{dream.time}</List.ListItemTime>
                  <List.ListItemFavorites
                    onClick={e => {
                      e.stopPropagation();
                      toggleDreamFavorite(dream); // context 토글 함수
                    }}
                  >
                    <img
                      src={
                        isFavorite
                          ? "/images/fill_star.png"
                          : "/images/empty_star.png"
                      }
                      alt={isFavorite ? "즐겨찾기 취소" : "즐겨찾기"}
                    />
                  </List.ListItemFavorites>
                </List.ListItemUser>
                <List.ListItemTitle>
                  {dream.title}
                  <List.ListItemCategory>
                    #{dream.category}
                  </List.ListItemCategory>
                </List.ListItemTitle>
                <List.ListItemDetail>{dream.detail}</List.ListItemDetail>
                <List.ListItemDelete
                  onClick={e => {
                    e.stopPropagation();
                    const confirmResult =
                      window.confirm("이 꿈을 정말 삭제하시겠습니까?");
                    if (confirmResult) {
                      setDreamList(prevList =>
                        prevList.filter(d => d.id !== dream.id),
                      );
                      alert("꿈이 삭제되었습니다.");
                    }
                  }}
                >
                  <img src="/images/delete_icon.png" alt="삭제" />
                </List.ListItemDelete>
              </List.ListItem>
            );
          })}
        </List.ListWrap>
      )}
      {totalPages > 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                margin: "0 5px",
                fontWeight: currentPage === idx + 1 ? "bold" : "normal",
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </Container>
  );
}

export default DreamList;
