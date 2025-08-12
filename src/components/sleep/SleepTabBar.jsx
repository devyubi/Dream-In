import React from "react";
import "../../css/sleep/sleeptabbar.css";

function SleepTabBar({ activeTab, setActiveTab }) {
  return (
    <div className="sleep_tab_bar">
      <button
        className={`sleep_tab_button ${activeTab === "record" ? "active" : ""}`}
        onClick={() => setActiveTab("record")}
      >
        수면 기록
      </button>

      <button
        className={`sleep_tab_button ${activeTab === "stats" ? "active" : ""}`}
        onClick={() => setActiveTab("stats")}
      >
        통계 및 히스토리
      </button>
    </div>
  );
}

export default React.memo(SleepTabBar);
