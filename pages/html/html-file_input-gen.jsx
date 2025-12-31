import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlFileGen() {
  const [value, setValue] = useState('*');
  const [multiple, setmultiple] = useState('');
  const [required, setrequired] = useState('');

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, HtmlTool);
  console.log({ title });
  //  ;

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
  tag += `  <input type="file" accept="${value}" ${required} ${multiple} /> `;

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
            <h1>HTML File Input Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate HTML File Input with our generator tool. Preview the
              result and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>

          <div className="screen-editor-color">
            <label>Acceptable file types</label>
            <input
              type={'email'}
              placeholder={'Image/*, .pdf'}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div
            className="screen-editor-color"
            style={{ flexDirection: 'column' }}
          >
            <label style={{ 'align-items': 'flex-end' }}>
              <input
                onChange={(e) =>
                  setmultiple(e.target.checked ? 'multiple' : '')
                }
                type={'checkbox'}
                style={{ height: '20px', width: '25px' }}
              />
              Multiple
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
        <div className="screen-preview">
          <h1>Preview</h1>
          <div className="screen-preview-box">
            <div
              className="screen-preview-box-sample"
              style={{ overflow: 'hidden' }}
            >
              <div>
                <input
                  type={'file'}
                  accept={value}
                  required={required}
                  multiple={multiple}
                  style={{ width: '250px' }}
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
