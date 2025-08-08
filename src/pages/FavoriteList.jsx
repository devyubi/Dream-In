import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";
import { useFavorites } from "../contexts/FavoriteContext";
import { useNavigate } from "react-router-dom";

function FavoriteList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const listCategories = ["전체", "꿈 이야기", "감정일기"];
  const {
    favoriteDreams,
    favoriteEmotions,
    toggleDreamFavorite,
    toggleEmotionFavorite,
  } = useFavorites();

  const navigate = useNavigate();

  // 두 리스트 병합
  const allFavorites = [
    ...favoriteDreams.map(item => ({ ...item, type: "dream" })),
    ...favoriteEmotions.map(item => ({ ...item, type: "emotion" })),
  ];

  // 선택된 카테고리에 따라 필터링
  const filteredFavorites = allFavorites.filter(item => {
    if (selectedCategory === "전체") return true;
    if (selectedCategory === "꿈 이야기") return item.type === "dream";
    if (selectedCategory === "감정일기") return item.type === "emotion";
    return false;
  });

  const handleToggleFavorite = item => {
    if (item.type === "dream") {
      toggleDreamFavorite(item);
    } else if (item.type === "emotion") {
      toggleEmotionFavorite(item);
    }
  };

  const handleDeleteFavorite = (e, item) => {
    e.stopPropagation();
    const confirmResult = window.confirm("즐겨찾기에서 삭제하시겠습니까?");
    if (confirmResult) {
      handleToggleFavorite(item);
      alert("즐겨찾기에서 삭제되었습니다.");
    }
  };

  return (
    <Container>
      <Title title="즐겨찾기 목록" />
      <List.EmojiCategoryWrap>
        <BackButton to="/" />
        {listCategories.map((categorylist, index) => (
          <List.EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(categorylist)}
            isActive={selectedCategory === categorylist}
          >
            {categorylist}
          </List.EmojiCategoryItem>
        ))}
      </List.EmojiCategoryWrap>
      <List.ListWrap>
        {filteredFavorites.length === 0 ? (
          <p
            style={{
              paddingTop: "70px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            즐겨찾기한 항목이 없습니다.
          </p>
        ) : (
          filteredFavorites.map(item => (
            <List.ListItem
              key={item.id}
              onClick={() =>
                navigate(
                  item.type === "dream"
                    ? `/dreamdetail/${item.id}`
                    : `/emotiondetail/${item.id}`,
                  { state: item },
                )
              }
            >
              <List.ListItemUser>
                <List.ListItemUserPhoto>
                  <img src={item.photo} alt="유저 이미지" />
                </List.ListItemUserPhoto>
                <List.ListItemUserName>{item.name}</List.ListItemUserName>
                <List.ListItemTime>{item.time}</List.ListItemTime>
                <List.ListItemFavorites
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleFavorite(item);
                  }}
                >
                  <img src="/images/fill_star.png" alt="즐겨찾기 취소" />
                </List.ListItemFavorites>
              </List.ListItemUser>
              <List.ListItemTitle>{item.title}</List.ListItemTitle>
              <List.ListItemDetail>{item.detail}</List.ListItemDetail>
              <List.ListItemDelete
                onClick={e => handleDeleteFavorite(e, item)}
              ></List.ListItemDelete>
            </List.ListItem>
          ))
        )}
      </List.ListWrap>
    </Container>
  );
}

export default FavoriteList;
