import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import "../../css/sleep/sleeprecord.css";

const SleepRecord = () => {
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  return (
    <div className="sleep-record-container">
      <h2 className="sleep-record-title">오늘의 수면 기록</h2>
      <p className="sleep-record-subtitle">어젯밤 수면 패턴을 기록해보세요</p>

      <div className="time-input-group">
        <div className="time-input">
          <label htmlFor="bedTime">취침 시간</label>
          <div className="input-with-icon">
            <input
              id="bedTime"
              type="time"
              value={bedTime}
              onChange={e => setBedTime(e.target.value)}
            />
          </div>
        </div>

        <div className="time-input">
          <label htmlFor="wakeTime">기상 시간</label>
          <div className="input-with-icon">
            <input
              id="wakeTime"
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
            />
          </div>
        </div>
        <div>
          별<FaStar />
        </div>
      </div>
    </div>
  );
};

export default SleepRecord;
