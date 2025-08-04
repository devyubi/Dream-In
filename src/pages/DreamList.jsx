import styled from "@emotion/styled";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import { useEffect, useState } from "react";

const EmojiCategoryWrap = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  left: 50%;
  width: calc(100% + 40px);
  margin: 0 -20px 30px -20px;
  background-color: rgba(252, 243, 251, 0.4);
  gap: 10px;
  padding: 20px 0;
  border-radius: 16px;
`;
const EmojiCategoryItem = styled.li`
  border: 1px solid #e7e7e7;
  padding: 15px 30px;
  border-radius: 24px;
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
  gap: 10px;
`;
const DreamListItemUser = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const DreamListItemUserPhoto = styled.div`
  display: flex;
  justify-content: center;
  width: 30px;
  height: 30px;
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
`;
const DreamListItemTime = styled.span`
  color: #8672d0;
`;
const DreamListItemTitle = styled.p`
  margin-left: 30px;
`;
const DreamListItemDetail = styled.div`
  margin-left: 30px;
  height: 50px;
  border-bottom: 1px solid #544783;
`;
const DreamListItemDelete = styled.div`
  padding: 0;
  margin: 0;
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

  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;
const DreamListItemFavorites = styled.div`
  position: absolute;
  top: 25px;
  right: 35px;

  img {
  }
`;

function DreamList() {
  const [dreamList, setDreamList] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "박송문",
        time: "1시간 전",
        title: "하늘을 나는 꿈을 꾸었습니다.",
        detail: "하늘을 아이언맨처럼 빠르게 날았습니다. I'm ironman.",
        photo: "/images/photo1.png",
      },
      {
        id: 2,
        name: "송문박",
        time: "1시간 전",
        title: "하늘에서 아이언맨이 날고 있는 것을 보는 꿈을 꾸었습니다.",
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
        detail:
          "하늘을 올려다 보았며 아이언맨을 보고 있는 사람을 보는 꿈을 꾸었어요. He is man.",
        photo: "/images/photo3.png",
      },
    ];

    setDreamList(mockData);
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
    "최신순",
  ];

  return (
    <Container>
      <BackButton to="/" />
      <EmojiCategoryWrap>
        {emojiCategories.map((category, index) => (
          <EmojiCategoryItem key={index}>{category}</EmojiCategoryItem>
        ))}
      </EmojiCategoryWrap>
      {dreamList.length > 0 && (
        <DreamListWrap>
          {dreamList.map(dream => (
            <DreamListItem key={dream.id}>
              <DreamListItemUser>
                <DreamListItemUserPhoto>
                  <img src={dream.photo} alt="유저이미지" />
                </DreamListItemUserPhoto>
                <DreamListItemUserName>{dream.name}</DreamListItemUserName>
                <DreamListItemTime>{dream.time}</DreamListItemTime>
                <DreamListItemFavorites>
                  <img src="/images/star.svg" alt="즐겨찾기" />
                </DreamListItemFavorites>
              </DreamListItemUser>
              <DreamListItemTitle>{dream.title}</DreamListItemTitle>
              <DreamListItemDetail>{dream.detail}</DreamListItemDetail>
              <DreamListItemDelete>
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
