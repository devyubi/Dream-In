import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const Container = styled.div`
  font-family: "tj400";
  position: relative;
  max-width: 1280px;
  min-height: 100vh;
  margin: auto;
  margin: 0 20% 0 20%;
  padding: 20px;
  background-color: rgba(252, 243, 246, 0.43);
`;

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
