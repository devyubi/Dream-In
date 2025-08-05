/* eslint-disable react/prop-types */
import styled from "@emotion/styled";
import InputErrorMessage from "./InputErrorMessage";

// TextArea 컴포넌트 emotion
const DetailsWrap = styled.div`
  position: relative;
  padding-top: 10px;
  padding-left: 25px;
  padding-right: 25px;
  height: 310px;
`;
const DetailsTitle = styled.h2``;
const DetailsText = styled.textarea`
  font-family: "tj400";
  border: ${({ error }) => (error ? "2px" : "1px")} solid
    ${({ error }) => (error ? "#ff0000" : "#c8c8c8")};
  padding: 15px 10px;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  width: 100%;
  height: 200px;
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

  /* Optional: Firefox */
  scrollbar-width: thin;
  scrollbar-color: #b58edc #f5e6ff;
`;

const DetailsTextNum = styled.span`
  position: absolute;
  top: 240px;
  right: 50px;
  font-family: "tj400";
  /* 입력 글자수가 최대 글자수가 되면 글자수에 경고 표시 */
  color: ${({ isMax }) => (isMax ? "red" : "#493d78")};
  font-weight: ${({ isMax }) => (isMax ? "700" : "400")};
`;

// 컴포넌트 export 함수
export default function TextArea({
  value,
  onChange,
  maxLength = 1500,
  title = "꿈 이야기",
  placeholder = "어젯 밤 꿈에서 무슨 일이 일어났나요? 생생하게 기록해 보세요! 장소, 감정, 감각, 색상 등 기억나는 모든 것을 기록 해보세요!",
  error = false,
}) {
  return (
    <DetailsWrap>
      <DetailsTitle>{title}</DetailsTitle>
      <DetailsText
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        error={error}
      />
      <DetailsTextNum isMax={value.length >= maxLength}>
        {value.length}/{maxLength}
      </DetailsTextNum>
      {error && <InputErrorMessage message={error} />}
    </DetailsWrap>
  );
}
