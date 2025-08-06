import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import SleepRecord from "../components/sleep/SleepRecord";
import SleepTabBar from "../components/sleep/SleepTabBar";
import "../css/sleep/sleeprecordpage.css";
import SleepAnimatedSwitch from "../components/sleep/SleepAnimatedSwitch";

function SleepRecordPage() {
  const [activeTab, setActiveTab] = useState("record");

  return (
    <Container>
      <BackButton to="/" />
      <div className="sleep_record">
        <div className="sleep_record_wrap">
          <SleepTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
          <SleepAnimatedSwitch activeTab={activeTab} />
          <SleepRecord />
        </div>
      </div>
    </Container>
  );
}

export default SleepRecordPage;
