import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import "../../css/sleep/sleepqualityrating.css";
import PostButton from "../common/PostButton";
import TextArea from "../common/TextArea";
import React from "react";

function SleepQualityRating({
  rating,
  setRating,
  onSaveComplete,
  bedTime,
  wakeTime,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // 수면 메모 + 평가 저장 핸들러
  const handlePost = () => {
    setError("");

    if (!bedTime || !wakeTime) {
      setError("취침시간, 기상시간을 모두 설정해주세요");
      return;
    }

    if (!rating) {
      setError("수면 질 평가 별점을 설정해주세요");
      return;
    }

    // 입력 유효성 검사 앞뒤
    if (!text.trim()) {
      setError("수면메모를 작성해주세요");
      return;
    }

    // 저장할 객체
    const savedData = {
      day: new Date().toLocaleDateString("sv-SE"), // 'YYYY-MM-DD'
      rating, // 수면 질 평가 값
      text, // 수면 메모
      bedTime,
      wakeTime,
    };

    // 로컬스토리지에 저장 (기존 항목에 추가)
    const existing = JSON.parse(localStorage.getItem("sleepData")) || [];
    const updated = [...existing, savedData];
    localStorage.setItem("sleepData", JSON.stringify(updated));

    alert("저장되었습니다");

    // 저장 후 콜백 실행 (예: 통계 탭으로 전환)
    if (onSaveComplete) {
      onSaveComplete();
    }
  };

  // 수면 질 평가 옵션 목록
  const ratingOptions = [
    { value: 1, label: "매우 나쁨" },
    { value: 2, label: "나쁨" },
    { value: 3, label: "보통" },
    { value: 4, label: "좋음" },
    { value: 5, label: "매우 좋음" },
  ];

  return (
    <div className="sleep_quality_rating ">
      <p className="sleep_quality_label">수면 질 평가</p>
      <div className="rating_boxes">
        {ratingOptions.map(option => (
          <div
            key={option.value}
            className={`rating_box ${rating === option.value ? "active" : ""}`}
            onClick={() =>
              setRating(rating === option.value ? 0 : option.value)
            }
          >
            <div className="stars">
              {[...Array(option.value)].map((_, i) => (
                <FaStar key={i} className="star filled" />
              ))}
            </div>
            <p className="rating_label">{option.label}</p>
          </div>
        ))}
      </div>

      <div className="diary_section">
        <TextArea
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="수면 중 특별한 점이나 느낌을 기록해보세요! (예: 꿈, 중간에 깬 시간 등)"
          maxLength={1000}
          error={error}
        />
      </div>

      <PostButton onClick={handlePost}>저장하기</PostButton>
    </div>
  );
}

export default React.memo(SleepQualityRating);
