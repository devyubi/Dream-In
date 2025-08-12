import styled from "@emotion/styled";
import { useThemeContext } from "../../contexts/ThemeContext";

const MadeInWrap = styled.div`
  /* background-color: #fcf3fb; */
  background-color: ${({ dark }) => (dark ? "#1c1752" : "#fcf3fb")};
  padding: 20px;
  margin: 0;
  border-radius: 16px;
`;
const MadeInTitle = styled.h1`
  /* color: #25254d; */
  color: ${({ dark }) => (dark ? "#fcf3fb" : "#25254d")};
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
  /* color: #493d78; */
  color: ${({ dark }) => (dark ? "#fcf3fb" : "#493d78")};
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
  /* color: #25254d; */
  color: ${({ dark }) => (dark ? "#fcf3fb" : "#25254d")};
  margin: 0;
`;
const MadeInPersonRole = styled.p`
  /* color: #7866c2; */
  color: ${({ dark }) => (dark ? "#d56ac8" : "#7866c2")};
  font-size: 13px;
  font-weight: 600;
  margin: 0;
`;
const MadeInPersonEmail = styled.p`
  /* color: #493d78; */
  color: ${({ dark }) => (dark ? "#fcf3fb" : "#493d78")};
  font-size: 13px;
  margin: 0;
`;
const MadeInPersonOneLiner = styled.p`
  color: #b950ff;
  font-weight: 600;
  margin: 0;
`;

const madePerson = [
  {
    name: "박재현",
    alt: "1",
    role: "꿈 기록, AI 연동 동",
    email: "dev.clarova@gmail.com",
    oneliner: "협업과 실행을 주도하는 리더",
  },
  {
    name: "송병근",
    alt: "2",
    role: "회원 인증, Database 연동 등",
    email: "sbkcoding@gmail.com",
    oneliner: "보이지 않는 흐름을 잇는 데이터 설계자",
  },
  {
    name: "문유비",
    alt: "3",
    role: "메인페이지, 전체 기획 등",
    email: "dev.munyubi@gmail.com",
    oneliner: "시작과 끝을 설계하는 기획자",
  },
];

function MadeIn() {
  const { isDarkMode } = useThemeContext();

  return (
    <MadeInWrap dark={isDarkMode}>
      <MadeInTitle dark={isDarkMode}>Dream-In의 꿈을 잇는 사람들</MadeInTitle>
      <MadeInSubTitle dark={isDarkMode}>
        함께 꿈을 엮는 세 개발자
      </MadeInSubTitle>
      <MadeInList>
        {madePerson.map(({ name, alt, role, email, oneliner }) => (
          <MadeInPerson>
            <MadeInPersonPhoto>
              <img src={`/images/${alt}.png`} alt={alt} />
            </MadeInPersonPhoto>
            <MadeInPersonName dark={isDarkMode}>{name}</MadeInPersonName>
            <MadeInPersonRole dark={isDarkMode}>{role}</MadeInPersonRole>
            <MadeInPersonEmail dark={isDarkMode}>{email}</MadeInPersonEmail>
            <MadeInPersonOneLiner dark={isDarkMode}>
              {oneliner}
            </MadeInPersonOneLiner>
          </MadeInPerson>
        ))}
      </MadeInList>
    </MadeInWrap>
  );
}

export default MadeIn;
