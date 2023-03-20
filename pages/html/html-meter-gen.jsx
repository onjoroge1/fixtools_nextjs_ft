import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function Meter() {
  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [optimum, setOptimum] = useState(0);
  const [value, setValue] = useState(40);

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

  let tag = '';
  tag += `<meter low="${low}" high="${high}" min="${min}" max="${max}" optimum="${optimum}" value="${value}">40/100</meter>`;

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
            <h1>HTML Meter Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Meter with our Html generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Min</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Max</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Low</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setLow(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>High</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setHigh(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Optimum</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setOptimum(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Value</label>

            <input
              type={'number'}
              placeholder='0'
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <div className='screen-preview'>
          <h1>Preview</h1>
          <div className='screen-preview-box'>
            <div
              className='screen-preview-box-sample'
              style={{ overflow: 'hidden' }}
            >
              <div>
                <meter
                  low={low}
                  high={high}
                  min={min}
                  max={max}
                  optimum={optimum}
                  value={value}
                >
                  40/100
                </meter>
              </div>
            </div>
          </div>
          <h1>Code</h1>
          <div className='screen-preview-code'>
            <code className='element-code'> {tag} </code>
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

      <Footer />
    </>
  );
}
