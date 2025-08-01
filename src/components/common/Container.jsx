/* eslint-disable react/prop-types */
import styled from "@emotion/styled";

// 컨테이너 컴포넌트 emotion
const ContainerDiv = styled.div`
  border-radius: 20px;
  font-family: "tj400";
  position: relative;
  max-width: 1280px;
  min-height: 100vh;
  margin: auto;
  margin: 0 20%;
  padding: 20px;
  background-color: rgba(252, 243, 251, 0.3);
`;

// 컴포넌트 export 함수
export default function Container({ children }) {
  return <ContainerDiv>{children}</ContainerDiv>;
}
