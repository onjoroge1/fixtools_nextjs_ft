import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlimageGen() {
  const [position, setPosition] = useState('./images/beach.png');
  const [description, setDescription] = useState('Enter Url');
  const [width, setWidth] = useState('100');
  const [height, setHeight] = useState('100');

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //

  useEffect(() => {
    document.title = 'HTML Image Generator';
  }, []);

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
  tag += `<img src="${position}" alt="${description}" style='width':${width}px,'height':${height} px />`;

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
            <h1>HTML Image Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Image with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className='screen'>
        <div className='screen-editor'>
          <h1>Options</h1>
          <div className='screen-editor-color'>
            <label>Source</label>
            <input
              placeholder='http://'
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Description</label>
            <input
              placeholder='User image'
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Width</label>
            <input
              placeholder='20px'
              type={'number'}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Height</label>
            <input
              placeholder='30px'
              type={'number'}
              onChange={(e) => setHeight(e.target.value)}
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
              <div style={{ width: '100%' }}>
                <img
                  src={position}
                  alt={description}
                  style={{ width: `${width}px`, height: `${height}px` }}
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
