/* eslint-disable react/prop-types */
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

// PostButton 컴포넌트 emotion
const PostButtonWrap = styled.div`
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
`;
const PostLinkButton = styled.button`
  font-family: "tj400";
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
  &&:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

// 컴포넌트 export 함수
export default function PostButton({ to, children }) {
  return (
    <PostButtonWrap>
      <Link to={to}>
        <PostLinkButton>{children}</PostLinkButton>
      </Link>
    </PostButtonWrap>
  );
}
