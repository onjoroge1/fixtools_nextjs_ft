import React, { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HtmlLinkGen() {
  const [position, setPosition] = useState('https://www.bbc.com/');
  const [description, setDescription] = useState('Enter Url');
  const [rel, setRel] = useState('defualt');
  const [target, setTarget] = useState('defualt');

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
  tag += ` <a href='${position}' rel='${rel}' target='${target}' >${description}</a>`;

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
            <h1>HTML Link Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate HTML Link with our generator tool. Preview the result and
              copy the generated code to your website.
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
            <label>Text</label>

            <input
              placeholder="Click here"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="screen-editor-color">
            <label>Target</label>

            <select onChange={(e) => setTarget(e.target.value)}>
              <option value={'_blank '}>blank </option>
              <option value={'_parent '}>parent </option>
              <option value={'_self '}>self </option>
              <option value={'_top '}>top </option>
              <option value={'wavy '}>wavy </option>
            </select>
          </div>
          <div className="screen-editor-color">
            <label>Rel</label>
            <select onChange={(e) => setRel(e.target.value)}>
              <option value={'alternate '}>alternate </option>
              <option value={'author '}>author </option>
              <option value={'bookmark '}>bookmark </option>
              <option value={'external '}>external </option>
              <option value={'help '}>help </option>
              <option value={'license '}>license </option>
              <option value={'next '}>next </option>
              <option value={'nofollow '}>nofollow </option>
              <option value={'noreferrer '}>noreferrer </option>
              <option value={'noopener '}>noopener </option>
              <option value={'prev '}>prev </option>
              <option value={'search '}>search </option>
              <option value={'tag '}>tag </option>
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
              <div style={{ width: '100%' }}>
                <a href={position} rel={rel} target={target}>
                  {description}
                </a>
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
