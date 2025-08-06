import styled from "@emotion/styled";

const MadeInWrap = styled.div`
  background-color: #fcf3fb;
  padding: 20px;
  margin: 0;
  border-radius: 16px;
`;
const MadeInTitle = styled.h1`
  color: #25254d;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;
const MadeInSubTitle = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #493d78;
  transform: translateX(-7px);
`;
const MadeInList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 10px 0 0 0;
`;
const MadeInPerson = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  width: 250px;
  border: 1px solid #c8c8c8;
  border-radius: 24px;
  gap: 13px;
`;
const MadeInPersonPhoto = styled.div`
  display: flex;
  border: 1px solid none;
  border-radius: 50%;
  height: 80px;
  width: 80px;
  overflow: hidden;
  margin: 0;
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;
const MadeInPersonName = styled.h2`
  color: #25254d;
  margin: 0;
`;
const MadeInPersonRole = styled.p`
  color: #7866c2;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
`;
const MadeInPersonEmail = styled.p`
  color: #493d78;
  font-size: 13px;
  margin: 0;
`;
const MadeInPersonOneLiner = styled.p`
  color: #b950ff;
  font-weight: 600;
  margin: 0;
`;
function MadeIn() {
  return (
    <MadeInWrap>
      <MadeInTitle>
        Dream-In의 꿈을 잇는 사람들
        <img src="/images/clickarrow.png" alt="열기" />
      </MadeInTitle>
      <MadeInSubTitle>함께 꿈을 기록하는 세 개발자</MadeInSubTitle>
      <MadeInList>
        <MadeInPerson>
          <MadeInPersonPhoto>
            <img src="images/photo1.png" alt="1" />
          </MadeInPersonPhoto>
          <MadeInPersonName>박재현</MadeInPersonName>
          <MadeInPersonRole>꿈 기록, AI 연동 등</MadeInPersonRole>
          <MadeInPersonEmail>dev.clarova@gmail.com</MadeInPersonEmail>
          <MadeInPersonOneLiner>
            협업과 실행을 주도하는 리더
          </MadeInPersonOneLiner>
        </MadeInPerson>
        <MadeInPerson>
          <MadeInPersonPhoto>
            <img src="images/photo2.png" alt="2" />
          </MadeInPersonPhoto>
          <MadeInPersonName>송병근</MadeInPersonName>
          <MadeInPersonRole>회원 인증, Database 연동 등</MadeInPersonRole>
          <MadeInPersonEmail>sbkcoding@gmail.com</MadeInPersonEmail>
          <MadeInPersonOneLiner>
            보이지 않는 흐름을 잇는 데이터 설계자
          </MadeInPersonOneLiner>
        </MadeInPerson>
        <MadeInPerson>
          <MadeInPersonPhoto>
            <img src="images/photo3.png" alt="3" />
          </MadeInPersonPhoto>
          <MadeInPersonName>문유비</MadeInPersonName>
          <MadeInPersonRole>메인페이지, 전체 기획 등</MadeInPersonRole>
          <MadeInPersonEmail>dev.munyubi@gmail.com</MadeInPersonEmail>
          <MadeInPersonOneLiner>
            시작과 끝을 설계하는 기획자
          </MadeInPersonOneLiner>
        </MadeInPerson>
      </MadeInList>
    </MadeInWrap>
  );
}

export default MadeIn;
