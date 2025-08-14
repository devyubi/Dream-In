// SleepRecordPage.jsx
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom"; // 추가
import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import SleepTabBar from "../components/sleep/SleepTabBar";
import SleepAnimatedSwitch from "../components/sleep/SleepAnimatedSwitch";

function SleepRecordPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "record"; // URL에서 tab 값 읽기
  const [activeTab, setActiveTab] = useState(initialTab);

  const [rating, setRating] = useState(0);
  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  // 콜백 최적화
  const updateActiveTab = useCallback(tab => {
    setActiveTab(tab);
  }, []);

  return (
    <Container>
      <BackButton to="/" />
      <div className="sleep_record">
        <div className="sleep_record_wrap">
          {/* 상단 탭 */}
          <SleepTabBar activeTab={activeTab} setActiveTab={updateActiveTab} />

          {/* 탭 내용 */}
          <SleepAnimatedSwitch
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            rating={rating}
            setRating={setRating}
            bedTime={bedTime}
            setBedTime={setBedTime}
            wakeTime={wakeTime}
            setWakeTime={setWakeTime}
          />
        </div>
      </div>
    </Container>
  );
}

export default SleepRecordPage;
