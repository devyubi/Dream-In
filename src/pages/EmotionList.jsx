import { useEffect, useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";
import { useNavigate } from "react-router-dom";

function EmotionList() {
  const [emotionList, setEmotionList] = useState([]);
  const navigate = useNavigate();

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
    ];
    setEmotionList(mockData);
  }, []);

  return (
    <Container>
      <Title title="감정일기 목록" />
      <BackButton to="/" />
      <List.ListWrap>
        {emotionList.map(item => (
          <List.ListItem
            key={item.id}
            onClick={() => navigate(`/emotiondetail/${item.id}`)}
          >
            <List.ListItemUser>
              <List.ListItemUserPhoto>
                <img src={item.photo} alt="유저이미지" />
              </List.ListItemUserPhoto>
              <List.ListItemUserName>{item.name}</List.ListItemUserName>
              <List.ListItemTime>{item.time}</List.ListItemTime>
              <List.ListItemFavorites>
                <img src="/images/star.svg" alt="즐겨찾기" />
              </List.ListItemFavorites>
            </List.ListItemUser>
            <List.ListItemTitle>{item.title}</List.ListItemTitle>
            <List.ListItemDetail>{item.detail}</List.ListItemDetail>
            <List.ListItemDelete>
              <img src="/images/delete_icon.png" alt="삭제" />
            </List.ListItemDelete>
          </List.ListItem>
        ))}
      </List.ListWrap>
    </Container>
  );
}

export default EmotionList;
