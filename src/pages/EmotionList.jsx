import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";

function EmotionList() {
  return (
    <Container>
      <Title title="감정일기 목록" />
      <BackButton to="/" />
      <List.ListWrap>
        <List.ListItem>
          <List.ListItemUser>
            <List.ListItemUserPhoto>
              <img src="/images/photo1.png" alt="유저이미지" />
            </List.ListItemUserPhoto>
            <List.ListItemUserName>이름</List.ListItemUserName>
            <List.ListItemTime>기록 시간</List.ListItemTime>
            <List.ListItemFavorites>
              <img src="/images/star.svg" alt="즐겨찾기" />
            </List.ListItemFavorites>
          </List.ListItemUser>
          <List.ListItemTitle>꿈이름</List.ListItemTitle>
          <List.ListItemDetail>꿈 내용</List.ListItemDetail>
          <List.ListItemDelete>
            <img src="/images/delete_icon.png" alt="삭제" />
          </List.ListItemDelete>
        </List.ListItem>
      </List.ListWrap>
    </Container>
  );
}

export default EmotionList;
