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
  color: #25254d;
  margin: 0;
  img {
  }
`;
const FooterTopInfoDetail = styled.h3`
  color: #493d78;
  margin: 0;
`;
const FooterTopInfoSocialList = styled.ul`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  margin: 0;
`;
const FooterTopInfoSocialItem = styled.li`
  border: 1px solid #acacac;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(252, 243, 251, 0.3);
  img {
    width: 23px;
    height: 23px;
    color: #493d78;
  }
`;
const FooterTopContactList = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterTopContactTitle = styled.h2`
  color: #493d78;
  margin: 0;
`;
const FooterTopContactWrap = styled.address`
  color: #493d78;
`;
const FooterTopContactEmail = styled.a`
  margin: 0;
`;
const FooterTopContactTel = styled.a`
  margin: 0;
`;
const FooterTopContactAddr = styled.p`
  margin: 0;
`;
const FooterBottomWrap = styled.div`
  color: #493d78;
`;
const FooterBottomLegal = styled.div``;
const FooterBottomPrivacy = styled.p`
  margin: 0;
`;
const FooterBottomTerms = styled.p`
  margin: 0;
`;
const FooterBottomCompany = styled.p`
  margin: 0;
`;
const FooterBottomNote = styled.p`
  margin: 0;
`;

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
            <FooterTopInfoSocialItem>
              <img src="/images/insta.png" alt="인스타" />
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <img src="/images/twitter.png" alt="X" />
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <img src="/images/facebook.png" alt="페이스북" />
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <img src="/images/youtube.png" alt="유튜브" />
            </FooterTopInfoSocialItem>
          </FooterTopInfoSocialList>
        </FooterTopInfo>
        <FooterTopContactList>
          <FooterTopContactTitle>연락처</FooterTopContactTitle>
          <FooterTopContactWrap>
            <FooterTopContactEmail>
              support@dream-in.co.kr
            </FooterTopContactEmail>
            <FooterTopContactTel>1588-1234</FooterTopContactTel>
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
