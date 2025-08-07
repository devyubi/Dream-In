import { ResponsivePie } from "@nivo/pie";
import { FaStar } from "react-icons/fa6";

const LABELS = ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"];
const COLORS = ["#ff6961", "#fca652", "#f6d55c", "#88cc88", "#8FC8F6"];

function PieChartAndLabels({ records }) {
  // ㅊㅏ트 7일 이내의 데이터만 반영
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);

  const recentRecords = records.filter(r => {
    const recordDate = new Date(r.day);
    return recordDate >= sevenDaysAgo && recordDate <= now;
  });

  const chartData = LABELS.map((label, idx) => {
    const value = recentRecords.filter(r => r.rating === idx + 1).length;
    return { id: label, label, value };
  }).filter(d => d.value > 0);

  if (chartData.length === 0) {
    return <p className="empty-chart">저장된 수면 기록이 없습니다.</p>;
  }

  return (
    <div className="chart-section">
      <div className="pie-chart-wrapper">
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
          legends={[]} // 범례는 생략
        />
      </div>

      <div className="labels-right">
        {LABELS.map((label, idx) => {
          const starCount = 5 - idx;
          return (
            <div className="label-item" key={idx}>
              <div
                className="color-circle"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span>{label}</span>
              <div className="stars">
                {Array.from({ length: starCount }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PieChartAndLabels;
