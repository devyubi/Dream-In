import styled from "@emotion/styled";

const FooterWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const FooterTop = styled.div``;
const FooterTopInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterTopInfoTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
  }
`;
const FooterTopInfoDetail = styled.h3``;
const FooterTopInfoSocialList = styled.ul``;
const FooterTopInfoSocialItem = styled.li``;
const FooterTopContactList = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterTopContactTitle = styled.h2``;
const FooterTopContactWrap = styled.address``;
const FooterTopContactEmail = styled.a``;
const FooterTopContactCall = styled.a``;
const FooterTopContactAddr = styled.p``;
const FooterBottomWrap = styled.div``;
const FooterBottomLegal = styled.div``;
const FooterBottomPrivacy = styled.p``;
const FooterBottomTerms = styled.p``;
const FooterBottomCompany = styled.p``;
const FooterBottomNote = styled.p``;

function Footer() {
  return (
    <FooterWrap>
      <FooterTop>
        <FooterTopInfo>
          <FooterTopInfoTitle>Dream-In</FooterTopInfoTitle>
          <FooterTopInfoDetail>
            당신의 꿈을 기록하고 해석하는 특별한 공간입니다. AI 기술과 심리학의
            만남으로 더 깊은 자아를 발견해보세요.
          </FooterTopInfoDetail>
          <FooterTopInfoSocialList>
            <FooterTopInfoSocialItem>인스타</FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>트위터</FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>페이스북</FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>유튜브</FooterTopInfoSocialItem>
          </FooterTopInfoSocialList>
        </FooterTopInfo>
        <FooterTopContactList>
          <FooterTopContactTitle>연락처</FooterTopContactTitle>
          <FooterTopContactWrap>
            <FooterTopContactEmail>
              support@dream-in.co.kr
            </FooterTopContactEmail>
            <FooterTopContactCall>1588-1234</FooterTopContactCall>
            <FooterTopContactAddr>
              대구광역시 중구 중앙로 그린컴터
            </FooterTopContactAddr>
          </FooterTopContactWrap>
        </FooterTopContactList>
      </FooterTop>
      <FooterBottomWrap>
        <FooterBottomLegal>
          <FooterBottomPrivacy>개인정보처리방침</FooterBottomPrivacy>
          <FooterBottomTerms>서비스 이용약관</FooterBottomTerms>
        </FooterBottomLegal>
        <FooterBottomCompany>
          (주)드림인 | 사업자등록번호: 123-45-67890 | 대표: 박송문
        </FooterBottomCompany>
        <FooterBottomNote>
          2024 Dream-In Co. Ltd. All rights reserved. Made with 💖 in Daegu,
          Korea
        </FooterBottomNote>
      </FooterBottomWrap>
    </FooterWrap>
  );
}

export default Footer;
