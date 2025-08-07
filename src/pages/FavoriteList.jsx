import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { List } from "./List.styles";

function FavoriteList() {
  return (
    <Container>
      <BackButton to="/" />
      <Title title="즐겨찾기 목록" />
      <List.ListWrap>
        <List.ListItem>
          <List.ListItemUser>
            <List.ListItemUserPhoto></List.ListItemUserPhoto>
            <List.ListItemUserName></List.ListItemUserName>
            <List.ListItemTime></List.ListItemTime>
            <List.ListItemFavorites></List.ListItemFavorites>
          </List.ListItemUser>
          <List.ListItemTitle></List.ListItemTitle>
          <List.ListItemDetail></List.ListItemDetail>
          <List.ListItemDelete></List.ListItemDelete>
        </List.ListItem>
      </List.ListWrap>
    </Container>
  );
}

export default FavoriteList;
