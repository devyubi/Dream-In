/* eslint-disable react/prop-types */
import styled from "@emotion/styled";

const TitleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #544783;
  padding-top: 20px;
`;
const TitleH1 = styled.h1`
  margin: 0;
  color: #25254d;
`;
const SubTitleH2 = styled.h2`
  margin: 0;
  color: #493d78;
  font-size: 14px;
`;
function Title({ title, subtitle }) {
  return (
    <TitleWrap>
      <TitleH1>{title}</TitleH1>
      <SubTitleH2>{subtitle}</SubTitleH2>
    </TitleWrap>
  );
}

export default Title;
