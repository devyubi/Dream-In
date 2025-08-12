import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../contexts/ThemeContext";

// PostButton 컴포넌트 emotion
const PostButtonWrap = styled.div`
  padding-left: 25px;
  padding-right: 25px;
  margin-bottom: 20px;
`;
const PostLinkButton = styled.button`
  font-family: "tj400";
  color: ${({ dark }) => (dark ? "#ddb7ef" : "#493d78")};
  width: 100%;
  height: 40px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  border: 1px solid #c8c8c8;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
  &&:hover {
    background: ${({ dark }) =>
      dark
        ? `linear-gradient(
          to top,
          rgb(30, 27, 39),
          rgb(37, 37, 77),
          rgb(51, 51, 110),
          rgb(58, 58, 116),
          rgb(73, 61, 120),
          rgb(84, 71, 131)
        )`
        : "#fad4e8"};
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

// 컴포넌트 export 함수
export default function PostButton({ onClick, to, error, children }) {
  const { isDarkMode } = useThemeContext();
  if (to) {
    // to가 있으면 Link 버튼처럼 활용
    return (
      <PostButtonWrap>
        <Link
          to={to}
          onClick={onClick}
          style={{
            textDecoration: "none",
            "font-size": "13px",
          }}
        >
          <PostLinkButton error={error} as="div" dark={isDarkMode}>
            {children}
          </PostLinkButton>
        </Link>
      </PostButtonWrap>
    );
  }
  // to가 없으면 버튼으로 활용
  return (
    <PostButtonWrap>
      <PostLinkButton onClick={onClick} error={error} dark={isDarkMode}>
        {children}
      </PostLinkButton>
    </PostButtonWrap>
  );
}
