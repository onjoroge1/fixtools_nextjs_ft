import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function Cursor() {
  const [cursor, setCursor] = useState('');

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
            <h1>CSS Cursor Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate CSS Cursor with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>

          <div className="screen-editor-color">
            <label>Cursor</label>
            <select onChange={(e) => setCursor(e.target.value)}>
              <option value={'alias '}>alias </option>
              <option value={'all-scroll '}>all-scroll </option>
              <option value={'cell '}>cell </option>
              <option value={'context-menu '}>context-menu </option>
              <option value={'col-resize '}>col-resize </option>
              <option value={'copy '}>copy </option>
              <option value={'crosshair '}>crosshair </option>
              <option value={'e-resize '}>e-resize </option>
              <option value={'ew-resize '}>ew-resize </option>
              <option value={'grab '}>grab </option>
              <option value={'grabbing '}>grabbing </option>
              <option value={'help '}>help </option>
              <option value={'move '}>move </option>
              <option value={'n-resize '}>n-resize </option>
              <option value={'ne-resize '}>ne-resize </option>
              <option value={'nesw-resize '}>nesw-resize </option>
              <option value={'ns-resize '}>ns-resize </option>
              <option value={'nw-resize '}>nw-resize </option>
              <option value={'nwse-resize '}>nwse-resize </option>
              <option value={'no-drop '}>no-drop </option>
              <option value={'none '}>none </option>
              <option value={'not-allowed '}>not-allowed </option>
              <option value={'pointer '}>pointer </option>
              <option value={'progress '}>progress </option>
              <option value={'row-resize '}>row-resize </option>
              <option value={'s-resize '}>s-resize </option>
              <option value={'se-resize '}>se-resize </option>
              <option value={'sw-resize '}>sw-resize </option>
              <option value={'text '}>text </option>
              <option value={'vertical-text '}>vertical-text </option>
              <option value={'w-resize '}>w-resize </option>
              <option value={'wait '}>wait </option>
              <option value={'zoom-in '}>zoom-in </option>
              <option value={'zoom-out '}>zoom-out </option>
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
                  cursor: `${cursor}`,
                  width: '350px',
                  height: '150px',
                  background: 'skyblue',
                }}
              ></div>
            </div>
          </div>
          <h1>Code</h1>
          <div className="screen-preview-code">
            <code className="element-code"> cursor :{cursor};</code>
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
