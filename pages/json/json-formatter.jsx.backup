import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import HeaderNav from '@/components/HeaderNav';

import { toast, ToastContainer } from 'react-toastify';
import JsonTools from '../../dbTools/JsonTool';
import { GetCurrentPageContent } from '@/lib/utils';
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
  const path = route.pathname;
  const { title, desc } = GetCurrentPageContent(path, JsonTools);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const faqs = [
    {
      question: 'How do I format JSON online?',
      answer:
        'Paste or type your JSON, click Format, and the tool will pretty-print with indentation and validation.',
    },
    {
      question: 'Will my JSON data be stored?',
      answer:
        'No. Formatting happens in your browser; nothing is persisted or sent to a server.',
    },
    {
      question: 'What happens if my JSON is invalid?',
      answer:
        'You will get a validation error. Fix missing commas, braces, or quotes and try again.',
    },
  ];

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

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
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </Head>
      <CustomHead
        title={title}
        ogUrl={canonicalUrl}
        metaDescription={desc}
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fix tools og image"
      />
      <div
        className="detail-hero"
        style={{ minHeight: '320px', maxHeight: '320px' }}
      >
        <HeaderNav />
        <div className="detail-hero-content">
          <div className="detail-hero-content-heading">
            <h1>JSON Formatter Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Formate JSON Formatter with our generator tool. Preview the result
              and copy the generated code to your website.
            </p>
          </div>
        </div>
      </div>
      <div
        className="tools-for-better-thinking"
        style={{ padding: '5rem 0px 5rem 0px' }}
      >
        <div className="container d-flex align-items-center justify-content-center row col-md-8">
          <div className="col-md-12 col-lg-12 offset-lg-6">
            <label className="my-1 mr-2">
              <h2>Input JSON</h2>
            </label>
            <form className="" role="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  required
                  className="form-control"
                  placeholder={place}
                  rows="15"
                  id="input-comment"
                  onChange={handleChange}
                  style={{ fontSize: '1.5rem' }}
                ></textarea>
              </div>
              <p></p>
              <div className="d-grid gap-3 col-md-2">
                <button
                  style={{ borderRadius: '3px' }}
                  className={`${disableBtn ? 'btn-disable' : ''}`}
                  disabled={`${disableBtn ? 'true' : ''}`}
                  type="submit"
                >
                  {buttonLoading ? (
                    <div className="spinner-border text-dark" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    'Format JSON'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="col-md-12 col-lg-12 offset-lg-6">
            <i
              style={{ cursor: 'pointer', float: 'right', padding: '10px' }}
              onClick={copyText}
              className="fa-regular fa-clone"
            ></i>
            <div className="form-group">
              <textarea
                className="form-control element-code"
                rows="15"
                id="input-comment"
                value={result}
                style={{ fontSize: '2rem' }}
                disabled
                placeholder="Output"
              ></textarea>
            </div>
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
      <div className="text-body">
        <h2>How to format JSON online</h2>
        <ol>
          <li>Paste or type your JSON in the input box above.</li>
          <li>Click “Format JSON” to pretty-print with indentation.</li>
          <li>Copy the formatted output or continue editing directly.</li>
        </ol>

        <h3>Tips for valid JSON</h3>
        <ul>
          <li>Wrap property names and string values in double quotes.</li>
          <li>Use commas between array and object items.</li>
          <li>Check for matching braces and brackets before formatting.</li>
        </ul>

        <h3>Common use cases</h3>
        <p>
          Quickly beautify API responses, validate payloads before sending them
          to production, or reformat config files while debugging. Everything
          runs in your browser, so your data stays private.
        </p>

        <h3>FAQs</h3>
        <ul>
          {faqs.map((item) => (
            <li key={item.question}>
              <strong>{item.question}</strong> — {item.answer}
            </li>
          ))}
        </ul>

        <h3>Related tools</h3>
        <ul>
          <li>
            <a href="/json/minify-json">Minify JSON</a>
          </li>
          <li>
            <a href="/json/json-to-csv">JSON to CSV</a>
          </li>
          <li>
            <a href="/json/json-validator">JSON Validator</a>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
}
