import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlRangeInput() {
  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //

  const [required, setrequired] = useState('');
  const [step, setstep] = useState(1);
  const [mini, setmini] = useState(1);
  const [max, setmax] = useState(100);
  const [value, setvalue] = useState(20);

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
  tag += `   <input type="${'range'}" step="${step}" value="${value}" min="${mini}" max="${max}"  ${required}  />`;

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
            <h1>HTML Range Input Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Range Input with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Value</label>
            <input
              type={'number'}
              placeholder={'Write value 1 , 5 etc'}
              onChange={(e) => setvalue(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Step</label>
            <input
              type={'number'}
              placeholder={'Write steps 1 , 5 etc'}
              onChange={(e) => setstep(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Minimum</label>
            <input
              type={'number'}
              placeholder={'Write steps 0 , 1 etc'}
              onChange={(e) => setmini(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Maximum</label>
            <input
              type={'number'}
              placeholder={'Write steps 10 , 100 etc'}
              onChange={(e) => setmax(e.target.value)}
            />
          </div>

          <div
            className='screen-editor-color checkbox'
            style={{ flexDirection: 'row' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                type={'checkbox'}
                onChange={(e) =>
                  setrequired(e.target.checked ? 'required' : '')
                }
                style={{ height: '25px', width: '25px' }}
              />
              Required
            </label>
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
                <input
                  type={'range'}
                  value={value}
                  step={step}
                  min={mini}
                  max={max}
                  style={{ width: '200px' }}
                />
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
