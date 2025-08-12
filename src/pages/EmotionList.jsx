import { useEffect, useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "../styles/List.styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useFavorites } from "../contexts/FavoriteContext";
import Pagination from "../components/common/Pagination";
import { useThemeContext } from "../contexts/ThemeContext";

function EmotionList() {
  const location = useLocation();
  const [emotionList, setEmotionList] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = emotionList.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = emotionList.slice(indexOfFirstItem, indexOfLastItem);

    if (currentItems.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [emotionList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(emotionList.length / itemsPerPage);

  const { favoriteEmotions, toggleEmotionFavorite } = useFavorites();

  const deleteId = location.state?.deleteId;

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "박송문",
        time: "1시간 전",
        title: "아주 행복한 날입니다~",
        category: "행복한",
        detail: "오늘은 아주 행복한 날입니다~",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 2,
        name: "송문박",
        time: "1시간 전",
        title: "오늘은 복권을 사야겠어요",
        category: "신기한",
        detail: "오늘은 좋은 꿈을 꿔서 기분이 좋으니까 복권을 사야겠어요~",
        photo: "/images/photo2.png",
        isFavorite: false,
      },
      {
        id: 3,
        name: "문박송",
        time: "1시간 전",
        title: "오늘은 아주 환상적인 날입니다~",
        category: "몽환적",
        detail: "오늘은 마치 하늘을 나는 것 같이 환상적인 날입니다~",
        photo: "/images/photo3.png",
        isFavorite: false,
      },
      {
        id: 4,
        name: "문박송",
        time: "1시간 전",
        title: "오늘은 아주 환상적인 날입니다~",
        category: "몽환적",
        detail: "오늘은 마치 하늘을 나는 것 같이 환상적인 날입니다~",
        photo: "/images/photo3.png",
        isFavorite: false,
      },
      {
        id: 5,
        name: "문박송",
        time: "1시간 전",
        title: "오늘은 아주 환상적인 날입니다~",
        category: "몽환적",
        detail: "오늘은 마치 하늘을 나는 것 같이 환상적인 날입니다~",
        photo: "/images/photo3.png",
        isFavorite: false,
      },
      {
        id: 6,
        name: "문박송",
        time: "1시간 전",
        title: "오늘은 아주 환상적인 날입니다~",
        category: "몽환적",
        detail: "오늘은 마치 하늘을 나는 것 같이 환상적인 날입니다~",
        photo: "/images/photo3.png",
        isFavorite: false,
      },
    ];

    if (deleteId) {
      setEmotionList(mockData.filter(d => d.id !== deleteId));
      navigate("/emotionlist", { replace: true });
    } else {
      setEmotionList(mockData);
    }
  }, [deleteId, navigate]);

  // const toggleFavorite = id => {
  //   setEmotionList(prevList =>
  //     prevList.map(emotion =>
  //       emotion.id === id
  //         ? { ...emotion, isFavorite: !emotion.isFavorite }
  //         : emotion,
  //     ),
  //   );
  // };

  const { isDarkMode } = useThemeContext();

  return (
    <Container>
      <BackButton to="/" />
      <Title dark={isDarkMode} title="감정일기 목록" />
      <List.ListWrap dark={isDarkMode}>
        {currentItems.map(emotion => {
          const isFavorite = favoriteEmotions?.some(f => f.id === emotion.id);

          return (
            <List.ListItem
              key={emotion.id}
              onClick={() =>
                navigate(`/emotiondetail/${emotion.id}`, { state: emotion })
              }
              dark={isDarkMode}
            >
              <List.ListItemUser>
                <List.ListItemUserPhoto>
                  <img src={emotion.photo} alt="유저이미지" />
                </List.ListItemUserPhoto>
                <List.ListItemUserName>{emotion.name}</List.ListItemUserName>
                <List.ListItemTime dark={isDarkMode}>
                  {emotion.time}
                </List.ListItemTime>
                <List.ListItemFavorites
                  onClick={e => {
                    e.stopPropagation();
                    toggleEmotionFavorite(emotion);
                  }}
                >
                  <img
                    src={
                      favoriteEmotions?.some(f => f.id === emotion.id)
                        ? "/images/fill_star.png"
                        : "/images/empty_star.png"
                    }
                    alt={isFavorite ? "즐겨찾기 취소" : "즐겨찾기"}
                  />
                </List.ListItemFavorites>
              </List.ListItemUser>
              <List.ListItemTitle>{emotion.title}</List.ListItemTitle>
              <List.ListItemDetail>{emotion.detail}</List.ListItemDetail>
              <List.ListItemDelete
                onClick={e => {
                  e.stopPropagation();
                  const confirmResult = window.confirm(
                    "이 감정일기를 정말 삭제하시겠습니까?",
                  );
                  if (confirmResult) {
                    setEmotionList(prevList =>
                      prevList.filter(d => d.id !== emotion.id),
                    );
                    alert("감정일기가 삭제되었습니다.");
                  }
                }}
              >
                <img
                  src={
                    isDarkMode
                      ? "/images/delete_icon_dark.png"
                      : "/images/delete_icon.png"
                  }
                  alt="삭제"
                />
              </List.ListItemDelete>
            </List.ListItem>
          );
        })}
      </List.ListWrap>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}

export default EmotionList;
