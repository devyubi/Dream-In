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
import "../css/emotionwritepage.css";
import "../css/calendar.css";

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #544783;
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
  padding: 40px 25px 0px 25px;
`;
const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  color: #25254d;
`;

// 백엔드에서 전달받은 자료
const todoApi = [
  {
    pk: 0,
    title: "점심먹기",
    text: "내용 1",
    day: "2025-07-04",
    img: "/logo192.png",
  },
  {
    pk: 1,
    title: "영화보기",
    text: "내용 2",
    day: "2025-07-17",
    img: "/logo192.png",
  },
  {
    pk: 2,
    title: "책읽기",
    text: "내용 3",
    day: "2025-07-19",
    img: "/logo192.png",
  },
  {
    pk: 3,
    title: "그림그리기",
    text: "내용 4",
    day: "2025-07-29",
    img: "/logo192.png",
  },
];

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

  const weekName = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const formatShortWeekday = (locale, date) => {
    const idx = date.getDay();
    return weekName[idx];
  };

  return (
    <Container>
      <BackButton to="/" />
      <Top>
        <Title>감정일기</Title>
        <SubTitle>오늘의 기분을 기록해보세요.</SubTitle>
      </Top>

      <CalendarWrap>
        <Calendar
          onChange={setDate}
          value={date}
          locale="us-US"
          calendarType="gregory"
        />
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
      </DiarySection>

      <PostButton onClick={handlePost}>일기 저장하기</PostButton>
    </Container>
  );
}

export default EmotionDiaryPage;
