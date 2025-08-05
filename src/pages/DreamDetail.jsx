import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import Title from "../components/common/Title";
import { Detail } from "./Detail.styles";

function DreamDetail() {
  const navigate = useNavigate();
  const { state: dream } = useLocation();

  const handleDelete = () => {
    const confirmResult = window.confirm("이 꿈을 정말 삭제하시겠습니까?");
    if (confirmResult) {
      alert("꿈이 삭제되었습니다.");
      // 삭제할 꿈의 ID만 넘김
      navigate("/dreamlist", {
        state: { deletedId: dream?.id },
        replace: true,
      });
    }
  };

  const [dreamList, setDreamList] = useState([]);

  return (
    <Container>
      <BackButton to="/dreamlist" />
      <Title title="꿈 상세보기" />
      <Detail.DetailWrap>
        <Detail.DetailTop>
          <Detail.DetailTitleWrap>
            <Detail.DetailTitle>꿈 상세내용</Detail.DetailTitle>
            <Detail.DetailSubTitle>
              지난 꿈을 다시 기억해보세요.
            </Detail.DetailSubTitle>
          </Detail.DetailTitleWrap>
          <Detail.DetailAiAsk>AI 해몽 요청하기</Detail.DetailAiAsk>
        </Detail.DetailTop>
        <Detail.DetailName
          readOnly
          value={dream?.title || ""}
        ></Detail.DetailName>
        <Detail.DetailText
          readOnly
          value={dream?.detail || ""}
        ></Detail.DetailText>
        <Detail.DetailButtonWrap>
          <Detail.DetailBttuon
            onClick={() =>
              navigate("/dreamedit", {
                state: {
                  id: dream?.id,
                  title: dream?.title,
                  detail: dream?.detail,
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
        <Detail.DetailAiResult
          readOnly
          value={`AI 해몽 결과 예시입니다.`}
        ></Detail.DetailAiResult>
      </Detail.DetailWrap>
    </Container>
  );
}

export default DreamDetail;
