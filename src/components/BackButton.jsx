/* eslint-disable react/prop-types */
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
// 1. 아이콘 import하기
import backicon from "../assets/images/backicon.png";

// 2. styled.button으로 스타일링된 버튼 만들기
const BackLight = styled.button`
  padding: 5px 20px;
  border: 1px solid #e2e2e2;
  border-radius: 24px;
  margin-bottom: 15px;
  background-color: #fcf3fb;
  cursor: pointer;
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 3. props로 onClick 받기
function BackButton({ onClick }) {
  return (
    <BackLight onClick={onClick}>
      <img src={backicon} alt="뒤로가기"></img>
    </BackLight>
  );
}

export default BackButton;
