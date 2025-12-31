import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlImageInput() {
  const [position, setPosition] = useState('./images/beach.png');
  const [description, setDescription] = useState('Enter Url');
  const [width, setWidth] = useState('100');
  const [height, setHeight] = useState('100');
  const [required, setrequired] = useState('');

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
  tag += `<input type="image" src="${position}" alt="${description} " height="${height}" width="${width}" ${required} />`;

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
            <h1>HTML Image Input Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate HTML Image Input with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>
          <div className="screen-editor-color">
            <label>Source</label>
            <input
              placeholder="http://"
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="screen-editor-color">
            <label>Alt text</label>

            <input
              placeholder="Click Here"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="screen-editor-color">
            <label>Width (px)</label>
            <input
              placeholder="20px"
              type={'number'}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div className="screen-editor-color">
            <label>Height (px)</label>
            <input
              placeholder="30px"
              type={'number'}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div
            className="screen-editor-color checkbox"
            style={{ flexDirection: 'row' }}
          >
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
        <div className="screen-preview">
          <h1>Preview</h1>
          <div className="screen-preview-box">
            <div
              className="screen-preview-box-sample"
              style={{ overflow: 'hidden' }}
            >
              <div style={{ width: '100%' }}>
                <input
                  type="image"
                  src={position}
                  aria-labelledby=""
                  alt=""
                  height={height}
                  width={width}
                  required={required}
                />
              </div>
            </div>
          </div>
          <h1>Code</h1>
          <div className="screen-preview-code">
            <code className="element-code"> {tag} </code>
            <i
              style={{ cursor: 'pointer' }}
              onClick={copyText}
              className="fa-regular fa-clone"
            ></i>
          </div>
        </div>
      </div>
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

      <Footer />
    </>
  );
}
