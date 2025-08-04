import styled from "@emotion/styled";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #544783;
  padding-top: 20px;
  margin-bottom: 30px;
`;
const Title = styled.h1`
  margin: 0;
  color: #25254d;
`;
const DreamModifyWrap = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  border-radius: 24px;
  display: flex;
  flex-direction: column;
`;
const DreamModifyTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
`;
const DreamModifyTitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const DreanModifyTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;
const DreamModifySubTitle = styled.p`
  margin: 0;
  font-size: 16px;
`;
const DreamModifyAiAsk = styled.button`
  padding: 17px 25px;
  max-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  background-color: #fcf3fb;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;
const DreamModifyName = styled.input`
  font-family: "tj400";
  font-size: 16px;
  margin: 0 30px 30px 30px;
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  background-color: #fcf3fb;
  padding: 8px 10px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  height: 40px;
`;
const DreamModifyText = styled.textarea`
  font-family: "tj400";
  font-size: 16px;
  margin: 0 30px 30px 30px;
  padding: 15px 10px;
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  min-height: 200px;
  resize: none;
  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b58edc; /* 스크롤바 색 */
    border-radius: 8px;
    border: 2px solid #f5e6ff; /* 주변 테두리 */
  }

  &::-webkit-scrollbar-track {
    background-color: #f5e6ff; /* 트랙 색상 */
    border-radius: 16px;
  }

  scrollbar-width: thin;
  scrollbar-color: #b58edc #f5e6ff;
`;
const DreamModifyButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  margin-bottom: 30px;
`;
const DreamModifyBttuon = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 10px 30px;
  border: 1px solid #e2e2e2;
  border-radius: 16px;
  background-color: #fcf3fb;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

function DreamDetail() {
  const location = useLocation();
  const dream = location.state;
  const [dreamList, setDreamList] = useState([]);

  const handleDelete = () => {
    const confirmResult = window.confirm("이 꿈을 정말 삭제하시겠습니까?");
    if (confirmResult) {
      alert("꿈이 삭제되었습니다.");
      // 삭제할 꿈의 ID만 넘김
      Navigate("/dreamlist", { state: { deletedId: dream.id } });
    }
  };

  return (
    <Container>
      <BackButton to="/dreamlist" />
      <Top>
        <Title>꿈 상세보기</Title>
      </Top>
      <DreamModifyWrap>
        <DreamModifyTop>
          <DreamModifyTitleWrap>
            <DreanModifyTitle>꿈 상세내용</DreanModifyTitle>
            <DreamModifySubTitle>
              지난 꿈을 다시 기억해보세요.
            </DreamModifySubTitle>
          </DreamModifyTitleWrap>
          <DreamModifyAiAsk>AI 해몽 요청하기</DreamModifyAiAsk>
        </DreamModifyTop>
        <DreamModifyName readOnly value={dream?.title || ""}></DreamModifyName>
        <DreamModifyText readOnly value={dream?.detail || ""}></DreamModifyText>
        <DreamModifyButtonWrap>
          <DreamModifyBttuon>수정하기</DreamModifyBttuon>
          <DreamModifyBttuon onClick={handleDelete}>삭제하기</DreamModifyBttuon>
        </DreamModifyButtonWrap>
      </DreamModifyWrap>
    </Container>
  );
}

export default DreamDetail;
