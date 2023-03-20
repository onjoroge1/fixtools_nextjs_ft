import React from 'react';

import StyledContainer from '../StyledContainer';
import Link from 'next/link';

import {
  StyledFooter,
  FooterTopSection,
  FooterLinksContainer,
  FlexContainer,
  FooterMiddleSection,
  FooterBottomSection,
} from './styled';

export default function Footer() {
  return (
    <StyledFooter>
      <FooterTopSection>
        <StyledContainer>
          <FlexContainer>
            <div className='logo-container'>
              <div className='logo'>
                <img
                  src='/fixtools-logos/fixtools-logos_black.svg'
                  alt={`fixtools-logo`}
                />
              </div>
              <h2 className='logo-line'>We make Tools easy.</h2>
            </div>
            <FooterLinksContainer>
              <h2>Popular HTML Tools</h2>
              <h3>
                <Link href='/html/html-minify'>Html minify</Link>
              </h3>

              <h3>
                <Link href='/html/html-formatter'>HTML code formatter</Link>
              </h3>
              <h3>
                <Link href='/html/html-image-gen'>
                  Html image code generator
                </Link>
              </h3>
              <h3>
                <Link href='/html/html-ifram-gen'>
                  Html iframe code generator
                </Link>
              </h3>
              <h3>
                <Link href='/html/html-link-gen'>Html link code generator</Link>
              </h3>
              <h3>
                <Link href='/html/html-button-gen'>
                  Html button code generator
                </Link>
              </h3>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <h2>Popular CSS Tools</h2>
              <h3>
                <Link href='/html/html-minify'>Html minify</Link>
              </h3>
              <h3>
                <Link href='/html/html-formatter'>HTML code formatter</Link>
              </h3>
              <h3>
                <Link href='/html/html-image-gen'>
                  Html image code generator
                </Link>
              </h3>
              <h3>
                <Link href='/html/html-ifram-gen'>
                  Html iframe code generator
                </Link>
              </h3>
              <h3>
                <Link href='/html/html-link-gen'>Html link code generator</Link>
              </h3>
              <h3>
                <Link href='/html/html-button-gen'>
                  Html button code generator
                </Link>
              </h3>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <h2>Popular AI Tools</h2>
              <h3>
                <Link href='/aitools/qa'>Chat with AI online</Link>
              </h3>
              <h3>
                <Link href='/aitools/studyNotes'>
                  Generate study notes AI tool
                </Link>
              </h3>
              <h3>
                <Link href='/aitools/essayOutline'>
                  AI Essay Outline generator
                </Link>
              </h3>
              <h3>
                <Link href='/aitools/adFromProductDescription'>
                  Generate Ad From Product Description
                </Link>
              </h3>
            </FooterLinksContainer>
          </FlexContainer>
        </StyledContainer>
      </FooterTopSection>
      <FooterMiddleSection>
        <StyledContainer>
          <FlexContainer>
            <div className='social-media-icons-container'>
              <img
                src='/linkedinIcon.svg'
                alt='linkedin'
              />
              <img
                src='/facebookIcon.svg'
                alt='facebook'
              />
              <img
                src='/youtubeIcon.svg'
                alt='youtube'
              />
              <img
                src='/twitterIcon.svg'
                alt='twitter'
              />
              <img
                src='/spotifyIcon.svg'
                alt='spotify'
              />
            </div>
            <div className='platform-container'>
              <FlexContainer>
                <div className='platform'>
                  {' '}
                  <img
                    src='/windowsIcon.svg'
                    alt='windows'
                  />
                </div>
                <div className='platform'>
                  {' '}
                  <img
                    src='/playStoreIcon.svg'
                    alt='play store'
                  />
                </div>
                <div className='platform'>
                  {' '}
                  <img
                    src='/appleStoreIcon.svg'
                    alt='apple store'
                  />
                </div>
              </FlexContainer>
            </div>
          </FlexContainer>
        </StyledContainer>
      </FooterMiddleSection>
      <FooterBottomSection>
        <StyledContainer>
          <div className='copy-rights-section'>
            <p>
              © 2022 Smallpdf AG — Made with{' '}
              <span className='heart-icon'>
                <img
                  src='/heart.svg'
                  alt=''
                />
              </span>{' '}
              for the people of the internet.
            </p>
          </div>
        </StyledContainer>
      </FooterBottomSection>
    </StyledFooter>
  );
}
