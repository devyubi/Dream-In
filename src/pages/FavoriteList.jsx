import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton, { StyledBackButton } from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { useFavorites } from "../contexts/FavoriteContext";
import { List } from "./List.styles";
import Pagination from "../components/common/Pagination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 즐겨찾기 합치기 + 타입 표시
  const allFavorites = [
    ...favoriteDreams.map(item => ({ ...item, type: "dream" })),
    ...favoriteEmotions.map(item => ({ ...item, type: "emotion" })),
  ];

  // 카테고리 필터링
  const filteredFavorites = allFavorites.filter(item => {
    if (selectedCategory === "전체") return true;
    if (selectedCategory === "꿈 이야기") return item.type === "dream";
    if (selectedCategory === "감정일기") return item.type === "emotion";
    return false;
  });

  // 페이지 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFavorites.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // 페이지 번호 조정 (항목 수 변경 시)
  useEffect(() => {
    const lastPage = Math.max(
      1,
      Math.ceil(filteredFavorites.length / itemsPerPage),
    );
    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [filteredFavorites.length, currentPage, itemsPerPage]);

  // 카테고리 변경 시 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // 즐겨찾기 토글
  const handleToggleFavorite = item => {
    const confirmMsg = "정말 즐겨찾기에서 삭제하시겠습니까?";
    if (item.type === "dream") {
      const isFavorited = favoriteDreams.some(d => d.id === item.id);
      if (isFavorited && !window.confirm(confirmMsg)) return;
      toggleDreamFavorite(item);
      if (isFavorited) alert("즐겨찾기에서 삭제되었습니다.");
    } else if (item.type === "emotion") {
      const isFavorited = favoriteEmotions.some(e => e.id === item.id);
      if (isFavorited && !window.confirm(confirmMsg)) return;
      toggleEmotionFavorite(item);
      if (isFavorited) alert("즐겨찾기에서 삭제되었습니다.");
    }
  };

  const countAll = allFavorites.length;
  const countDreams = favoriteDreams.length;
  const countEmotions = favoriteEmotions.length;

  return (
    <Container>
      <Title title="즐겨찾기 목록" />
      <List.EmojiCategoryWrap>
        <StyledBackButton to="/" />
        {listCategories.map((category, index) => (
          <List.EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(category)}
            isActive={selectedCategory === category}
          >
            {category}
            {category === "전체" && `(${countAll})`}
            {category === "꿈 이야기" && `(${countDreams})`}
            {category === "감정일기" && `(${countEmotions})`}
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
          currentItems.map(item => (
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
            </List.ListItem>
          ))
        )}
      </List.ListWrap>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredFavorites.length / itemsPerPage)}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}

export default FavoriteList;
