import BackButton from "../components/common/BackButton";
import Container from "../components/common/Container";
import "../css/sleeprecordpage.css";

function SleepRecordPage() {
  return (
    <Container>
      <BackButton to="/" />
      <div className="sleep_record">
        <div className="sleep_record_wrap">
          <h1>수면기록</h1>
          <h3>어젯밤 수면 패턴을 기록해보세요</h3>
        </div>
      </div>
    </Container>
  );
}

export default SleepRecordPage;
