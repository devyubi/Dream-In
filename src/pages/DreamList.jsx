import styled from "@emotion/styled";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";

const EmojiCategoryWrap = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: rgba(252, 243, 251, 0.4);
  gap: 10px;
  margin: 0 0 30px 0;
  padding: 20px 0;
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
  border: 1px solid #000;
  width: 100%;
  height: auto;
  border-radius: 24px;
  padding: 20px;
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
  border: 1px solid #000;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 30px;
  padding: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const DreamListItemUserName = styled.p``;
const DreamListItemTime = styled.span``;
const DreamListItemTitle = styled.p`
  margin-left: 30px;
`;
const DreamListItemDetail = styled.div`
  margin-left: 30px;
`;

function DreamList() {
  return (
    <Container>
      <BackButton to="/" />
      <EmojiCategoryWrap>
        <EmojiCategoryItem>전체</EmojiCategoryItem>
        <EmojiCategoryItem>빛나는</EmojiCategoryItem>
        <EmojiCategoryItem>행복한</EmojiCategoryItem>
        <EmojiCategoryItem>몽환적</EmojiCategoryItem>
        <EmojiCategoryItem>부끄러움</EmojiCategoryItem>
        <EmojiCategoryItem>신기한</EmojiCategoryItem>
        <EmojiCategoryItem>태몽</EmojiCategoryItem>
        <EmojiCategoryItem>무서운</EmojiCategoryItem>
        <EmojiCategoryItem>기타</EmojiCategoryItem>
        <EmojiCategoryItem>최신순</EmojiCategoryItem>
      </EmojiCategoryWrap>
      <DreamListWrap>
        <DreamListItem>
          <DreamListItemUser>
            <DreamListItemUserPhoto>
              <img src="/images/photo1.png" alt="유저이미지" />
            </DreamListItemUserPhoto>
            <DreamListItemUserName>박송문</DreamListItemUserName>
            <DreamListItemTime>1시간 전</DreamListItemTime>
          </DreamListItemUser>
          <DreamListItemTitle>꿈 제목</DreamListItemTitle>
          <DreamListItemDetail>꿈 내용</DreamListItemDetail>
        </DreamListItem>
        <DreamListItem>
          <DreamListItemUser>
            <DreamListItemUserPhoto>
              <img src="/images/photo1.png" alt="유저이미지" />
            </DreamListItemUserPhoto>
            <DreamListItemUserName>박송문</DreamListItemUserName>
            <DreamListItemTime>1시간 전</DreamListItemTime>
          </DreamListItemUser>
          <DreamListItemTitle>꿈 제목</DreamListItemTitle>
          <DreamListItemDetail>꿈 내용</DreamListItemDetail>
        </DreamListItem>
        <DreamListItem>
          <DreamListItemUser>
            <DreamListItemUserPhoto>
              <img src="/images/photo1.png" alt="유저이미지" />
            </DreamListItemUserPhoto>
            <DreamListItemUserName>박송문</DreamListItemUserName>
            <DreamListItemTime>1시간 전</DreamListItemTime>
          </DreamListItemUser>
          <DreamListItemTitle>꿈 제목</DreamListItemTitle>
          <DreamListItemDetail>꿈 내용</DreamListItemDetail>
        </DreamListItem>
      </DreamListWrap>
    </Container>
  );
}

export default DreamList;
