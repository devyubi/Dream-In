import styled from "@emotion/styled";
import Container from "../components/common/Container";

const PrivacyWrap = styled.div`
  line-height: 1.4;
  max-width: 720px;
  margin: 20px auto;
  padding: 20px;
  color: #25254d;
`;

const PrivacyTitle = styled.h1`
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
  font-size: 25px;
`;

const PrivacySectionTitle = styled.h2`
  margin-top: 25px;
  font-size: 20px;
`;

const PrivacyList = styled.ul`
  padding: 0 0 0 20px;
`;

const PrivacyListItem = styled.li`
  margin-bottom: 8px;
  font-size: 16px;
`;

function PrivacyPolicy() {
  return (
    <Container>
      <PrivacyWrap>
        <PrivacyTitle>개인정보처리방침</PrivacyTitle>

        <PrivacySectionTitle>수집하는 개인정보 항목</PrivacySectionTitle>
        <PrivacyList>
          <PrivacyListItem>
            <strong>필수:</strong> 이메일, 닉네임
          </PrivacyListItem>
          <PrivacyListItem>
            <strong>선택:</strong> 생년월일, 성별, 프로필 사진
          </PrivacyListItem>
          <PrivacyListItem>
            <strong>자동 수집:</strong> 이용기록, 접속로그, 쿠키, 기기정보
          </PrivacyListItem>
          <PrivacyListItem>
            <strong>소셜 로그인:</strong> 카카오/구글 로그인 시 일부 정보 제공
          </PrivacyListItem>
        </PrivacyList>

        <PrivacySectionTitle>개인정보 수집 및 이용 목적</PrivacySectionTitle>
        <PrivacyList>
          <PrivacyListItem>사용자 식별 및 회원 관리</PrivacyListItem>
          <PrivacyListItem>꿈/감정 기록 등 서비스 기능 제공</PrivacyListItem>
          <PrivacyListItem>문의 응대 및 공지 전달</PrivacyListItem>
          <PrivacyListItem>통계 분석을 통한 서비스 개선</PrivacyListItem>
        </PrivacyList>

        <PrivacySectionTitle>보유 및 이용 기간</PrivacySectionTitle>
        <PrivacyList>
          <PrivacyListItem>회원 탈퇴 시 즉시 삭제</PrivacyListItem>
          <PrivacyListItem>
            관련 법령 따라 일부 기록 보관 (최대 5년)
          </PrivacyListItem>
        </PrivacyList>

        <PrivacySectionTitle>제3자 제공 및 위탁</PrivacySectionTitle>
        <PrivacyList>
          <PrivacyListItem>외부에 개인정보 제공 없음</PrivacyListItem>
          <PrivacyListItem>
            서비스 운영을 위한 일부 정보 위탁 가능
          </PrivacyListItem>
        </PrivacyList>

        <PrivacySectionTitle>이용자의 권리</PrivacySectionTitle>
        <PrivacyList>
          <PrivacyListItem>개인정보 열람, 수정, 삭제 요청 가능</PrivacyListItem>
          <PrivacyListItem>소셜 로그인 계정 연동 해지 가능</PrivacyListItem>
        </PrivacyList>
      </PrivacyWrap>
    </Container>
  );
}

export default PrivacyPolicy;
