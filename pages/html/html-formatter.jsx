import React, { useState } from 'react';
import Head from 'next/head';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.css';

import HtmlTool from '@/dbTools/HtmlTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function HTMLFormatter() {
  const [formdata, setformdata] = useState('');
  const [result, setResult] = useState();
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [place, setplace] = useState('Type (or paste) here...');
  const [disableBtn, setDisableBtn] = useState(true);

  const route = useRouter();
  const path = route.pathname;
  const { title, desc } = GetCurrentPageContent(path, HtmlTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const faqs = [
    {
      question: 'How do I format HTML online?',
      answer:
        'Paste your HTML into the input, click “Format HTML”, and the tool will pretty-print with line breaks.',
    },
    {
      question: 'Does this fix invalid HTML?',
      answer:
        'It formats existing tags but cannot correct missing or mismatched tags. Validate your markup after formatting.',
    },
    {
      question: 'Is my HTML uploaded anywhere?',
      answer:
        'No. Formatting runs in your browser, and the data is not stored on a server.',
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

  const handleSubmit = async (e) => {
    setDisableBtn(true);
    e.preventDefault();
    setbuttonLoading(true);

    const formatted = formdata.replace(/\>\</g, '>\n<');
    setResult(formatted);
    setbuttonLoading(false);
    toast.success('Formatted!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const copyText = () => {
    const selct = document.querySelector('.element-code').textContent;
    navigator.clipboard.writeText(selct);
    toast.success('Copied!', {
      position: 'top-right',
      autoClose: 2000,
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
      <div className="detail-hero">
        <HeaderNav />
        <div className="detail-hero-content">
          <div className="detail-hero-content-heading">
            <h1>HTML Formatter</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Format HTML markup with line breaks and spacing. Paste your HTML,
              format it, then copy the cleaned result.
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
              <h2>Input HTML</h2>
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
                  style={{ borderRadius: '3px', width: '150px' }}
                  className={`${disableBtn ? 'btn-disable' : ''}`}
                  disabled={`${disableBtn ? 'true' : ''}`}
                  type="submit"
                >
                  {buttonLoading ? (
                    <div className="spinner-border text-dark" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    'Format HTML'
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
      <div className="text-body">
        <h2>How to format HTML</h2>
        <ol>
          <li>Paste your HTML markup into the input field.</li>
          <li>Click “Format HTML” to add line breaks between tags.</li>
          <li>Copy the cleaned result to your editor or CMS.</li>
        </ol>

        <h3>Tips for clean markup</h3>
        <ul>
          <li>Close all tags and nest elements properly before formatting.</li>
          <li>
            Keep attributes quoted and avoid unescaped special characters.
          </li>
          <li>Validate your output if you embed user-generated content.</li>
        </ul>

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
            <a href="/html/html-minify">Minify HTML</a>
          </li>
          <li>
            <a href="/html/html-element-builder">HTML Element Builder</a>
          </li>
          <li>
            <a href="/css-tool/gradient">CSS gradient generator</a>
          </li>
        </ul>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
