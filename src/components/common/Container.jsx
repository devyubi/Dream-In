import styled from "@emotion/styled";
import { useThemeContext } from "../../contexts/ThemeContext";

// 컨테이너 컴포넌트 emotion
const ContainerDiv = styled.div`
  font-family: "tj400";
  position: relative;
  max-width: 1280px;
  min-height: 100vh;
  margin: 0 20%;
  padding: 20px;
  /* background-color: rgba(252, 243, 251, 0.3); */
  background-color: ${({ dark }) =>
    dark ? "rgba(54, 54, 110, 0.3)" : "rgba(252, 243, 251, 0.3)"};
  color: ${({ dark }) => (dark ? "#fff" : "#000")};
  transition: all 0.3s ease;
`;

// 컴포넌트 export 함수
export default function Container({ children }) {
  const { isDarkMode } = useThemeContext();

  return <ContainerDiv dark={isDarkMode}>{children}</ContainerDiv>;
}
