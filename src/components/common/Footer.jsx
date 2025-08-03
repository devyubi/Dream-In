import styled from "@emotion/styled";

const FooterWrap = styled.div`
  position: relative;
`;
const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FooterTopInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterTopInfoTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
  }
`;
const FooterTopInfoDetail = styled.h2``;
const FooterTopInfoSocialList = styled.ul``;
const FooterTopInfoSocialLink = styled.li``;
const FooterTopContactList = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterTopContactTitle = styled.h1``;
const FooterTopContactWrap = styled.address``;
const FooterTopContactEmail = styled.a``;
const FooterTopContactCall = styled.a``;
const FooterTopContactAddr = styled.p``;
const FooterBottomWrap = styled.div``;

function Footer() {
  return (
    <FooterWrap>
      <FooterTop>
        <FooterTopInfo>
          <FooterTopInfoTitle></FooterTopInfoTitle>
          <FooterTopInfoDetail></FooterTopInfoDetail>
          <FooterTopInfoSocialList>
            <FooterTopInfoSocialLink></FooterTopInfoSocialLink>
            <FooterTopInfoSocialLink></FooterTopInfoSocialLink>
            <FooterTopInfoSocialLink></FooterTopInfoSocialLink>
            <FooterTopInfoSocialLink></FooterTopInfoSocialLink>
          </FooterTopInfoSocialList>
        </FooterTopInfo>
        <FooterTopContactList>
          <FooterTopContactTitle></FooterTopContactTitle>
          <FooterTopContactWrap>
            <FooterTopContactEmail></FooterTopContactEmail>
            <FooterTopContactCall></FooterTopContactCall>
            <FooterTopContactAddr></FooterTopContactAddr>
          </FooterTopContactWrap>
        </FooterTopContactList>
      </FooterTop>
      <FooterBottomWrap></FooterBottomWrap>
    </FooterWrap>
  );
}

export default Footer;
