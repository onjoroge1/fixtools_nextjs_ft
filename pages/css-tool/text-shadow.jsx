import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';

export default function TextShadow() {
  const [color1, setcolor1] = useState('#48aadb');
  const [horizontalRange, setHorizontalRange] = useState('5');
  const [vertical, setVertical] = useState('5');
  const [blur, setBlur] = useState('5');

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
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fix tools og image"
      />
      <div className="detail-hero">
        <HeaderNav />
        <div className="detail-hero-content">
          <div className="detail-hero-content-heading">
            <h1>CSS Text Shadow Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate Text Shadow with our generator tool. Preview the result
              and copy the generated code to your website.{' '}
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>
          <div className="screen-editor-color">
            <label>Shadow Color </label>
            <code>{color1}</code>
            <input
              type={'color'}
              onChange={(e) => setcolor1(e.target.value)}
              value={color1}
            />
          </div>
          <div className="screen-editor-color">
            <label>Horizontal Length</label>
            <input
              id="horizontal"
              type="range"
              min="-40"
              max="40"
              onChange={(e) => setHorizontalRange(e.target.value)}
              value={horizontalRange}
            />
            <code>{horizontalRange}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Vertical Length</label>
            <input
              id="horizontal"
              type="range"
              min="-40"
              max="40"
              onChange={(e) => setVertical(e.target.value)}
              value={vertical}
            />
            <code>{vertical}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Blur Radius </label>
            <input
              id="horizontal"
              type="range"
              min="0"
              max="20"
              onChange={(e) => setBlur(e.target.value)}
              value={blur}
            />
            <code>{blur}px</code>
          </div>
        </div>
        <div className="screen-preview">
          <h1>Preview</h1>
          <div className="screen-preview-box">
            <div className="screen-preview-box-sample">
              <h1
                style={{
                  textShadow: `${horizontalRange}px ${vertical}px ${blur}px ${color1}`,
                }}
              >
                Text Shadow
              </h1>
            </div>
          </div>
          <h1>Code</h1>
          <div className="screen-preview-code">
            <code className="element-code">
              text-shadow: {horizontalRange}px {vertical}px {blur}px {color1};
            </code>
            <i
              style={{ cursor: 'pointer' }}
              onClick={copyText}
              className="fa-regular fa-clone"
            ></i>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
