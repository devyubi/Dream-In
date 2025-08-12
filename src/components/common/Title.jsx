import styled from "@emotion/styled";
import { useThemeContext } from "../../contexts/ThemeContext";

const TitleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #544783;
  padding-top: 20px;
  margin-bottom: 20px;
`;
const TitleH1 = styled.h1`
  margin: 0;
  /* color: #25254d; */
  color: ${({ dark }) => (dark ? "#ddb7ef" : "#493d78")};
`;
const SubTitleH2 = styled.h2`
  margin: 0;
  /* color: #493d78; */
  color: ${({ dark }) => (dark ? "#ddb7ef" : "#493d78")};
  font-size: 14px;
`;

function Title({ title, subtitle }) {
  const { isDarkMode } = useThemeContext();

  return (
    <TitleWrap>
      <TitleH1 dark={isDarkMode}>{title}</TitleH1>
      <SubTitleH2 dark={isDarkMode}>{subtitle}</SubTitleH2>
    </TitleWrap>
  );
}

export default Title;
