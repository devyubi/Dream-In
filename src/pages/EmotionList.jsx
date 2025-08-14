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
        name: "user",
        time: "1시간 전",
        title: "오늘은 마음이 가벼운 하루였습니다.",
        detail:
          "오늘은 모든 일이 순조롭게 흘러가서 마음이 가벼웠습니다. 아침에 일어나서 따뜻한 햇살을 맞으며 산책을 하고, 좋아하는 커피를 마시며 평온함을 느꼈습니다. 하루 종일 주변 사람들과 소소한 대화를 나누고 웃음을 주고받으면서 기분이 한층 더 밝아졌습니다. 이런 평화로운 하루가 오래도록 지속되었으면 하는 마음이 들었습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 2,
        name: "user",
        time: "1일 전",
        title: "작은 성취가 기쁨을 주었습니다.",
        detail:
          "오늘은 오랫동안 미뤄왔던 일을 마무리할 수 있어 성취감을 느꼈습니다. 계획했던 일을 하나씩 체크하며 완성할 때마다 뿌듯함이 차올랐고, 스스로에게 작은 칭찬을 해주었습니다. 주변 사람들과 성취감을 나누며 함께 기뻐할 수 있어서 하루가 더욱 의미 있게 느껴졌습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 3,
        name: "user",
        time: "2일 전",
        title: "잠깐의 혼자만의 시간이 행복했습니다.",
        detail:
          "오늘은 짧은 시간이었지만 혼자만의 시간을 가지며 책을 읽고 음악을 들었습니다. 평소 바쁘게 살아가며 놓쳤던 소소한 즐거움을 다시 느낄 수 있었고, 마음이 한결 차분해지고 안정감을 얻었습니다. 이런 혼자만의 여유가 앞으로도 필요하다는 것을 다시 깨달았습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 4,
        name: "user",
        time: "3일 전",
        title: "따뜻한 대화가 마음을 채웠습니다.",
        detail:
          "오늘은 친구와 오랜만에 긴 이야기를 나눴습니다. 서로의 고민과 일상을 솔직하게 나누며 큰 위로를 받았고, 함께 웃으며 스트레스가 해소되는 기분을 느꼈습니다. 말하지 않아도 서로를 이해하는 느낌이 들어 마음이 한층 따뜻해졌습니다. 이런 소중한 인연이 있어서 감사함을 느낀 하루였습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 5,
        name: "user",
        time: "4일 전",
        title: "작은 일에도 감사함을 느낀 하루였습니다.",
        detail:
          "오늘은 평범한 하루였지만, 작은 일에서 감사함을 많이 느꼈습니다. 커피 한 잔, 지나가는 길의 꽃, 누군가의 친절한 미소까지 사소한 순간들이 마음을 따뜻하게 했습니다. 작은 행복들이 쌓여 하루가 풍성하게 느껴졌고, 일상 속 감사함을 잊지 말아야겠다고 생각했습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 6,
        name: "user",
        time: "5일 전",
        title: "조금 힘든 날이었지만 의미를 찾았습니다.",
        detail:
          "오늘은 예상치 못한 일들로 조금 지치고 힘든 하루였습니다. 하지만 그 과정 속에서 자신을 돌아보고, 문제를 해결해 나가는 과정에서 성장하는 느낌을 받았습니다. 힘든 순간에도 배울 점과 의미를 찾을 수 있어 스스로를 다독이며 하루를 마무리했습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 7,
        name: "user",
        time: "6일 전",
        title: "새로운 경험이 즐거움을 주었습니다.",
        detail:
          "오늘은 처음 해보는 활동을 경험하며 즐거움을 느꼈습니다. 처음이라 서툴렀지만, 도전하는 재미와 새로운 것을 배우는 설렘이 하루를 활기차게 만들었습니다. 경험 자체가 큰 만족감을 주었고, 앞으로도 새로운 시도를 두려워하지 않아야겠다고 생각했습니다.",
        photo: "/images/photo1.png",
        isFavorite: false,
      },
      {
        id: 8,
        name: "user",
        time: "7일 전",
        title: "평범하지만 안정적인 하루였습니다.",
        detail:
          "오늘은 특별한 일은 없었지만, 평온하고 안정적인 하루였습니다. 규칙적으로 생활하며 필요한 일들을 차근차근 처리했고, 소소한 즐거움과 휴식도 챙길 수 있었습니다. 일상의 안정 속에서 느낀 작은 만족감과 편안함이 마음을 채운 하루였습니다.",
        photo: "/images/photo1.png",
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
