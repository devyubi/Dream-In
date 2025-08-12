import "../../css/sleep/sleeprecord.css";

const SleepRecord = ({ bedTime, setBedTime, wakeTime, setWakeTime }) => {
  return (
    <div className="sleep_record_container">
      <h2 className="sleep_record_title">오늘의 수면 기록</h2>
      <p className="sleep_record_subtitle">어젯밤 수면 패턴을 기록해보세요</p>

      <div className="time_input_group">
        <div className="time_input">
          <label htmlFor="bedTime">취침 시간</label>
          <div className="input_with_icon">
            <input
              id="bedTime"
              type="time"
              value={bedTime}
              onChange={e => setBedTime(e.target.value)}
            />
          </div>
        </div>

        <div className="time_input">
          <label htmlFor="wakeTime">기상 시간</label>
          <div className="input_with_icon">
            <input
              id="wakeTime"
              type="time"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepRecord;
