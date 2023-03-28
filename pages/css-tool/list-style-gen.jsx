import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';

export default function ListStyleGen() {
  const [type, setType] = useState('');
  const [position, setPosition] = useState('');

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
            <h1>CSS List Style Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate CSS List Style with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>

          <div className='screen-editor-color'>
            <label>Type</label>
            <select onChange={(e) => setType(e.target.value)}>
              <option value={'armenian '}>armenian </option>
              <option value={'circle '}>circle </option>
              <option value={'cjk-ideographic'}>cjk-ideographic </option>
              <option value={'decimal'}>decimal</option>
              <option value={'decimal-leading-zero '}>
                decimal-leading-zero{' '}
              </option>
              <option value={'disc  '}>disc </option>
              <option value={'georgian  '}>georgian </option>
              <option value={'hebrew  '}>hebrew </option>
              <option value={'hiragana  '}>hiragana </option>
              <option value={'hiragana-iroha '}>hiragana-iroha </option>
              <option value={'katakana  '}>katakana </option>
              <option value={'katakana-iroha '}>katakana-iroha </option>
              <option value={'lower-alpha '}>lower-alpha </option>
              <option value={'lower-greek '}>lower-greek </option>
              <option value={'lower-latin '}>lower-latin </option>
              <option value={'lower-roman '}> lower-roman </option>
              <option value={'none  '}>none </option>
              <option value={'square  '}>square </option>
              <option value={'upper-alpha '}>upper-alpha </option>
              <option value={'upper-greek '}>upper-greek </option>
              <option value={'upper-latin '}>upper-latin </option>
              <option value={'upper-roman '}>upper-roman </option>
            </select>
          </div>
          <div className='screen-editor-color'>
            <label>Position</label>
            <select onChange={(e) => setPosition(e.target.value)}>
              <option value={'inside '}>inside </option>
              <option value={'outside '}>outside </option>
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
              <div style={{ width: '150px', height: '150px' }}>
                <ul style={{ 'list-style': `${type} ${position}` }}>
                  <li>List item</li>
                  <li>List item</li>
                  <li>List item</li>
                </ul>
              </div>
            </div>
          </div>
          <h1>Code</h1>
          <div className='screen-preview-code'>
            <code className='element-code'>
              {' '}
              list-style : {type} {position};
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
