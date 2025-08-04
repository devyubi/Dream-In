import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";

const EmojiCategoryWrap = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  width: calc(100%);
  margin: 0 0px 30px 0px;
  background-color: rgba(252, 243, 251, 0.4);
  gap: 10px;
  padding: 20px 0;
  border-radius: 16px;
`;
const EmojiCategoryItem = styled.li`
  border: 1px solid #e7e7e7;
  padding: 15px 30px;
  border-radius: 24px;
  cursor: pointer;

  background-color: ${({ isActive }) => (isActive ? "#fad4e8" : "transparent")};
  box-shadow: ${({ isActive }) =>
    isActive ? "6px 6px 8px rgba(0,0,0,0.15" : "none"};

  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;
const DreamListWrap = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
  padding: 0;
`;
const DreamListItem = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: rgba(252, 243, 251, 0.4);
  width: 100%;
  border-radius: 24px;
  padding: 20px;
  gap: 7px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;
const DreamListItemUser = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const DreamListItemUserPhoto = styled.div`
  display: flex;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  overflow: hidden;
  margin-left: 30px;
  padding: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const DreamListItemUserName = styled.p`
  border-radius: 24px;
  background-color: #fdebfd;
  padding: 10px;
  color: #8672d0;
  font-size: 13px;
  font-weight: 600;
`;
const DreamListItemTime = styled.span`
  color: #8672d0;
`;
const DreamListItemTitle = styled.h3`
  margin-left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
`;
const DreamListItemCategory = styled.span`
  border: 1px solid #c2c2c2;
  border-radius: 16px;
  background-color: #fcf3fb;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8672d0;
  padding: 5px 8px;
  font-weight: 400;
  font-size: 13px;
`;
const DreamListItemDetail = styled.div`
  margin: 0 30px;
  height: 50px;
  border-bottom: 1px solid #544783;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.7;
`;
const DreamListItemDelete = styled.div`
  padding: 0;
  margin: 5px 30px 0 0;
  width: 15px;
  height: 17px;
  overflow: hidden;
  align-self: flex-end;
  transform: translateX(-30px);
  cursor: pointer;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
const DreamListItemFavorites = styled.div`
  position: absolute;
  top: 25px;
  right: 70px;
  cursor: pointer;

  img {
  }
`;

function DreamList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const deletedId = location.state?.deletedId;

  const [dreamList, setDreamList] = useState([
    { id: 1, title: "꿈 A", detail: "내용 A", isFavorite: false },
    { id: 2, title: "꿈 B", detail: "내용 B", isFavorite: false },
    { id: 3, title: "꿈 C", detail: "내용 C", isFavorite: false },
  ]);

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

    setDreamList(mockData);
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
      <EmojiCategoryWrap>
        <BackButton to="/" />
        {emojiCategories.map((categorylist, index) => (
          <EmojiCategoryItem
            key={index}
            onClick={() => setSelectedCategory(categorylist)}
            isActive={selectedCategory === categorylist}
          >
            {categorylist}
          </EmojiCategoryItem>
        ))}
      </EmojiCategoryWrap>
      {filteredDreams.length > 0 && (
        <DreamListWrap>
          {filteredDreams.map(dream => (
            <DreamListItem
              key={dream.id}
              onClick={() =>
                navigate(`/dreamdetail/${dream.id}`, { state: dream })
              }
            >
              <DreamListItemUser>
                <DreamListItemUserPhoto>
                  <img src={dream.photo} alt="유저이미지" />
                </DreamListItemUserPhoto>
                <DreamListItemUserName>{dream.name}</DreamListItemUserName>
                <DreamListItemTime>{dream.time}</DreamListItemTime>
                <DreamListItemFavorites
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
                </DreamListItemFavorites>
              </DreamListItemUser>
              <DreamListItemTitle>
                {dream.title}
                <DreamListItemCategory>#{dream.category}</DreamListItemCategory>
              </DreamListItemTitle>
              <DreamListItemDetail>{dream.detail}</DreamListItemDetail>
              <DreamListItemDelete
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
              </DreamListItemDelete>
            </DreamListItem>
          ))}
        </DreamListWrap>
      )}
    </Container>
  );
}

export default DreamList;
