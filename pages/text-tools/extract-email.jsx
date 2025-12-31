import React from 'react';
import { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
// import SEO from '../../components/SEO';

import textTool from '@/dbTools/textTools';
import { useRouter } from 'next/router';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';

import Footer from '@/components/Footer/Footer';

export default function ExtractEmailAddress() {
  const [formdata, setformdata] = useState('');
  const [result1, setResult1] = useState();
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [place, setplace] = useState(
    'Start Typing or paste your document here...'
  );
  const [disableBtn, setDisableBtn] = useState(true);

  const path = useRouter().pathname;
  const route = useRouter();
  const { title, desc, image } = GetCurrentPageContent(path, textTool);

  const handleChange = (e) => {
    setformdata(e.target.value);
    setDisableBtn(false);
  };

  const extractEmailAddress = (text) => {
    // Use a regular expression to match email addresses in the text
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const emails = text.match(emailRegex);

    return emails;
  };

  const handleSubmit = async (e) => {
    setDisableBtn(true);
    e.preventDefault();
    setbuttonLoading(true);

    try {
      const result = extractEmailAddress(formdata);

      setResult1(result);
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
      toast.error('Please! Enter valid text', {
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
            <h1>Extract EmailAddress From Text</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              This tool makes it fast and easy to find all the email addresses
              in your text.
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
              <h2>Input</h2>
            </label>
            <form className="" role="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  required
                  className="form-control"
                  placeholder={place}
                  rows="4"
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
                    'Submit'
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
                rows="4"
                id="input-comment"
                value={result1}
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
        <p>
          Extracting email addresses from text can be a tedious and
          time-consuming task. Whether you're trying to compile a list of email
          addresses for marketing purposes, or you need to quickly locate an
          email address in a long document, manually scanning through the text
          to find email addresses can be a frustrating experience.
        </p>
        <p>
          That's where an email extraction tool comes in. These tools make it
          easy to quickly and accurately extract email addresses from any text,
          saving you time and hassle. In this article, we'll take a closer look
          at what email extraction tools are, how they work, and why you might
          want to use one.
        </p>
        <h2>What is an email extraction tool?</h2>
        <p>
          An email extraction tool is a piece of software that automatically
          scans through a piece of text and extracts any email addresses that it
          finds. These tools use advanced algorithms and regular expressions to
          accurately identify email addresses, even in complex or
          poorly-formatted text.
        </p>
        <p>
          Typically, email extraction tools allow you to either paste in the
          text that you want to search, or provide a file that the tool will
          scan. The tool will then scan the text and extract any email addresses
          that it finds, typically presenting them in a list or table for easy
          reference.
        </p>
        <h2>How do email extraction tools work?</h2>
        <p>
          Email extraction tools work by using regular expressions to identify
          email addresses in the text. A regular expression is a sequence of
          characters that forms a search pattern. These patterns can be used to
          match specific strings or sets of strings, such as email addresses.
        </p>
        <p>
          When an email extraction tool scans a piece of text, it uses a regular
          expression to search for patterns that match the format of an email
          address. For example, a regular expression might look for the @
          symbol, followed by a series of letters, numbers, and/or symbols,
          followed by a period (.) and another series of letters. If the tool
          finds a string that matches this pattern, it will extract it as an
          email address.
        </p>
        <p>
          Some email extraction tools also use advanced algorithms to improve
          their accuracy. These algorithms can take into account factors such as
          common email address formats and common misspellings, to ensure that
          the tool extracts as many valid email addresses as possible.
        </p>
        <h2>Why use an email extraction tool?</h2>
        <p>
          There are several reasons why you might want to use an email
          extraction tool. Here are just a few examples:
        </p>
        <ul>
          <li>
            Time-saving: manually scanning through a long document to find email
            addresses can be a tedious and time-consuming process. An email
            extraction tool can save you hours of time by quickly and accurately
            locating all the email addresses in your text.
          </li>
          <li>
            Improved accuracy: it's easy to miss email addresses when you're
            manually scanning through text, especially if the text is long or
            poorly-formatted. An email extraction tool, on the other hand, can
            accurately identify even the most difficult-to-find email addresses,
            ensuring that you don't miss any important contacts.
          </li>
          <li>
            Customization: some email extraction tools allow you to customize
            the regular expressions that they use to search for email addresses.
            This can be useful if you need to extract email addresses that have
            a specific format, or if you need to exclude certain types of email
            addresses (such as those with a certain domain name).
          </li>
        </ul>
        <p>
          An email extraction tool can be a valuable tool for anyone who needs
          to quickly and accurately extract email addresses from text. These
          tools use regular expressions and advanced algorithms to identify
          email
        </p>
      </div>

      <Footer />
    </>
  );
}
