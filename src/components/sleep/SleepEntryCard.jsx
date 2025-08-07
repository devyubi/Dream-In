// src/components/sleep/SleepEntryCard.jsx
import "../../css/sleep/sleepentrycard.css";
import { FaStar } from "react-icons/fa6";

function SleepEntryCard({ entry }) {
  const { day, rating, text, bedTime, wakeTime } = entry;

  const totalSleep = (() => {
    const [bedH, bedM] = bedTime.split(":").map(Number);
    const [wakeH, wakeM] = wakeTime.split(":").map(Number);

    let start = bedH * 60 + bedM;
    let end = wakeH * 60 + wakeM;

    if (end <= start) end += 24 * 60;

    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hours}시간 ${mins}분`;
  })();

  const formattedDate = new Date(day).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="sleep-entry-card">
      <div className="sleep-entry-header">
        <span>{formattedDate}</span>
        <div className="sleep-entry-stars">
          {Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      </div>

      <div className="sleep-entry-info">
        <div>
          <strong>취침</strong>
          <span>{bedTime}</span>
        </div>
        <div>
          <strong>기상</strong>
          <span>{wakeTime}</span>
        </div>
        <div>
          <strong>총 수면</strong>
          <span>{totalSleep}</span>
        </div>
        <div>
          <strong>수면 질</strong>
          <span>{rating}/5</span>
        </div>
      </div>

      <div className="sleep-entry-memo">
        <div className="sleep-memo-title">메모</div>
        <div className="sleep-memo">{text}</div>
      </div>
    </div>
  );
}

export default SleepEntryCard;
