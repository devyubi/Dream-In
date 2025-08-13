import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "../styles/List.styles";
import { useFavorites } from "../contexts/FavoriteContext";
import Pagination from "../components/common/Pagination";
import { useThemeContext } from "../contexts/ThemeContext";

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

  useEffect(() => {
    // 현재 페이지에 보여야 할 게시물 수 계산
    const currentPagePosts = filteredDreams.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage,
    );
    // 만약 현재 페이지에 게시물이 없고, 현재 페이지가 1보다 크면 이전 페이지로 이동
    if (currentPagePosts.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [dreamList, filteredDreams, currentPage, postsPerPage]);

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
        name: "user",
        time: "1시간 전",
        title: "빛나는 별들 속을 나는 꿈을 꾸었습니다.",
        category: "빛나는",
        detail:
          "밤하늘의 별들 사이로 자유롭게 날며 반짝이는 우주를 탐험했어요. 별빛이 제 몸을 감싸는 듯했고, 끝없이 펼쳐진 은하수를 따라 날면서 시간과 공간이 멈춘 것 같은 황홀함을 느꼈습니다. 우주 곳곳에서 미세하게 빛나는 소행성과 유성들을 가까이서 볼 수 있었고, 마치 제가 우주의 일부가 된 듯한 기분이 들었어요. 꿈 속에서 느낀 평온함과 경이로움은 현실에서도 오랫동안 기억에 남았습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 2,
        name: "user",
        time: "1일 전",
        title: "친구들과 행복한 파티를 즐기는 꿈을 꾸었습니다.",
        category: "행복한",
        detail:
          "친구들과 함께 웃고 떠들며 즐거운 시간을 보냈어요. 음악이 흐르고, 다 함께 춤추며 게임과 농담을 나누는 동안 웃음소리가 끊이지 않았습니다. 꿈 속에서는 서로의 작은 실수조차도 귀엽게 느껴졌고, 모두가 서로를 응원하며 함께하는 순간이 너무 행복했습니다. 깨어나도 그 따뜻한 감정이 오래도록 남아 마음이 포근해졌습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 3,
        name: "user",
        time: "2일 전",
        title: "안개 속 몽환적인 숲을 걷는 꿈을 꾸었습니다.",
        category: "몽환적",
        detail:
          "안개가 자욱한 숲 속을 걸으면서 신비한 빛과 그림자를 따라 움직였어요. 나무 사이로 희미하게 비치는 달빛과 바람에 흔들리는 나뭇잎이 현실과 꿈의 경계를 흐리게 만들었습니다. 숲 속에서 나는 발자국 소리, 새들의 부드러운 울음소리, 물 흐르는 소리까지 모두 선명하게 느껴졌고, 마치 다른 세계에 들어온 듯한 기묘한 감각을 경험했습니다. 걸을수록 안개가 점점 아름다운 색으로 변하며 환상적인 풍경이 이어졌습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 4,
        name: "user",
        time: "3일 전",
        title:
          "무대에서 노래를 부르며 부끄러운 순간을 경험하는 꿈을 꾸었습니다.",
        category: "부끄러움",
        detail:
          "많은 사람들 앞에서 노래를 부르다 목소리가 떨리며 크게 당황했어요. 하지만 잠시 심호흡을 하고 마음을 가다듬으니 긴장이 풀리기 시작했고, 점점 자신감을 되찾았습니다. 관중들의 격려와 박수를 받으며 노래를 이어갈 수 있었고, 부끄러움 속에서 용기를 배우는 경험을 했습니다. 꿈 속에서의 작은 실패가 현실에서도 큰 교훈처럼 느껴졌습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 5,
        name: "user",
        time: "4일 전",
        title: "하늘에서 신기한 생물을 만나는 꿈을 꾸었습니다.",
        category: "신기한",
        detail:
          "하늘을 날다가 날개 달린 신비한 생물을 만났어요. 그 생물은 말을 하지 못했지만 눈빛으로 마음을 전달했고, 함께 구름 위를 유영하며 자유롭게 날았습니다. 날아가는 동안 구름이 무대처럼 펼쳐지고, 바람에 몸을 맡기며 다양한 경치를 경험했어요. 지상의 소음과는 완전히 다른 평화롭고 황홀한 세계가 펼쳐졌습니다. 서로의 존재만으로도 깊은 교감을 느낄 수 있었습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 6,
        name: "user",
        time: "5일 전",
        title: "임신과 관련된 태몽을 꾸었습니다.",
        category: "태몽",
        detail:
          "꿈 속에서 작은 동물이 제 품 안에서 자라며 새로운 생명을 상징했어요. 따뜻하고 부드러운 숨결과 체온이 느껴졌고, 동물이 천천히 움직이는 모습에서 생명의 신비로움을 깊이 느꼈습니다. 그 순간 새로운 시작과 책임감을 실감하며, 앞으로의 삶에서 중요한 변화를 예감했습니다. 꿈을 깨고 나서도 마음 깊은 곳에서 경이로운 감정이 오래도록 남았습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 7,
        name: "user",
        time: "6일 전",
        title: "어두운 골목에서 무서운 존재를 만나는 꿈을 꾸었습니다.",
        category: "무서운",
        detail:
          "어두운 골목을 지나가다가 알 수 없는 그림자가 갑자기 나타났어요. 심장이 쿵쾅거리고 공포감이 가득했지만, 두려움을 이겨내고 조심스럽게 골목을 빠져나왔습니다. 주변의 소리 하나하나가 크게 느껴졌고, 그림자가 멀어지는 순간 안도감과 함께 현실과 꿈의 경계를 다시 인식하게 되었어요. 긴장감과 아찔함이 오래도록 기억에 남았습니다.",
        photo: "/images/photo1.png",
      },
      {
        id: 8,
        name: "user",
        time: "7일 전",
        title: "알 수 없는 상황에서 여러 가지 일이 일어나는 꿈을 꾸었습니다.",
        category: "기타",
        detail:
          "꿈속에서 여러 기이한 상황들이 이어졌어요. 공간이 계속 변하고 만나는 사람과 사건이 빠르게 바뀌었지만, 혼란 속에서도 순간순간 대응하며 흐름을 이해할 수 있었습니다. 평범한 현실과 전혀 다른 논리와 구조가 뒤섞인 세계였고, 혼란 속에서도 호기심과 흥미가 계속 느껴졌습니다. 특별한 의미는 없지만 독특하고 강렬한 경험으로 기억에 남았습니다.",
        photo: "/images/photo1.png",
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

  const { isDarkMode } = useThemeContext();

  return (
    <Container>
      <Title title="꿈 이야기 목록" />
      <List.EmojiCategoryWrap dark={isDarkMode}>
        <BackButton to="/" />
        {emojiCategories.map((categorylist, index) => (
          <List.EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(categorylist)}
            isActive={selectedCategory === categorylist}
            dark={isDarkMode}
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
                dark={isDarkMode}
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
                  <List.ListItemTime dark={isDarkMode}>
                    {dream.time}
                  </List.ListItemTime>
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
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </Container>
  );
}

export default DreamList;
