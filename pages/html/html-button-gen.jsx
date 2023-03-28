import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlButton() {
  const [type, settype] = useState('button');
  const [text, settext] = useState('click here!');
  const [focus, setFocus] = useState('');
  const [disable, setDisable] = useState('');

  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });

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
  tag += ` <button type="${type}" ${focus} ${disable} >${text}</button>`;

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
            <h1>HTML Button Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Button with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>
          <div className='screen-editor-color'>
            <label>Type</label>

            <select onChange={(e) => settype(e.target.value)}>
              <option value={'reset '}>reset </option>
              <option value={'submit '}>submit </option>
              <option value={'button '}>button </option>
            </select>
          </div>

          <div className='screen-editor-color'>
            <label>Text</label>

            <input
              placeholder='Click here'
              onChange={(e) => settext(e.target.value)}
            />
          </div>

          <div
            className='screen-editor-color'
            style={{ flexDirection: 'column' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) => setFocus(e.target.checked ? 'autofocus' : '')}
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Autofocus
            </label>
            <label style={{ alignItems: 'flex-end' }}>
              <input
                type={'checkbox'}
                onChange={(e) => setDisable(e.target.checked ? 'disabled' : '')}
                style={{ height: '20px', width: '25px' }}
              />
              Disabled
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
              <div style={{ width: '100%' }}>
                <button
                  type={type}
                  autofocus={focus}
                  disabled={disable}
                >
                  {text}
                </button>
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
