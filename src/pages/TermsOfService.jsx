import styled from "@emotion/styled";
import Container from "../components/common/Container";

const TermsWrap = styled.div`
  line-height: 1.4;
  max-width: 720px;
  margin: 40px auto;
  padding: 0 20px;
  color: #25254d;
`;

const TermsTitle = styled.h1`
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  font-size: 25px;
`;

const TermsSectionTitle = styled.h2`
  margin-top: 25px;
  font-size: 20px;
`;

const TermsList = styled.ul`
  padding: 0 0 0 20px;
`;

const TermsListItem = styled.li`
  margin-bottom: 8px;
  font-size: 16px;
`;

function TermsOfService() {
  return (
    <Container>
      <TermsWrap>
        <TermsTitle>서비스 이용약관</TermsTitle>

        <TermsSectionTitle>서비스 개요</TermsSectionTitle>
        <TermsList>
          <TermsListItem>
            꿈 다이어리는 꿈과 감정을 기록 및 공유할 수 있는 서비스입니다.
          </TermsListItem>
        </TermsList>

        <TermsSectionTitle>회원가입 및 이용 조건</TermsSectionTitle>
        <TermsList>
          <TermsListItem>
            이메일 또는 소셜 로그인(카카오, 구글)을 통해 가입
          </TermsListItem>
          <TermsListItem>만 14세 이상 이용 가능</TermsListItem>
          <TermsListItem>허위 정보 제공 시 서비스 제한 가능</TermsListItem>
        </TermsList>

        <TermsSectionTitle>사용자의 의무</TermsSectionTitle>
        <TermsList>
          <TermsListItem>
            타인을 침해하거나 불쾌감을 주는 게시 금지
          </TermsListItem>
          <TermsListItem>
            시스템 방해 행위(악성 코드, 자동 접근 등) 금지
          </TermsListItem>
        </TermsList>

        <TermsSectionTitle>게시물 관리</TermsSectionTitle>
        <TermsList>
          <TermsListItem>
            작성된 게시물은 서비스 내 활용될 수 있음
          </TermsListItem>
          <TermsListItem>
            공공질서 위반 시 관리자에 의해 삭제 가능
          </TermsListItem>
          <TermsListItem>작성자는 게시물 수정/삭제 가능</TermsListItem>
        </TermsList>

        <TermsSectionTitle>서비스 제공 중단</TermsSectionTitle>
        <TermsList>
          <TermsListItem>
            점검, 장애, 종료 등 사유로 일시/영구적 중단 가능
          </TermsListItem>
        </TermsList>

        <TermsSectionTitle>책임과 면책</TermsSectionTitle>
        <TermsList>
          <TermsListItem>사용자 간 분쟁은 당사자 간 해결</TermsListItem>
          <TermsListItem>
            서비스는 게시 내용의 정확성에 책임지지 않음
          </TermsListItem>
        </TermsList>
      </TermsWrap>
    </Container>
  );
}

export default TermsOfService;
