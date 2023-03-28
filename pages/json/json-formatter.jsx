import React from 'react';
import { useState } from 'react';

import HeaderNav from '@/components/HeaderNav';

import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import JsonTools from '../../dbTools/JsonTool';
import { GetCurrentPageContent } from '../utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import Footer from '@/components/Footer/Footer';

export default function JSONFormatter() {
  const [formdata, setformdata] = useState('');
  const [result, setResult] = useState();
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [place, setplace] = useState('Type (or paste) here...');
  const [disableBtn, setDisableBtn] = useState(true);
  const route = useRouter();
  console.log(route);
  const path = route.pathname;
  const { title, desc, image } = GetCurrentPageContent(path, JsonTools);
  console.log({ title });

  const handleChange = (e) => {
    setformdata(e.target.value);
    setDisableBtn(false);
  };

  useEffect(() => {
    document.title = 'JSON Formatter Generator';
  }, []);

  const handleSubmit = async (e) => {
    setDisableBtn(true);
    e.preventDefault();
    setbuttonLoading(true);
    try {
      const beautify = JSON.stringify(JSON.parse(formdata), null, 4);
      setResult(beautify);
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
    } catch (err) {
      setbuttonLoading(false);
      toast.error('Please! Write valid Json', {
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
            <h1>JSON Formatter Generator</h1>
          </div>
          <div className='detail-hero-content-des'>
            <p>
              Formate JSON Formatter with our generator tool. Preview the result
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
              <h2>Input JSON</h2>
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
                      <span className='sr-only'>Loading...</span>
                    </div>
                  ) : (
                    'Format JSON'
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
      <div className='text-body'>
        <h2>Welcome to our JSON Minify Generator!</h2>
        <p>
          Are you looking for a way to reduce the size of your JavaScript Object
          Notation (JSON) files? Our JSON Minify Generator is the perfect tool
          for you. Using our generator, you can quickly and easily convert your
          JSON files into a smaller, more efficient format.
        </p>
        With our JSON Minify Generator, you can minify your JSON files in just a
        few clicks.
        <p>
          All you need to do is upload your JSON file and let our generator do
          the work for you. Once you've uploaded your file, our generator will
          automatically minify it, reducing the size and improving readability.
        </p>
        <p>
          The JSON Minify Generator also removes unnecessary whitespace and
          comments, making your JSON files easier to read and understand. This
          can save you time and effort when editing or debugging your code.
        </p>
        <p>
          Our JSON Minify Generator is also completely free to use. No matter
          how big or small your JSON files are, you can rest assured that our
          generator will minify them quickly and efficiently. You can also save
          your minified files to your device — perfect for sharing with others
          or keeping as a backup.
        </p>
        <p>
          So, if you're looking for an easy and effective way to reduce the size
          of your JSON files, look
        </p>
        <h2>what is a json formatter?</h2>
        <p>
          A JSON Formatter is a tool used for formatting and validating JSON
          data. It helps to improve the readability and structure of JSON
          documents, making them easier to read and debug. A JSON Formatter can
          also be used to check for syntax errors in the JSON data and to
          validate the JSON data against a JSON schema.
        </p>
      </div>
      <Footer />
    </>
  );
}
