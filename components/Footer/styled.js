import styled from 'styled-components';

import {
  footerFonts,
  footerLinksMarginBottom,
} from '../GlobalsStyles/GlobalsStyles';

const StyledFooter = styled.footer`
  padding-top: 32px;
  /* padding-left: 8px; */
  /* padding-right: 8px; */
  border-top: 1px solid #e8e8e8;
`;

const FooterTopSection = styled.section`
  padding-left: 8px;
  padding-right: 8px;

  padding-bottom: 60px;
  border-bottom: 1px solid #e8e8e8;
  .logo-container {
    /* background-color: red; */
    .logo {
      max-width: 116px;
      height: 40px;
      margin-bottom: ${footerLinksMarginBottom};
      img {
        width: 100%;
        height: 100%;
        /* background-color: orange; */
      }
    }
    .logo-line {
      color: #1a1a1a;
      font-family: ${footerFonts};
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
    }
  }
`;
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 810px) {
    flex-direction: column;
  }
`;
const FooterLinksContainer = styled.div`
  h2 {
    margin-bottom: ${footerLinksMarginBottom};
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #1a1a1a;
    font-family: ${footerFonts};
  }
  h3 {
    /* margin-bottom: ${footerLinksMarginBottom}; */
    /* background-color: red; */
    padding-bottom: 4px;
    border-bottom: 1px solid rgb(206, 212, 218);
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #757575;
    font-family: ${footerFonts};
  }
`;
const FooterMiddleSection = styled.div`
  padding: 30px 8px;

  .social-media-icons-container {
    img {
      width: 23px;
      height: 23px;
      margin-right: 20px;
    }
  }
  .platform-container {
    .platform {
      width: 121px;
      height: 40px;
      background-color: black;
      padding: 8px 20px;
      margin-right: 20px;
      border-radius: 4px;
      @media screen and (max-width: 810px) {
        margin-top: 20px;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

const FooterBottomSection = styled.div`
  padding-left: 8px;
  padding-right: 8px;
  background-color: rgb(244, 244, 244);

  padding-top: 20px;
  padding-bottom: 20px;

  p {
    font-family: ${footerFonts};
    color: #1a1a1a;
    font-weight: 400;
    line-height: 24px;
    .heart-icon {
      width: 15px;
      height: 13px;
      img {
        width: 15px;
        height: 13px;
      }
    }
  }
`;
export {
  StyledFooter,
  FooterTopSection,
  FlexContainer,
  FooterLinksContainer,
  FooterMiddleSection,
  FooterBottomSection,
};
