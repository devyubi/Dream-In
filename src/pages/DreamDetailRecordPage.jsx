import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Container from "../components/Container";

function DreamDetailRecordPage() {
  return (
    <Container>
      <Link to="/">
        <BackButton></BackButton>
      </Link>
      꿈 상세보기
    </Container>
  );
}

export default DreamDetailRecordPage;
