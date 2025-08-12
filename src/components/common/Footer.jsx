import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";

const FooterWrap = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0;
  padding-top: 10px;
  background-color: rgba(236, 195, 230, 0.3);
  border-top: 1px solid #c2c2c2;
`;
const FooterTopWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  margin: 0 0 15px 50px;
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
  padding-left: 15%;
  margin: 0;
  height: 50px;
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
  font-size: 18px;
  color: #25254d;
  margin: 0;
`;
const FooterTopInfoDetail = styled.h3`
  font-size: 13px;
  color: #493d78;
  margin: 0;
  line-height: 20px;
`;
const FooterTopInfoSocialList = styled.ul`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 25px;
  padding-top: 10px;
  margin: 0;
`;
const FooterTopInfoSocialItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 33px;
  height: 33px;
  border: none;
  border-radius: 50%;
  background-color: none;
  cursor: pointer;
  a {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 70%;
    height: 70%;
    color: #493d78;
  }
`;
const FooterTopContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0;
  padding-right: 38%;
  padding-left: 10px;
`;
const FooterTopContactTitle = styled.h2`
  font-size: 15px;
  color: #493d78;
  margin: 20px 0 0 0;
`;
const FooterTopContactWrap = styled.address`
  color: #493d78;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const FooterTopContactEmail = styled.a`
  font-size: 12px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterTopContactTel = styled.a`
  font-size: 12px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterTopContactAddr = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #493d78;
  margin: 0;
`;
const FooterBottomWrap = styled.div`
  color: #493d78;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  padding: 15px 0 15px 50px;
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
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
const FooterBottomTerms = styled.a`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  padding-right: 10px;
  cursor: pointer;
`;
const FooterBottomCompany = styled.p`
  margin: 0;
  font-size: 13px;
  padding: 0 50px 0 10px;
`;
const FooterBottomCopy = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-size: 12px;
  color: #8f8f8f;
  padding: 10px;
  border-top: 1px solid #a8a8a8;
  width: 50%;
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
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/insta.png" alt="인스타" />
              </a>
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/twitter.png" alt="X" />
              </a>
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <a
                href="https://www.facebook.com/?locale=ko_KR"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/facebook.png" alt="페이스북" />
              </a>
            </FooterTopInfoSocialItem>
            <FooterTopInfoSocialItem>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/youtube.png" alt="유튜브" />
              </a>
            </FooterTopInfoSocialItem>
          </FooterTopInfoSocialList>
        </FooterTopInfo>
        <FooterTopContactList>
          <FooterTopContactTitle>고객센터 정보</FooterTopContactTitle>
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
