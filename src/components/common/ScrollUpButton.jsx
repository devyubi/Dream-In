import styled from "@emotion/styled";
import { useThemeContext } from "../../contexts/ThemeContext";

const ScrollUpBtn = styled.button`
  position: fixed;
  bottom: 130px;
  right: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: ${({ dark }) =>
    dark
      ? "linear-gradient(to bottom, rgba(230, 179, 247, 0.3), rgba(211, 188, 232, 0.3), rgba(194, 193, 238, 0.3))"
      : "rgba(252,243,251,0.4)"};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 40px;
  height: 40px;

  img {
    object-fit: contain;
    width: 70%;
    height: 70%;
  }
  &:hover {
    background: ${({ dark }) =>
      dark
        ? `linear-gradient(
          to bottom,
          rgb(30, 27, 39),
          rgb(37, 37, 77),
          rgb(51, 51, 110),
          rgb(58, 58, 116),
          rgb(73, 61, 120),
          rgb(84, 71, 131)
        )`
        : "#e57cff4c"};
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

function ScrollUpButton() {
  const { isDarkMode } = useThemeContext();
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollUpBtn
      dark={isDarkMode}
      onClick={scrollUp}
      aria-label="맨위로 스크롤"
    >
      <img
        src={isDarkMode ? "/images/up_arrow_dark.png" : "/images/up_arrow.png"}
        alt="위로가기"
      />
    </ScrollUpBtn>
  );
}

export default ScrollUpButton;
