import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import InputErrorMessage from "../components/common/InputErrorMessage";
import PostButton from "../components/common/PostButton";
import TextArea from "../components/common/TextArea";
import Title from "../components/common/Title";
import { DreamWrite } from "./DreamWritePage.styles";

// 전역(window) 자리
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
      <DreamWrite.DreamTitleWrap>
        <DreamWrite.DreamTitle>꿈 제목</DreamWrite.DreamTitle>
        <DreamWrite.DreamTitleText
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
        <DreamWrite.DreamTitleTextNum isMax={titleTextCount.length >= 20}>
          {titleTextCount.length}/20
        </DreamWrite.DreamTitleTextNum>
      </DreamWrite.DreamTitleWrap>
      <DreamWrite.DreamEmojiWrap>
        <DreamWrite.DreamEmojiTitle>Dream-Emoji</DreamWrite.DreamEmojiTitle>
        <DreamWrite.DreamEmojiBox error={!!emojiError}>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("shine");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "shine"}
          >
            <img src="/images/shine_icon.png" alt="shine" />
            빛나는
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("happy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "happy"}
          >
            <img src="/images/happy_icon.png" alt="happy" />
            행복한
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("dreamy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "dreamy"}
          >
            <img src="/images/dreamy_icon.png" alt="dreamy" />
            몽환적
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("shy");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "shy"}
          >
            <img src="/images/shy_icon.png" alt="shy" />
            부끄러움
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("weird");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "weird"}
          >
            <img src="/images/weird_icon.png" alt="weird" />
            신기한
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("prenatal");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "prenatal"}
          >
            <img src="/images/prenatal_dream_icon.png" alt="prenatal_dream" />
            태몽
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("scared");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "scared"}
          >
            <img src="/images/scared_icon.png" alt="scared" />
            무서운
          </DreamWrite.DreamEmojiList>
          <DreamWrite.DreamEmojiList
            onClick={() => {
              setSelectEmoji("etc");
              if (emojiError) setEmojiError("");
            }}
            isSelected={selectEmoji === "etc"}
          >
            <img src="/images/etc_icon.png" alt="etc" />
            기타
          </DreamWrite.DreamEmojiList>
        </DreamWrite.DreamEmojiBox>
        {/* 에러 메세지 */}
        {emojiError && <InputErrorMessage message={emojiError} />}
      </DreamWrite.DreamEmojiWrap>
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
