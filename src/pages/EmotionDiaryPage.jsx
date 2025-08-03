import styled from "@emotion/styled";
import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import PostButton from "../components/common/PostButton";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TextArea from "../components/common/TextArea";
import InputErrorMessage from "../components/common/InputErrorMessage";
import { useNavigate } from "react-router-dom";

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
const CalendarWrap = styled.div`
  padding: 30px 25px 0 25px;
`;
const DiarySection = styled.div`
  padding: 40px 25px 60px 25px;
`;
const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  color: #25254d;
`;

function EmotionDiaryPage() {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePost = () => {
    setError("");

    if (!text) {
      setError("감정일기를 입력해주세요.");
      return;
    }

    navigate("/emotiondetail", {
      state: {
        date: date.toISOString().split("T")[0],
        diary: text,
      },
    });
  };

  return (
    <Container>
      <BackButton to="/" />
      <Top>
        <Title>감정일기</Title>
        <SubTitle>오늘의 기분을 기록해보세요.</SubTitle>
      </Top>

      <CalendarWrap>
        <Calendar onChange={setDate} value={date} locale="ko-KR" />
      </CalendarWrap>

      <DiarySection>
        <Label>{date.toLocaleDateString()}의 감정일기</Label>
        <TextArea
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="오늘의 기분이나 사건을 적어보세요."
          maxLength={1000}
          error={error}
        />
        {error && <InputErrorMessage message={error} />}
      </DiarySection>

      <PostButton onClick={handlePost}>일기 저장하기</PostButton>
    </Container>
  );
}

export default EmotionDiaryPage;
