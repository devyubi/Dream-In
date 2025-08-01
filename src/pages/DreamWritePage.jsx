import styled from "@emotion/styled";
import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import PostButton from "../components/common/PostButton";
import TextArea from "../components/common/TextArea";

// 전역(window) 자리
const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #000;
  padding-top: 20px;
`;
const Title = styled.h1`
  margin: 0;
  color: #25254d;
`;
const SubTitle = styled.h2`
  margin: 0;
  color: #493d78;
  font-size: 14px;
`;
const DreamTitleWrap = styled.div`
  position: relative;
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
`;
const DreamTitle = styled.h2``;
const DreamTitleText = styled.input`
  font-family: "tj400";
  border: 1px solid #c8c8c8;
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
  top: 125px;
  right: 50px;
  /* 입력 글자수가 최대 글자수가 되면 글자수에 경고 표시 */
  color: ${({ isMax }) => (isMax ? "red" : "#493d78")};
  font-weight: ${({ isMax }) => (isMax ? "700" : "400")};
`;
const DreamEmojiWrap = styled.div`
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px;
`;
const DreamEmojiTitle = styled.h2``;
const DreamEmojiBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0;
`;
const DreamEmojiList = styled.li`
  border: 1px solid #c8c8c8;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 208px;
  height: 130px;
  background-color: ${({ isSelected }) => (isSelected ? "#fad4e8" : "#fcf3fb")};
  font-size: 14px;
  cursor: pointer;
  &&:hover {
    background-color: #fad4e8;
    box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
  }
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
  return (
    <Container>
      <BackButton to="/" />
      <Top>
        <Title>꿈 이야기 기록하기</Title>
        <SubTitle>어젯밤 꾼 꿈을 아름다운 이야기로 남겨주세요.</SubTitle>
      </Top>
      <DreamTitleWrap>
        <DreamTitle>꿈 제목</DreamTitle>
        <DreamTitleText
          type="text"
          placeholder="어젯 밤 꿈의 제목을 작성해주세요."
          value={titleTextCount}
          onChange={e => setTitleTextCount(e.target.value)}
          maxLength={50}
        ></DreamTitleText>
        <DreamTitleTextNum isMax={titleTextCount.length >= 50}>
          {titleTextCount.length}/50
        </DreamTitleTextNum>
      </DreamTitleWrap>
      <DreamEmojiWrap>
        <DreamEmojiTitle>Dream-Emoji</DreamEmojiTitle>
        <DreamEmojiBox>
          <DreamEmojiList
            onClick={() => setSelectEmoji("shine")}
            isSelected={selectEmoji === "shine"}
          >
            <img src="/images/shine_icon.png" alt="shine" />
            빛나는
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("happy")}
            isSelected={selectEmoji === "happy"}
          >
            <img src="/images/happy_icon.png" alt="happy" />
            행복한
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("dreamy")}
            isSelected={selectEmoji === "dreamy"}
          >
            <img src="/images/dreamy_icon.png" alt="dreamy" />
            몽환적
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("shy")}
            isSelected={selectEmoji === "shy"}
          >
            <img src="/images/shy_icon.png" alt="shy" />
            부끄러움
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("weird")}
            isSelected={selectEmoji === "weird"}
          >
            <img src="/images/weird_icon.png" alt="weird" />
            신기한
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("prenatal")}
            isSelected={selectEmoji === "prenatal"}
          >
            <img src="/images/prenatal_dream_icon.png" alt="prenatal_dream" />
            태몽
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("scared")}
            isSelected={selectEmoji === "scared"}
          >
            <img src="/images/scared_icon.png" alt="scared" />
            무서운
          </DreamEmojiList>
          <DreamEmojiList
            onClick={() => setSelectEmoji("etc")}
            isSelected={selectEmoji === "etc"}
          >
            <img src="/images/etc_icon.png" alt="etc" />
            기타
          </DreamEmojiList>
        </DreamEmojiBox>
      </DreamEmojiWrap>
      <TextArea
        value={storyTextCount}
        onChange={e => setStoryTextCount(e.target.value)}
        maxLength={1500}
      />
      <PostButton to="/dreamlist">꿈 이야기 게시하기</PostButton>
    </Container>
  );
}

export default DreamWritePage;
