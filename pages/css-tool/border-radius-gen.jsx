import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function BorderRadiusGen() {
  const [top, settop] = useState('0');
  const [left, setleft] = useState('0');
  const [bottom, setbottom] = useState('0');
  const [right, setright] = useState('0');

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
            <h1>CSS Border Radius Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate CSS border radius with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>

          <div className="screen-editor-color">
            <label>Top Left</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => settop(e.target.value)}
              value={top}
            />
            <code>{top}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Top Right</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => setleft(e.target.value)}
              value={left}
            />
            <code>{left}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Bottom Right</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => setbottom(e.target.value)}
              value={bottom}
            />
            <code>{bottom}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Bottom Left</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => setright(e.target.value)}
              value={right}
            />
            <code>{right}px</code>
          </div>
        </div>
        <div className="screen-preview">
          <h1>Preview</h1>
          <div className="screen-preview-box">
            <div
              className="screen-preview-box-sample"
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  border: `5px solid black`,
                  borderRadius: `${top}px ${left}px ${bottom}px ${right}px`,
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
          <div className="screen-preview-code">
            <code className="element-code">
              border-radius: {top}px {left}px {bottom}px {right}px;
            </code>
            <i
              style={{ cursor: 'pointer' }}
              onClick={copyText}
              className="fa-regular fa-clone"
            ></i>
          </div>
        </div>
      </div>

      <Footer />

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
