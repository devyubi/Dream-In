import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import shine from "../../public/images/shine_icon.png";
import shy from "../../public/images/shy_icon.png";
import happy from "../../public/images/happy_icon.png";
import dreamy from "../../public/images/dreamy_icon.png";
import weird from "../../public/images/weird_icon.png";
import prenatal from "../../public/images/prenatal_dream_icon.png";
import scared from "../../public/images/scared_icon.png";
import etc from "../../public/images/etc_icon.png";
import { useState } from "react";
import Container from "../components/Container";

// 전역(window) 자리
const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  border-top: 1px solid #000;
  padding-top: 20px;
`;
const Title = styled.h1`
  margin: 0;
  color: #493d78;
`;
const SubTitle = styled.h2`
  margin: 0;
  color: #493d78;
`;
const DreamTitleWrap = styled.div`
  position: relative;
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
`;
const DreamTitle = styled.h2`
  color: #493d78;
`;
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
  color: #493d78;
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
const DreamStoryWrap = styled.div`
  position: relative;
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
`;
const DreamStoryTitle = styled.h2``;
const DreamStroyText = styled.textarea`
  font-family: "tj400";
  border: 1px solid #c8c8c8;
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

  /* Scrollbar styling (WebKit only: Chrome, Safari, Edge Chromium) */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b58edc; /* 스크롤바 색 */
    border-radius: 8px;
    border: 2px solid #f5e6ff; /* thumb 주변 테두리 (배경색과 맞추면 공간처럼 보임) */
  }

  &::-webkit-scrollbar-track {
    background-color: #f5e6ff; /* 트랙 색상 */
    border-radius: 16px;
  }

  /* Optional: Firefox */
  scrollbar-width: thin;
  scrollbar-color: #b58edc #f5e6ff;
`;
const DreamStoryTextNum = styled.span`
  position: absolute;
  top: 285px;
  right: 50px;
`;
const DreamPostWrap = styled.div`
  padding-top: 30px;
  padding-left: 25px;
  padding-right: 25px;
`;
const DreamPost = styled.button`
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

function DreamWritePage() {
  // 글자 입력 시 글자 카운트 함수
  const [titleTextCount, setTitleTextCount] = useState("");
  const [storyTextCount, setStoryTextCount] = useState("");
  // 꿈 이모지 클릭하면 포커스되고 옮겨가기
  const [selectEmoji, setSelectEmoji] = useState(null);
  return (
    <Container>
      <Link to="/">
        <BackButton />
      </Link>
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
        <DreamTitleTextNum>{titleTextCount.length}/50</DreamTitleTextNum>
      </DreamTitleWrap>
      <DreamEmojiWrap>
        <DreamEmojiTitle>Dream-Emoji</DreamEmojiTitle>
        <DreamEmojiBox>
          <DreamEmojiList
            key={shine}
            onClick={() => setSelectEmoji("shine")}
            isSelected={selectEmoji === "shine"}
          >
            <img src={shine} alt="shine" />
            빛나는
          </DreamEmojiList>
          <DreamEmojiList
            key={happy}
            onClick={() => setSelectEmoji("happy")}
            isSelected={selectEmoji === "happy"}
          >
            <img src={happy} alt="happy" />
            행복한
          </DreamEmojiList>
          <DreamEmojiList
            key={dreamy}
            onClick={() => setSelectEmoji("dreamy")}
            isSelected={selectEmoji === "dreamy"}
          >
            <img src={dreamy} alt="dreamy" />
            몽환적
          </DreamEmojiList>
          <DreamEmojiList
            key={shy}
            onClick={() => setSelectEmoji("shy")}
            isSelected={selectEmoji === "shy"}
          >
            <img src={shy} alt="shy" />
            부끄러움
          </DreamEmojiList>
          <DreamEmojiList
            key={weird}
            onClick={() => setSelectEmoji("weird")}
            isSelected={selectEmoji === "weird"}
          >
            <img src={weird} alt="weird" />
            신기한
          </DreamEmojiList>
          <DreamEmojiList
            key={prenatal}
            onClick={() => setSelectEmoji("prenatal")}
            isSelected={selectEmoji === "prenatal"}
          >
            <img src={prenatal} alt="prenatal" />
            태몽
          </DreamEmojiList>
          <DreamEmojiList
            key={scared}
            onClick={() => setSelectEmoji("scared")}
            isSelected={selectEmoji === "scared"}
          >
            <img src={scared} alt="scared" />
            무서운
          </DreamEmojiList>
          <DreamEmojiList
            key={etc}
            onClick={() => setSelectEmoji("etc")}
            isSelected={selectEmoji === "etc"}
          >
            <img src={etc} alt="etc" />
            기타
          </DreamEmojiList>
        </DreamEmojiBox>
      </DreamEmojiWrap>
      <DreamStoryWrap>
        <DreamStoryTitle>꿈 이야기</DreamStoryTitle>
        <DreamStroyText
          placeholder="어젯 밤 꿈에서 무슨 일이 일어났나요? 생생하게 기록해 보세요! 장소, 감정, 감각, 색상 등 기억나는 모든 것을 기록 해보세요!"
          value={storyTextCount}
          onChange={e => setStoryTextCount(e.target.value)}
          maxLength={1500}
        ></DreamStroyText>
        <DreamStoryTextNum>{storyTextCount.length}/1500</DreamStoryTextNum>
      </DreamStoryWrap>
      <DreamPostWrap>
        <Link to="/dreamdetailrecord">
          <DreamPost>꿈 이야기 게시하기</DreamPost>
        </Link>
      </DreamPostWrap>
    </Container>
  );
}

export default DreamWritePage;
