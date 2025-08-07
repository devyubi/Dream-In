import "../../css/sleep/sleepweeklysummary.css";

function SleepWeeklySummary({ records = [] }) {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);

  const recentRecords = records.filter(r => {
    const date = new Date(r.day);
    return date >= sevenDaysAgo && date <= now;
  });

  const averageRating =
    recentRecords.reduce((sum, r) => sum + r.rating, 0) /
    (recentRecords.length || 1);

  const averageSleepMinutes =
    recentRecords.reduce((sum, r) => {
      const [bedH, bedM] = r.bedTime.split(":").map(Number);
      const [wakeH, wakeM] = r.wakeTime.split(":").map(Number);
      let start = bedH * 60 + bedM;
      let end = wakeH * 60 + wakeM;
      if (end <= start) end += 24 * 60;
      return sum + (end - start);
    }, 0) / (recentRecords.length || 1);

  const avgHours = Math.floor(averageSleepMinutes / 60);
  const avgMins = Math.round(averageSleepMinutes % 60);

  const averageEfficiency = "85%"; // 추후 개선 가능

  return (
    <div className="weekly-summary">
      {recentRecords.length === 0 ? (
        <p>최근 7일 간의 기록이 없습니다.</p>
      ) : (
        <div className="summary-grid">
          <div className="stat-card">
            <div className="stat-value">
              {avgHours}시간 {avgMins}분
            </div>
            <div className="stat-label">평균 수면 시간</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{averageRating.toFixed(1)} / 5</div>
            <div className="stat-label">평균 수면 질</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{averageEfficiency}</div>
            <div className="stat-label">평균 수면 효율</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SleepWeeklySummary;
