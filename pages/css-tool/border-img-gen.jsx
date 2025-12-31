import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function BorderImgGen() {
  const [imageUrl, setImageUrl] = useState(
    'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131603.jpg'
  );
  const [outset, setOutset] = useState('5');
  const [style, setstyle] = useState('');
  const [slice, setSlice] = useState('5');
  const [width, setwidth] = useState('5');

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
            <h1>CSS Border Image Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate CSS Border Image with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>
          <div className="screen-editor-color">
            <label>Width</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => setwidth(e.target.value)}
              value={width}
            />
            <code>{width}px</code>
          </div>

          <div className="screen-editor-color">
            <label>Image URL</label>
            <input
              type={'text'}
              placeholder="Enter image address"
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div className="screen-editor-color">
            <label>Outset</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="50"
              onChange={(e) => setOutset(e.target.value)}
              value={outset}
            />
            <code>{outset}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Slice</label>
            <input
              id="horizontal"
              type="range"
              min="1"
              max="100"
              onChange={(e) => setSlice(e.target.value)}
              value={slice}
            />
            <code>{slice}px</code>
          </div>
          <div className="screen-editor-color">
            <label>Style</label>
            <select onChange={(e) => setstyle(e.target.value)}>
              <option value={'stretch'}>stretch </option>
              <option value={'repeat'}>repeat </option>
              <option value={'round'}>round </option>
              <option value={'space'}>space </option>
              <option value={'groove'}>groove</option>
              <option value={'ridge'}>ridge</option>
              <option value={'inset'}>inset</option>
              <option value={'outset'}>outset</option>
            </select>
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
                  border: '1px solid #000000',
                  'border-image': `url(${imageUrl}) ${slice}/${width}px/${outset}px ${style}`,
                  width: '150px',
                  height: '150px',
                  background: 'skyblue',
                }}
              ></div>
            </div>
          </div>
          <h1>Code</h1>
          <div className="screen-preview-code">
            <code className="element-code">
              border-image: url({imageUrl}) {slice}/{width}px/{outset}px {style}
              ;
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
