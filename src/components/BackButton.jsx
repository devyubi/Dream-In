/* eslint-disable react/prop-types */
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useThemeContext } from "../contexts/ThemeContext";

// 2. styled.button으로 스타일링된 버튼 만들기
// 라이트모드용 버튼
const BackLight = styled.button`
  padding: 5px 20px;
  border: 1px solid #e2e2e2;
  border-radius: 24px;
  margin-bottom: 15px;
  background-color: #fcf3fb;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
  &:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 다크모드용 버튼
const BackDark = styled.button`
  padding: 2px 17px;
  border: 1px solid #dbdbdb;
  border-radius: 24px;
  margin-bottom: 15px;
  background: linear-gradient(
    to bottom,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  img {
    width: 27px;
    height: 27px;
  }
  cursor: pointer;
  &:hover {
    background: linear-gradient(
      to right,
      rgb(30, 27, 39),
      rgb(37, 37, 77),
      rgb(51, 51, 110),
      rgb(58, 58, 116),
      rgb(73, 61, 120),
      rgb(84, 71, 131)
    );
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 3. props로 onClick 받기
function BackButton({ onClick }) {
  // useThemeContext가 undefined를 반환할 경우를 대비
  const themeContext = useThemeContext() || { isDarkMode: false };

  // 테마 가져오기 (isDarkMode가 true면 다크모드)
  const { isDarkMode } = themeContext;

  // 기본 버튼
  let BackButton = BackLight;
  let iconSrc = "/images/backlighticon.png";

  // 다크모드 시 버튼 변경
  if (isDarkMode) {
    BackButton = BackDark;
    iconSrc = "/images/backdarkicon.png";
  }

  // 실제 반영
  return (
    <BackButton onClick={onClick}>
      <img src={iconSrc} alt="뒤로가기" />
    </BackButton>
  );
}

export default BackButton;
