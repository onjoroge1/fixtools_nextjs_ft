import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';

export default function VisibiltyGen() {
  const [display, setDisplay] = useState('visible');

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
            <h1>CSS Visibility Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate CSS Visibility with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Horizontal Length</label>
            <select onChange={(e) => setDisplay(e.target.value)}>
              <option value={'visible'}>visible</option>
              <option value={'hidden'}>hidden</option>
            </select>
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
                  visibility: `${display}`,
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
            <code className='element-code'>visibility: {display};</code>
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
