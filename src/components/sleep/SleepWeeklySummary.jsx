import "../../css/sleep/sleepweeklysummary.css";

function SleepWeeklySummary({ records = [] }) {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);

  // r : recentRecords의 각 항목(수면 기록 객체).
  const recentRecords = records.filter(r => {
    const date = new Date(r.day);
    return date >= sevenDaysAgo && date <= now;
  });

  const averageRating =
    recentRecords.reduce((sum, r) => sum + r.rating, 0) /
    (recentRecords.length || 1);

  const averageSleepMinutes =
    // reduce : 배열의 모든 데이터를 하나의 값으로 합친다
    // sum : ( 분 단위로 ) 계산한 총 수면시간 합계
    recentRecords.reduce((sum, r) => {
      const [bedHour, bedMinute] = r.bedTime.split(":").map(Number);
      const [wakeHour, wakeMinute] = r.wakeTime.split(":").map(Number);
      let start = bedHour * 60 + bedMinute;
      let end = wakeHour * 60 + wakeMinute;
      if (end <= start) end += 24 * 60;
      return sum + (end - start);
      // 마지막 0은 합계의 초기값 
    }, 0) / (recentRecords.length || 1);

  const avgHours = Math.floor(averageSleepMinutes / 60);
  const avgMins = Math.round(averageSleepMinutes % 60);
  // 아래 코드는 추후 개선하겠습니다. (실제 계산 로직 반영 안되었음)
  const averageEfficiency = "85%"; // averageEfficiency : 수면 효율을 나타내는 변수

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
            {/* averageRating.toFixed(1) : 평균 별점 값. 소수점 한 자리까지 반올림해서 문자열로 변환함 */}
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
