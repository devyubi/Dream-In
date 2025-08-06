import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const FooterWrap = styled.div`
  position: relative;
  max-width: 1280px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 20%;
  padding-top: 10px;
  gap: 20px;
  background-color: rgba(236, 195, 230, 0.3);
  border-top: 1px solid #cdcdce;
`;
const FooterTopWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
  padding-left: 10%;
`;
const FooterTopInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`;
const FooterTopDreamIn = styled.div`
  display: flex;
`;
const FooterTopInfoLogo = styled.div`
  overflow: hidden;
  margin: 0;
  height: 70px;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;
const FooterTopInfoTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 25px;
  color: #25254d;
  margin: 0;
`;
const FooterTopInfoDetail = styled.h3`
  font-size: 16px;
  color: #493d78;
  margin: 0;
  line-height: 30px;
`;
const FooterTopInfoSocialList = styled.ul`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 35px;
  padding-top: 20px;
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
  cursor: pointer;
  img {
    width: 23px;
    height: 23px;
    color: #493d78;
  }
`;
const FooterTopContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0;
  padding-right: 25%;
`;
const FooterTopContactTitle = styled.h2`
  font-size: 20px;
  color: #493d78;
  margin: 0;
`;
const FooterTopContactWrap = styled.address`
  color: #493d78;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FooterTopContactEmail = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterTopContactTel = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterTopContactAddr = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterBottomWrap = styled.div`
  color: #493d78;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px 10% 0 10%;
  border-top: 1px solid #a8a8a8;
`;
const FooterBottomLegal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;
const FooterBottomPrivacy = styled.a`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;
const FooterBottomTerms = styled.a`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;
const FooterBottomCompany = styled.p`
  margin: 0;
  font-size: 16px;
`;
const FooterBottomCopy = styled.p`
  margin: 0;
  font-size: 14px;
  color: #8f8f8f;
  padding: 20px 23%;
  border-top: 1px solid #a8a8a8;
`;

function Footer() {
  const navigate = useNavigate();

  const handlePrivacyClick = () => {
    navigate("/privacypolicy");
  };

  const handleTermsOfServiceClick = () => {
    navigate("/termsofservice");
  };

  return (
    <FooterWrap>
      <FooterTopWrap>
        <FooterTopInfo>
          <FooterTopDreamIn>
            <FooterTopInfoLogo>
              <img src="/images/logo.png" alt="Dream-In" />
            </FooterTopInfoLogo>
            <FooterTopInfoTitle>Dream-In</FooterTopInfoTitle>
          </FooterTopDreamIn>
          <FooterTopInfoDetail>
            당신의 꿈을 기록하고 해석하는 특별한 공간입니다.
            <br /> AI 기술과 심리학의 만남으로 더 깊은 자아를 발견해보세요.
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
            <FooterTopContactEmail href="mailto:support@dream-in.co.kr">
              support@dream-in.co.kr
            </FooterTopContactEmail>
            <FooterTopContactTel href="tel:12345678">
              1234-5678
            </FooterTopContactTel>
            <FooterTopContactAddr>
              대구광역시 중구 중앙로 그린컴터
            </FooterTopContactAddr>
          </FooterTopContactWrap>
        </FooterTopContactList>
      </FooterTopWrap>
      <FooterBottomWrap>
        <FooterBottomLegal>
          <FooterBottomPrivacy onClick={handlePrivacyClick}>
            개인정보처리방침
          </FooterBottomPrivacy>
          <FooterBottomTerms onClick={handleTermsOfServiceClick}>
            서비스 이용약관
          </FooterBottomTerms>
        </FooterBottomLegal>
        <FooterBottomCompany>
          (주)드림인 | 사업자등록번호: 123-45-67890 | 대표: 박송문
        </FooterBottomCompany>
      </FooterBottomWrap>
      <FooterBottomCopy>
        2025 Dream-In Co. Ltd. All rights reserved. Made with 💖 in Daegu, Korea
      </FooterBottomCopy>
    </FooterWrap>
  );
}

export default Footer;
