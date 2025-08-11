import { useEffect } from "react";
import "../../css/sleep/sleepentrycard.css";
import { FaStar } from "react-icons/fa6";

function SleepEntryCard({ entry }) {
  const { day, rating, text, bedTime, wakeTime } = entry;
  const totalSleep = () => {
    const [bedHours, bedMinute] = bedTime.split(":").map(Number);
    const [wakeHours, wakeMinute] = wakeTime.split(":").map(Number);

    let start = bedHours * 60 + bedMinute;
    let end = wakeHours * 60 + wakeMinute;

    if (end <= start) {
      end += 24 * 60;
    }
    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    const result = `${hours}시간 ${minutes}분`;
    return result;
  };

  useEffect(() => {
    totalSleep();
  }, []);

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
          <span>{totalSleep()}</span>
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
