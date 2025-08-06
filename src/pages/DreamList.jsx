import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";

function DreamList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const deletedId = location.state?.deletedId;

  const [dreamList, setDreamList] = useState([]);

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
        isFavorite: false,
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
        isFavorite: false,
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
        isFavorite: false,
      },
    ];

    if (deletedId) {
      setDreamList(mockData.filter(d => d.id !== deletedId));
      navigate("/dreamlist", { replace: true });
    } else {
      setDreamList(mockData);
    }
  }, []);

  const toggleFavorite = id => {
    setDreamList(prevList =>
      prevList.map(dream =>
        dream.id === id ? { ...dream, isFavorite: !dream.isFavorite } : dream,
      ),
    );
  };

  // 감정 카테고리 필터
  const filteredDreams =
    selectedCategory === "전체"
      ? dreamList
      : dreamList.filter(dream => dream.category === selectedCategory);

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
            {categorylist}
          </List.EmojiCategoryItem>
        ))}
      </List.EmojiCategoryWrap>
      {filteredDreams.length > 0 && (
        <List.ListWrap>
          {filteredDreams.map(dream => (
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
                    toggleFavorite(dream.id);
                  }}
                >
                  <img
                    src={
                      dream.isFavorite
                        ? "/images/fullstar.svg"
                        : "/images/star.svg"
                    }
                    alt={dream.isFavorite ? "즐겨찾기 취소" : "즐겨찾기"}
                  />
                </List.ListItemFavorites>
              </List.ListItemUser>
              <List.ListItemTitle>
                {dream.title}
                <List.ListItemCategory>#{dream.category}</List.ListItemCategory>
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
          ))}
        </List.ListWrap>
      )}
    </Container>
  );
}

export default DreamList;
