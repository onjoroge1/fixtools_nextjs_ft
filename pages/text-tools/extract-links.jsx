import React from 'react';
import { useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

import textTool from '@/dbTools/textTools';
import { useRouter } from 'next/router';
import { GetCurrentPageContent } from '@/lib/utils';
import CustomHead from '@/components/CustomHead';

import Footer from '@/components/Footer/Footer';

export default function ExtractLinks() {
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

  const extractLinks = (text) => {
    // Use a regular expression to match URLs in the text
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const links = text.match(urlRegex);

    return links;
  };

  const handleSubmit = async (e) => {
    setDisableBtn(true);
    e.preventDefault();
    setbuttonLoading(true);

    try {
      const result = extractLinks(formdata);

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
            <h1>Extract Links From Text</h1>
          </div>
          <div className="detail-hero-content-des">
            <p>
              This tool makes it fast and easy to find all the links in your
              text.
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
          Extracting links from text can be a useful skill in many different
          contexts. For example, you might want to extract links from a blog
          post or article to create a table of contents, or you might want to
          extract links from a social media post to see which websites are being
          shared.
        </p>
        <p>
          There are many different tools and techniques that you can use to
          extract links from text. In this article, we'll take a closer look at
          what link extraction is, how it works, and why you might want to use
          it. We'll also discuss some of the different tools and methods that
          you can use to extract links from text.
        </p>
        <h2>What is link extraction?</h2>
        <p>
          Link extraction, also known as URL extraction, is the process of
          extracting links (also known as URLs, or uniform resource locators)
          from a piece of text. A link is a string of text that contains the
          address of a web page, and it typically begins with the http or https
          protocol.
        </p>
        <p>
          Link extraction involves finding and extracting these links from a
          piece of text. This can be a useful skill in many different contexts,
          as we'll discuss in the next section.
        </p>
        <h2>Why use link extraction?</h2>
        <p>
          There are many different reasons why you might want to use link
          extraction. Here are just a few examples:
        </p>
        <ul>
          <li>
            Creating a table of contents: if you're writing a long blog post or
            article, you might want to create a table of contents that allows
            readers to quickly jump to different sections of the text. You can
            use link extraction to quickly generate a list of links to the
            different sections of your post, making it easy for readers to
            navigate.
          </li>
          <li>
            Analyzing social media posts: if you're analyzing social media data,
            you might want to extract links from posts to see which websites are
            being shared. You can use link extraction to quickly and accurately
            extract links from social media posts, allowing you to analyze which
            websites are receiving the most traffic from social media.
          </li>
          <li>
            Cleaning up text: if you have a piece of text that contains a lot of
            links, it can be difficult to read and understand. You can use link
            extraction to remove the links
          </li>
        </ul>
      </div>

      <Footer />
    </>
  );
}
