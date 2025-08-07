import { FaStar } from "react-icons/fa6";
import "../../css/sleep/sleepstats.css";

const LABELS = ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"];

function SleepEntryCard({ entry }) {
  return (
    <div className="history-card">
      <p>
        <strong>{entry.day}</strong>
      </p>
      <p>
        {Array.from({ length: entry.rating }, (_, j) => (
          <FaStar key={j} className="star-icon" />
        ))}
        <span className="rating-label"> {LABELS[entry.rating - 1]}</span>
      </p>
      <p>
        {entry.bedTime} → {entry.wakeTime}
      </p>
      <p>{entry.text}</p>
    </div>
  );
}

export default SleepEntryCard;
