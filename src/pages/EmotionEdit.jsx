import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { Detail } from "./Detail.styles";

function EmotionEdit() {
  return (
    <Container>
      <BackButton to="/emotiondetail" />
      <Title title="감정일기 이야기 수정하기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>감정일기 수정하기</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 감정을 수정하세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
        </Detail.DetailTop>
        <Detail.DetailName></Detail.DetailName>
        <Detail.DetailText></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon>저장하기</Detail.DetailBttuon>
        </Detail.DetailButtonWrap>
      </Detail.DetailWrap>
    </Container>
  );
}

export default EmotionEdit;
