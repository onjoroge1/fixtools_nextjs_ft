import React, { useState } from 'react';
import Head from 'next/head';

import ColorPicker from 'react-best-gradient-color-picker';
import { toast, ToastContainer } from 'react-toastify';

import CssTool from '@/dbTools/CssTool';

import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';

import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';

export default function Gradient() {
  const [color, setColor] = useState(
    'linear-gradient(90deg, rgba(61,52,233,1) 0%, RGBA(20, 199, 235, 1) 65%)'
  );

  const route = useRouter();
  const path = route.pathname;
  const { title, desc } = GetCurrentPageContent(path, CssTool);

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const faqs = [
    {
      question: 'How do I generate a CSS gradient?',
      answer:
        'Pick or adjust colors in the picker, then copy the generated background property.',
    },
    {
      question: 'Can I get both linear and radial gradients?',
      answer:
        'Yes. Switch the picker mode to radial or edit the gradient string directly.',
    },
    {
      question: 'Does this support modern browsers?',
      answer:
        'The generated CSS uses standard syntax that works in modern browsers without prefixes.',
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
            <h1>CSS Gradient Generator</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              Generate CSS gradients, preview them instantly, and copy the
              background property for your stylesheets.
            </p>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-editor">
          <h1>Options</h1>
          <div className="screen-editor-color" style={{ height: 'auto' }}>
            <label>Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>
        <div className="screen-preview">
          <h1>Preview</h1>
          <div className="screen-preview-box">
            <div
              style={{ background: `${color}` }}
              className="screen-preview-box-sample"
            ></div>
          </div>
          <h1>Code</h1>
          <div className="screen-preview-code">
            <code className="element-code">background: {color};</code>
            <i
              style={{ cursor: 'pointer' }}
              onClick={copyText}
              className="fa-regular fa-clone"
            ></i>
          </div>
        </div>
      </div>
      <div className="text-body">
        <h2>How to build a gradient</h2>
        <ol>
          <li>Pick two or more colors in the picker panel.</li>
          <li>Switch to linear or radial and adjust the angle or center.</li>
          <li>Copy the generated background property into your CSS.</li>
        </ol>

        <h3>Tips for production CSS</h3>
        <ul>
          <li>
            Use high-contrast stops for buttons; subtle stops for backgrounds.
          </li>
          <li>Keep gradient strings in CSS variables for reuse.</li>
          <li>Test contrast for legibility when overlaying text.</li>
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
            <a href="/css-tool/box-shadow">CSS Box Shadow</a>
          </li>
          <li>
            <a href="/html/html-button-gen">HTML Button Generator</a>
          </li>
          <li>
            <a href="/json/json-formatter">JSON Formatter</a>
          </li>
        </ul>
      </div>
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

      <Footer />
    </>
  );
}
