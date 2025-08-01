import React from "react";
import Container from "../components/common/Container";
import BackButton from "../components/common/BackButton";

function SleepRecordPage() {
  return (
    <Container>
      <BackButton to="/" />
      <h1>수면기록</h1>
    </Container>
  );
}

export default SleepRecordPage;
