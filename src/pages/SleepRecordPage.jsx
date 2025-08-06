import { useState } from "react";
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import SleepTabBar from "../components/sleep/SleepTabBar";
import SleepAnimatedSwitch from "../components/sleep/SleepAnimatedSwitch";
import "../css/sleep/sleeprecordpage.css";

function SleepRecordPage() {
  const [activeTab, setActiveTab] = useState("record");
  const [rating, setRating] = useState(0);

  return (
    <Container>
      <BackButton to="/" />
      <div className="sleep_record">
        <div className="sleep_record_wrap">
          {/* 상단 탭 */}
          <SleepTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* 탭 내용 */}
          <SleepAnimatedSwitch
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            rating={rating}
            setRating={setRating}
          />
        </div>
      </div>
    </Container>
  );
}

export default SleepRecordPage;
