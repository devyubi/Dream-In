import styled from "@emotion/styled";
import React from "react";
import Header from "../components/Header";

// 전역(window) 자리
const Container = styled.div`
  position: relative;
  max-width: 1280px;
  margin: auto;
  padding: 15px;
  background-color: rgba(252, 243, 246, 0.43);
`;
const BackKey = styled.button`
  padding: 7px;
  border: none;
  border-radius: 50%;
  margin-bottom: 15px;
  background-color: #fcf3fb;
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &&:hover {
    background-color: #fad4e8;
  }
`;
const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  border-top: 1px solid #000;
  padding-top: 10px;
`;
const Title = styled.h1`
  margin: 0;
  color: #493d78;
`;
const SubTitle = styled.h2`
  margin: 0;
  color: #493d78;
`;
const DreamTitle = styled.h2`
  padding-top: 10px;
  padding-left: 10px;
  color: #493d78;
`;
const DreamTitleText = styled.input`
  position: relative;
  border: 1px solid #c8c8c8;
  padding-top: 5px;
  max-height: 50px;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  width: 100%;
  height: 50px;
`;
const TextNum = styled.span`
  position: absolute;
  right: 30px;
  top: 200px;
  color: #493d78;
`;

function DreamWritePage() {
  return (
    <>
      <Header />
      <Container>
        <BackKey>뒤로</BackKey>
        <Top>
          <Title>꿈 이야기 기록하기</Title>
          <SubTitle>어젯밤 꾼 꿈을 아름다운 이야기로 남겨주세요.</SubTitle>
        </Top>
        <DreamTitle>꿈 제목</DreamTitle>
        <DreamTitleText title="text"></DreamTitleText>
        <TextNum>0/100</TextNum>
      </Container>
    </>
  );
}

export default DreamWritePage;
