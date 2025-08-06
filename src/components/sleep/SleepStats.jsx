import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { FaStar } from "react-icons/fa6";
import "../../css/sleep/sleepstats.css";

const LABELS = ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"];
const COLORS = ["#ff6961", "#fca652", "#f6d55c", "#88cc88", "#4caf50"];

function SleepStats() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sleepData")) || [];
    setRecords(saved);
  }, []);

  const chartData = LABELS.map((label, idx) => {
    const value = records.filter(r => r.rating === idx + 1).length;
    return { id: label, label, value };
  }).filter(d => d.value > 0);

  return (
    <div className="sleep-stats-container">
      <h2 className="stats-title">수면 통계</h2>

      <div className="chart-wrapper">
        {chartData.length > 0 ? (
          <ResponsivePie
            data={chartData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            colors={COLORS}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 50,
                itemsSpacing: 5,
                itemWidth: 80,
                itemHeight: 18,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        ) : (
          <p className="empty-chart">저장된 수면 기록이 없습니다.</p>
        )}
      </div>

      <h3 className="history-title">수면 기록 히스토리</h3>
      <div className="history-list">
        {records.length ? (
          records.map((e, i) => (
            <div key={i} className="history-card">
              <p>
                <strong>{e.day}</strong>
              </p>
              <p>
                {Array.from({ length: e.rating }, (_, j) => (
                  <FaStar key={j} className="star-icon" />
                ))}
                <span className="rating-label"> {LABELS[e.rating - 1]}</span>
              </p>
              <p>
                {e.bedTime} → {e.wakeTime}
              </p>
              <p>{e.text}</p>
            </div>
          ))
        ) : (
          <p className="empty-message">히스토리 없음</p>
        )}
      </div>
    </div>
  );
}

export default SleepStats;
