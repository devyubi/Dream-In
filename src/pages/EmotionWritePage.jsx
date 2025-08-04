import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import PostButton from "../components/common/PostButton";
import TextArea from "../components/common/TextArea";
import "../css/calendar.css";
import "../css/emotionwritepage.css";

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
  padding: 30px 25px 0px 25px;
`;
const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  color: #25254d;
`;

// 백엔드에서 전달받은 자료
const emotionDiaryApi = [
  {
    pk: 0,
    title: "우울",
    text: "굉장하게 우울함",
    day: "2025-07-04",
  },
  {
    pk: 1,
    title: "기쁨",
    text: "굉장하게 기쁨. 선물받음!",
    day: "2025-07-17",
  },
  {
    pk: 2,
    title: "보통",
    text: "",
    day: "2025-07-19",
  },
  {
    pk: 3,
    title: "무서움",
    text: "천둥번개쳐서 엄청 무서웠음",
    day: "2025-07-29",
  },
];

function EmotionDiaryPage() {
  const [date, setDate] = useState(new Date());
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [mockData] = useState(emotionDiaryApi);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedDate = date.toISOString().split("T")[0];
    const diary = mockData.find(item => item.day === selectedDate);
    if (diary) {
      setText(diary.text);
    } else {
      setText("");
    }
  }, [date]);

  const handlePost = () => {
    setError("");
    if (!text) {
      setError("감정일기를 입력해주세요.");
      return;
    }

    navigate("/", {
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
