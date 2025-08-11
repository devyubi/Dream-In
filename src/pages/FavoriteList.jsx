import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton, { StyledBackButton } from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { useFavorites } from "../contexts/FavoriteContext";
import { List } from "./List.styles";

function FavoriteList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [refreshKey, setRefreshKey] = useState(0);
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

  const countAll = allFavorites.length;
  const countDreams = favoriteDreams.length;
  const countEmotions = favoriteEmotions.length;

  // 선택된 카테고리에 따라 필터링
  const filteredFavorites = allFavorites.filter(item => {
    if (selectedCategory === "전체") return true;
    if (selectedCategory === "꿈 이야기") return item.type === "dream";
    if (selectedCategory === "감정일기") return item.type === "emotion";
    return false;
  });

  // const handleDeleteFavorite = (e, item) => {
  //   e.stopPropagation();
  //   const confirmResult = window.confirm("즐겨찾기에서 삭제하시겠습니까?");
  //   if (confirmResult) {
  //     handleToggleFavorite(item);
  //     alert("즐겨찾기에서 삭제되었습니다.");
  //   }
  // };

  // const handleToggleFavorite = item => {
  //   if (item.type === "dream") {
  //     toggleDreamFavorite(item);
  //   } else if (item.type === "emotion") {
  //     toggleEmotionFavorite(item);
  //   }
  // };

  const handleToggleFavorite = item => {
    if (item.type === "dream") {
      const isFavorited = favoriteDreams.some(d => d.id === item.id);

      if (isFavorited) {
        // 이미 즐겨찾기된 상태에서 해제하려고 하면 확인창 띄우기
        const confirmResult = window.confirm(
          "정말 즐겨찾기에서 삭제하시겠습니까?",
        );
        if (!confirmResult) return; // 취소하면 함수 종료
      }

      toggleDreamFavorite(item);
      if (isFavorited) {
        alert("즐겨찾기에서 삭제되었습니다.");
      }
    } else if (item.type === "emotion") {
      const isFavorited = favoriteEmotions.some(e => e.id === item.id);

      if (isFavorited) {
        const confirmResult = window.confirm(
          "정말 즐겨찾기에서 삭제하시겠습니까?",
        );
        if (!confirmResult) return;
      }

      toggleEmotionFavorite(item);
      if (isFavorited) {
        alert("즐겨찾기에서 삭제되었습니다.");
      }
    }
    setRefreshKey(prev => prev + 1);
  };
  return (
    <Container key={refreshKey}>
      <Title title="즐겨찾기 목록" />
      <List.EmojiCategoryWrap>
        <StyledBackButton to="/" />
        {listCategories.map((categorylist, index) => (
          <List.EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(categorylist)}
            isActive={selectedCategory === categorylist}
          >
            {categorylist}
            {categorylist === "전체" && `(${countAll})`}
            {categorylist === "꿈 이야기" && `(${countDreams})`}
            {categorylist === "감정일기" && `(${countEmotions})`}
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
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "2px",
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
              <List.ListItemTitle>
                {item.title}
                {item.type === "dream" && item.category && (
                  <List.ListItemCategory>
                    #{item.category}
                  </List.ListItemCategory>
                )}
              </List.ListItemTitle>
              <List.ListItemDetail>{item.detail}</List.ListItemDetail>
              {/* <List.ListItemDelete
                onClick={e => handleDeleteFavorite(e, item)}
              ></List.ListItemDelete> */}
            </List.ListItem>
          ))
        )}
      </List.ListWrap>
    </Container>
  );
}

export default FavoriteList;
