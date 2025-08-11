import { useEffect, useState } from "react";
import "../../css/sleep/sleepstats.css";
import PieChartWithLabels from "./PieChartAndLabels";
import SleepEntryCard from "./SleepEntryCard";
import SleepWeeklySummary from "./SleepWeeklySummary";

const mockData = [
  {
    day: "2025-08-09",
    rating: 5,
    text: "푹 잤고 좋은 꿈을 꿨어요!",
    bedTime: "23:00",
    wakeTime: "07:30",
  },
  {
    day: "2025-08-02",
    rating: 5,
    text: "푹 잤고 좋은 꿈을 꿨어요!",
    bedTime: "23:00",
    wakeTime: "07:30",
  },
  {
    day: "2025-08-03",
    rating: 5,
    text: "푹 잤고 좋은 꿈을 꿨어요!",
    bedTime: "23:00",
    wakeTime: "07:30",
  },
  {
    day: "2025-08-04",
    rating: 5,
    text: "푹 잤고 좋은 꿈을 꿨어요!",
    bedTime: "23:00",
    wakeTime: "07:30",
  },
  {
    day: "2025-08-05",
    rating: 3,
    text: "자다가 두 번 깼어요.",
    bedTime: "00:00",
    wakeTime: "08:00",
  },
  {
    day: "2025-08-06",
    rating: 4,
    text: "무난하게 잘 잤어요.",
    bedTime: "22:30",
    wakeTime: "06:30",
  },
  {
    day: "2025-08-07",
    rating: 2,
    text: "너무 더워서 자주 깼어요.",
    bedTime: "01:00",
    wakeTime: "07:00",
  },
  {
    day: "2025-08-08",
    rating: 1,
    text: "악몽을 꿨음 ㅠㅠ",
    bedTime: "00:30",
    wakeTime: "06:00",
  },
];

const LABELS = ["매우 나쁨", "나쁨", "보통", "좋음", "매우 좋음"];
const COLORS = ["#ff6961", "#fca652", "#f6d55c", "#88cc88", "#8FC8F6"];

function SleepStats() {
  useEffect(() => {
    setRecords(mockData);
  }, []);

  const [records, setRecords] = useState([]);

  localStorage.setItem("sleepData", JSON.stringify(mockData));

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sleepData")) || [];
    const sorted = saved.sort((a, b) => new Date(b.day) - new Date(a.day));
    setRecords(saved);
  }, []);

  const chartData = LABELS.map((label, idx) => {
    const value = records.filter(r => r.rating === idx + 1).length;
    return { id: label, label, value };
  }).filter(d => d.value > 0);

  return (
    <div className="sleep-stats-container">
      <h2 className="stats-title">수면 통계</h2>

      <PieChartWithLabels records={records} />
      <h1>주간 수면 통계</h1>
      <SleepWeeklySummary records={records} />
      <h1 className="history-title">수면 기록 히스토리</h1>
      <div className="history-list">
        {records.length ? (
          records.map((entry, i) => <SleepEntryCard key={i} entry={entry} />)
        ) : (
          <p className="empty-message">히스토리 없음</p>
        )}
      </div>
    </div>
  );
}

export default SleepStats;
