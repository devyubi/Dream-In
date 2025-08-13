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

// 백엔드에서 전달받은 자료
const emotionDiaryApi = [
  { pk: 0, title: "우울", text: "굉장하게 우울함", day: "2025-08-04" },
  { pk: 1, title: "기쁨", text: "굉장하게 기쁨. 선물받음!", day: "2025-07-17" },
  { pk: 2, title: "보통", text: "", day: "2025-07-19" },
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
  const [allData, setAllData] = useState(emotionDiaryApi);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedDate = date.toLocaleDateString("sv-SE");
    const diary = allData.find(item => item.day === selectedDate);
    if (diary) {
      setText(diary.text);
    } else {
      setText("");
    }
  }, [date, allData]);

  const handlePost = () => {
    setError("");
    if (!text.trim()) {
      setError("감정일기를 입력해주세요.");
      return;
    }
    const selectedDate = date.toLocaleDateString("sv-SE");
    const diaryIndex = allData.findIndex(item => item.day === selectedDate);
    let updateData = [...allData];

    if (diaryIndex !== -1) {
      updateData[diaryIndex] = { ...updateData[diaryIndex], text };
      alert("수정되었습니다");
    } else {
      updateData.push({
        pk: allData.length,
        title: "",
        text,
        day: selectedDate,
      });
      alert("저장되었습니다");
    }

    setAllData(updateData);
    navigate("/emotionlist");
  };

  const weekName = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const formatShortWeekday = (locale, date) => weekName[date.getDay()];

  return (
    <Container>
      <BackButton to="/" />

      <div className="emotion_diary_header">
        <h1 className="emotion_diary_title">감정일기</h1>
        <h2 className="emotion_diary_subtitle">오늘의 기분을 기록해 보세요</h2>
      </div>

      <div className="emotion_diary_calendar_wrap">
        <Calendar
          onChange={setDate}
          value={date}
          locale="us-US"
          calendarType="gregory"
          formatShortWeekday={formatShortWeekday}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const dateStr = date.toLocaleDateString("sv-SE");
              const hasDiary = allData.some(
                item => item.day === dateStr && item.text.trim() !== "",
              );
              if (hasDiary) return "diary-date";
            }
            return null;
          }}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const dateStr = date.toLocaleDateString("sv-SE");
              const hasDiary = allData.some(
                item => item.day === dateStr && item.text.trim() !== "",
              );
              if (hasDiary) return <span>📌</span>;
            }
            return null;
          }}
        />
      </div>

      <div className="emotion_diary_section">
        <label className="emotion_diary_label">
          {date.toLocaleDateString()} 의 감정일기
        </label>
        <TextArea
          title="감정 다이어리"
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="오늘의 기분을 자유롭게 적어보세요!"
          maxLength={1000}
          error={error}
        />
      </div>

      <PostButton onClick={handlePost}>저장하기</PostButton>
    </Container>
  );
}

export default EmotionDiaryPage;
