import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlTextareaInput() {
  const [value, setValue] = useState('Your message here..');
  const [spellchek, setspellchek] = useState('');
  const [required, setrequired] = useState('');
  const [noCols, setnoCols] = useState(20);
  const [noRows, setnoRows] = useState(10);
  const [minLength, setminLength] = useState(10);
  const [maxLength, setmaxLength] = useState(500);

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
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

  let tag = '';
  tag += ` <textarea  placeholder="${value}" cols="${noCols}" rows="${noRows}" minlength="${minLength}" maxlength="${maxLength}" ${required} ${spellchek}></textarea>`;

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
            <h1>HTML Text Area Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Text Area with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Placeholder</label>
            <input
              type={'text'}
              placeholder={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Number of columns</label>
            <input
              type={'number'}
              placeholder={'Enter number'}
              onChange={(e) => setnoCols(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Number of rows</label>
            <input
              type={'number'}
              placeholder={'Enter number'}
              onChange={(e) => setnoRows(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Minimum length</label>
            <input
              type={'number'}
              placeholder={'Enter number'}
              onChange={(e) => setminLength(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Maximum length</label>
            <input
              type={'number'}
              placeholder={'Enter number'}
              onChange={(e) => setmaxLength(e.target.value)}
            />
          </div>
          <div
            className='screen-editor-color'
            style={{ flexDirection: 'column' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) =>
                  setspellchek(e.target.checked ? 'spellcheck' : '')
                }
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Spellcheck
            </label>
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                type={'checkbox'}
                onChange={(e) =>
                  setrequired(e.target.checked ? 'required' : '')
                }
                style={{ height: '20px', width: '25px' }}
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
                <textarea
                  placeholder={value}
                  cols={noCols}
                  rows={noRows}
                  minlength={minLength}
                  maxlength={maxLength}
                  required={required}
                ></textarea>
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
