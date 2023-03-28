import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlAudio() {
  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //

  const [value, setValue] = useState('/media/sound.mp3');
  const [preload, setPreload] = useState('auto');
  const [autoplay, setAutoplay] = useState('');
  const [controls, setControls] = useState('controls');
  const [loop, setLoop] = useState('');
  const [muted, setMuted] = useState('');

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
  tag += ` <audio src="${value}" ${autoplay} ${controls} ${loop} ${muted} preload="${preload}"></audio>`;

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
            <h1>HTML Audio Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate HTML Audio with our generator tool. Preview the result
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
              type={'text'}
              placeholder={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className='screen-editor-color'>
            <label>Preload</label>
            <select onChange={(e) => setPreload(e.target.value)}>
              <option value={'none'}>none </option>
              <option value={'auto'}>auto </option>
              <option value={'metadata'}>metadata </option>
            </select>
          </div>
          <div
            className='screen-editor-color'
            style={{ flexDirection: 'column', gap: '10px', height: 'auto' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) =>
                  setAutoplay(e.target.checked ? 'autoplay' : '')
                }
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Autoplay
            </label>
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) =>
                  setControls(e.target.checked ? 'controls' : '')
                }
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Controls
            </label>
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) => setLoop(e.target.checked ? 'loop' : '')}
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Loop
            </label>
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) => setMuted(e.target.checked ? 'muted' : '')}
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Muted
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
                <audio
                  autoPlay={autoplay}
                  src={value}
                  controls={controls}
                  loop={loop}
                  muted={muted}
                  preload={preload}
                ></audio>
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
      </div>

      <Footer />
    </>
  );
}
