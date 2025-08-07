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
  const { favoriteDreams, favoriteEmotions } = useFavorites();
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
          <p style={{ padding: "1rem" }}>즐겨찾기한 항목이 없습니다.</p>
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
                <List.ListItemFavorites>
                  <img src="/images/fill_star.png" alt="즐겨찾기" />
                </List.ListItemFavorites>
              </List.ListItemUser>
              <List.ListItemTitle></List.ListItemTitle>
              <List.ListItemDetail></List.ListItemDetail>
              <List.ListItemDelete></List.ListItemDelete>
            </List.ListItem>
          ))
        )}
      </List.ListWrap>
    </Container>
  );
}

export default FavoriteList;
