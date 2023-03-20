import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';

export default function TransformGen() {
  const [scale, setScale] = useState('1');
  const [rotate, setRotate] = useState('0');
  const [translateX, setTranslateX] = useState('0');
  const [translateY, setTranslateY] = useState('0');
  const [skewX, setSkewX] = useState('0');
  const [skewY, setskewY] = useState('0');

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);
  console.log({ title });
  //

  const copyText = () => {
    const selct = document.querySelector('.element-code').textContent;
    navigator.clipboard.writeText(selct);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  return (
    <>
      <CustomHead
        title={title}
        ogUrl={process.env.NEXT_PUBLIC_HOST + route.asPath}
        metaDescription={desc}
        ogImageUrl='/programming_tools.jpg'
        ogImageAlt='Fix tools og image'
      />
      <div className='detail-hero'>
        <HeaderNav />
        <div className='detail-hero-content'>
          <div className='detail-hero-content-heading'>
            <h1>CSS Transform Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate CSS Transform with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Scale</label>
            <input
              id='horizontal'
              step={'0.1'}
              type='range'
              min='0.1'
              max='2'
              onChange={(e) => setScale(e.target.value)}
              value={scale}
            />
            <code>{scale}</code>
          </div>
          <div className='screen-editor-color'>
            <label>Rotate</label>
            <input
              id='horizontal'
              type='range'
              min='0'
              max='360'
              onChange={(e) => setRotate(e.target.value)}
              value={rotate}
            />
            <code>{rotate}</code>
          </div>
          <div className='screen-editor-color'>
            <label>Translate X</label>
            <input
              id='horizontal'
              type='range'
              min='-50'
              max='50'
              onChange={(e) => setTranslateX(e.target.value)}
              value={translateX}
            />
            <code>{translateX}</code>
          </div>
          <div className='screen-editor-color'>
            <label>Translate Y</label>
            <input
              id='horizontal'
              type='range'
              min='-50'
              max='50'
              onChange={(e) => setTranslateY(e.target.value)}
              value={translateY}
            />
            <code>{translateY}</code>
          </div>
          <div className='screen-editor-color'>
            <label>Skew X</label>
            <input
              id='horizontal'
              type='range'
              min='-90'
              max='90'
              onChange={(e) => setSkewX(e.target.value)}
              value={skewX}
            />
            <code>{skewX}</code>
          </div>
          <div className='screen-editor-color'>
            <label>Skew Y</label>
            <input
              id='horizontal'
              type='range'
              min='-90'
              max='90'
              onChange={(e) => setskewY(e.target.value)}
              value={skewY}
            />
            <code>{skewY}</code>
          </div>
        </div>
        <div className='screen-preview'>
          <h1>Preview</h1>
          <div className='screen-preview-box'>
            <div
              className='screen-preview-box-sample'
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg) translate(${translateX}px, ${translateY}px) skew(${skewX}deg, ${skewY}deg)`,
                  width: '150px',
                  height: '150px',
                  background: 'skyblue',
                }}
              >
                This block is visible
              </div>
            </div>
          </div>
          <h1>Code</h1>
          <div className='screen-preview-code'>
            <code className='element-code'>
              transform: scale({scale}) rotate({rotate}deg) translate(
              {translateX}px, {translateY}px) skew({skewX}deg, {skewY}deg);
            </code>
            <i
              style={{ cursor: 'pointer' }}
              onClick={copyText}
              className='fa-regular fa-clone'
            ></i>
          </div>
        </div>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      {/* <Footer /> */}
    </>
  );
}
