import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { Detail } from "./Detail.styles";

function EmotionDetail() {
  const navigate = useNavigate();
  const { state: emotion } = useLocation();

  const handleDelete = () => {
    const confirmResult = window.confirm("이 꿈을 정말 삭제하시겠습니까?");
    if (confirmResult) {
      alert("꿈이 삭제되었습니다.");
      // 삭제한 꿈의 ID 넘김
      navigate("/emotionlist", {
        state: { deleteId: emotion?.id },
        replace: true,
      });
    }
  };

  return (
    <Container>
      <BackButton to="/emotionlist" />
      <Title title="감정일기 상세보기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>감정일기 상세내용</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 감정을 다시 기억해보세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
        </Detail.DetailTop>
        <Detail.DetailName
          readOnly
          value={emotion?.title || ""}
        ></Detail.DetailName>
        <Detail.DetailText
          readOnly
          value={emotion?.detail || ""}
        ></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon
            onClick={() =>
              navigate("/emotionedit", {
                state: {
                  id: emotion?.id,
                  title: emotion?.title,
                  detail: emotion?.detail,
                },
              })
            }
          >
            수정하기
          </Detail.DetailBttuon>
          <Detail.DetailBttuon onClick={handleDelete}>
            삭제하기
          </Detail.DetailBttuon>
        </Detail.DetailButtonWrap>
      </Detail.DetailWrap>
    </Container>
  );
}

export default EmotionDetail;
