import styled from "@emotion/styled";
import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import PostButton from "../components/common/PostButton";
import TextArea from "../components/common/TextArea";
import InputErrorMessage from "../components/common/InputErrorMessage";
import { useNavigate } from "react-router-dom";
import Title from "../components/common/Title";

// 전역(window) 자리
const DreamTitleWrap = styled.div`
  position: relative;
  padding-top: 30px;
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
  top: 130px;
  right: 50px;
  /* 입력 글자수가 최대 글자수가 되면 글자수에 경고 표시 */
  color: ${({ isMax }) => (isMax ? "red" : "#493d78")};
  font-weight: ${({ isMax }) => (isMax ? "700" : "400")};
`;
const DreamEmojiWrap = styled.div`
  padding: 60px 20px 0px 20px;
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

function DreamWritePage() {
  // 글자 입력 시 글자 카운트 함수
  const [titleTextCount, setTitleTextCount] = useState("");
  const [storyTextCount, setStoryTextCount] = useState("");
  // 꿈 이모지 클릭하면 포커스되고 옮겨가기
  const [selectEmoji, setSelectEmoji] = useState(null);

  // 입력하지 않았을 때 에러
  const [titleError, setTitleError] = useState("");
  const [emojiError, setEmojiError] = useState("");
  const [storyError, setStoryError] = useState("");

  const navigate = useNavigate();

  // 게시하기 클릭 시 체크할 내용 함수
  const handlePost = () => {
    // 에러 메세지 초기화
    setTitleError("");
    setEmojiError("");
    setStoryError("");

    let isValid = true;

    if (!titleTextCount) {
      setTitleError("꿈 제목을 작성해주세요.");
      isValid = false;
    }

    if (!selectEmoji) {
      setEmojiError("감정을 선택해주세요.");
      isValid = false;
    }

    if (!storyTextCount) {
      setStoryError("꿈 이야기를 작성해주세요.");
      isValid = false;
    }

    if (!isValid) return;

    // 정상 입력 시 연결된 페이지 이동
    navigate("/dreamdetail", {
      state: {
        title: titleTextCount,
        emotion: selectEmoji,
        story: storyTextCount,
      },
    });
  };

  return (
    <Container>
      <BackButton to="/" />
      <Title
        title="꿈 이야기 기록하기"
        subtitle="어젯 밤 꾼 꿈을 아름다운 이야기로 남겨주세요."
      />
      <DreamTitleWrap>
        <DreamTitle>꿈 제목</DreamTitle>
        <DreamTitleText
          type="text"
          placeholder="어젯 밤 꿈의 제목을 작성해주세요."
          value={titleTextCount}
          onChange={e => {
            setTitleTextCount(e.target.value);
            if (titleError) setTitleError("");
          }}
          maxLength={20}
          error={!!titleError}
        />
        {/* 에러 메세지 */}
        {titleError && <InputErrorMessage message={titleError} />}
        <DreamTitleTextNum isMax={titleTextCount.length >= 20}>
          {titleTextCount.length}/20
        </DreamTitleTextNum>
      </DreamTitleWrap>
      <DreamEmojiWrap>
        <DreamEmojiTitle>Dream-Emoji</DreamEmojiTitle>
        <DreamEmojiBox error={!!emojiError}>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("shine");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "shine"}
          >
            <img src="/images/shine_icon.png" alt="shine" />
            빛나는
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("happy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "happy"}
          >
            <img src="/images/happy_icon.png" alt="happy" />
            행복한
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("dreamy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "dreamy"}
          >
            <img src="/images/dreamy_icon.png" alt="dreamy" />
            몽환적
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("shy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "shy"}
          >
            <img src="/images/shy_icon.png" alt="shy" />
            부끄러움
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("weird");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "weird"}
          >
            <img src="/images/weird_icon.png" alt="weird" />
            신기한
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("prenatal");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "prenatal"}
          >
            <img src="/images/prenatal_dream_icon.png" alt="prenatal_dream" />
            태몽
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("scared");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "scared"}
          >
            <img src="/images/scared_icon.png" alt="scared" />
            무서운
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => {
              setSelectEmoji("etc");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "etc"}
          >
            <img src="/images/etc_icon.png" alt="etc" />
            기타
          </DreamEmojiList>
        </DreamEmojiBox>
        {/* 에러 메세지 */}
        {emojiError && <InputErrorMessage message={emojiError} />}
      </DreamEmojiWrap>
      <TextArea
        value={storyTextCount}
        onChange={e => {
          setStoryTextCount(e.target.value);
          if (storyError) setStoryError("");
        }}
        maxLength={1500}
        error={storyError}
      />
      <PostButton onClick={handlePost}>꿈 이야기 게시하기</PostButton>
    </Container>
  );
}

export default DreamWritePage;
