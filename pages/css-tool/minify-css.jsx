import React from 'react';
import { useState } from 'react';

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
// import { BoxOutputContainer } from '../styled';
import Footer from '@/components/Footer/Footer';
import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '../../../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';

export default function MinifyCSS() {
  const [formdata, setformdata] = useState('');
  const [result, setResult] = useState();
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [place, setplace] = useState('Type (or paste) here...');
  const [disableBtn, setDisableBtn] = useState(true);

  //
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, CssTool);
  console.log({ title });
  //

  const handleChange = (e) => {
    setformdata(e.target.value);
    setDisableBtn(false);
  };

  const handleSubmit = async (e) => {
    setbuttonLoading(true);
    setDisableBtn(true);
    e.preventDefault();
    const data = {
      bodyData: formdata,
    };

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/cssvalidator`, data)
      .then(async (response) => {
        if (response.data.valid === true) {
          try {
            await axios
              .post(`${process.env.NEXT_PUBLIC_API_URL}/minficss`, data)
              .then((response) => {
                setResult(response.data);
              });

            // setResult(rep2)
          } catch (err) {}

          // var rep = formdata.split(' ').join('');
          // var rep2 = rep.split(/\r?\n|\r/g).join('');

          // setResult(rep2)
          setbuttonLoading(false);
          toast.success('Success!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        } else {
          setbuttonLoading(false);
          toast.error('Please Write valid Css!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      });
  };
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
      <div
        className='detail-hero'
        style={{ minHeight: '320px', maxHeight: '320px' }}
      >
        <HeaderNav />
        <div className='detail-hero-content'>
          <div className='detail-hero-content-heading'>
            <h1>CSS Minify Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Generate CSS Minify with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div
        className='tools-for-better-thinking'
        style={{ padding: '5rem 0px 5rem 0px' }}
      >
        <div className='container d-flex align-items-center justify-content-center row col-md-8'>
          <div className='col-md-12 col-lg-12 offset-lg-6'>
            <label className='my-1 mr-2'>
              <h2>Input CSS</h2>
            </label>

            <form
              className=''
              role='form'
              onSubmit={handleSubmit}
            >
              <div className='form-group'>
                <textarea
                  required
                  className='form-control'
                  placeholder={place}
                  rows='15'
                  id='input-comment'
                  onChange={handleChange}
                  style={{ fontSize: '1.5rem' }}
                ></textarea>
              </div>
              <p></p>
              <div className='d-grid gap-3 col-md-2'>
                <button
                  style={{ borderRadius: '3px' }}
                  className={`${disableBtn ? 'btn-disable' : ''}`}
                  disabled={`${disableBtn ? 'true' : ''}`}
                  type='submit'
                >
                  {buttonLoading ? (
                    <div
                      className='spinner-border text-dark'
                      role='status'
                    >
                      {/* <span className='sr-only'>Loading...</span> */}
                    </div>
                  ) : (
                    'Minify CSS'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className='col-md-12 col-lg-12 offset-lg-6'>
            <i
              style={{ cursor: 'pointer', float: 'right', padding: '10px' }}
              onClick={copyText}
              className='fa-regular fa-clone'
            ></i>
            <div className='form-group'>
              <textarea
                className='form-control element-code'
                rows='15'
                id='input-comment'
                value={result}
                style={{ fontSize: '2rem' }}
                disabled
                placeholder='Output'
              ></textarea>
            </div>
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
