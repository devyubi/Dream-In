import styled from "@emotion/styled";

const DreamTitleWrap = styled.div`
  position: relative;
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
  height: 120px;
`;
const DreamTitle = styled.h2``;
const DreamTitleText = styled.input`
  font-family: "tj400";
  border: ${({ error }) => (error ? "2px" : "1px")} solid
    ${({ error }) => (error ? "#ff0000" : "#c8c8c8")};
  padding: 8px 10px;
  border-radius: 16px;
  background: linear-gradient(
    to right,
    rgba(230, 179, 247, 0.3),
    rgba(211, 188, 232, 0.3),
    rgba(194, 193, 238, 0.3)
  );
  width: 100%;
  height: 40px;
`;
const DreamTitleTextNum = styled.span`
  font-family: "tj400";
  position: absolute;
  text-align: right;
  top: 115px;
  right: 50px;
  /* 입력 글자수가 최대 글자수가 되면 글자수에 경고 표시 */
  color: ${({ isMax }) => (isMax ? "red" : "#493d78")};
  font-weight: ${({ isMax }) => (isMax ? "700" : "400")};
`;
const DreamEmojiWrap = styled.div`
  padding: 40px 20px 0px 20px;
  min-height: 500px;
`;
const DreamEmojiTitle = styled.h2`
  margin-bottom: 10px;
`;
const DreamEmojiBox = styled.ul`
  border: ${({ error }) => (error ? "2px" : "1px")} solid
    ${({ error }) => (error ? "#ff0000" : "transparent")};
  border-radius: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px 0;
  height: calc(170px * 2 + 20px);
`;
const DreamEmojiList = styled.li`
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 230px;
  height: 130px;
  flex: 1 1 calc((100% - 60px) / 4);
  /* 선택했을 때 배경색 변경 */
  background-color: ${({ isSelected }) => (isSelected ? "#fad4e8" : "#fcf3fb")};
  font-size: 14px;
  /* 선택했을 때 커서모양 기본 */
  cursor: ${({ isSelected }) => (isSelected ? "default" : "pointer")};
  /* 부드럽게 전환되는 효과 */
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
  /* 선택되지 않은 경우에만 hover 적용 */
  ${({ isSelected }) =>
    !isSelected &&
    `    
    &&:hover {
      background-color: #fad4e8;
      box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }
  `}

  img {
    width: 35px;
    height: 30px;
    margin-bottom: 10px;
  }
`;

export const DreamWrite = {
  DreamTitleWrap,
  DreamTitle,
  DreamTitleText,
  DreamTitleTextNum,
  DreamEmojiWrap,
  DreamEmojiTitle,
  DreamEmojiBox,
  DreamEmojiList,
};
