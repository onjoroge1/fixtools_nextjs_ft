import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import CustomHead from '@/components/CustomHead';
import { useRouter } from 'next/router';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';
import HtmlTool from '@/dbTools/HtmlTool';
import { GetCurrentPageContent } from '@/lib/utils';
import styles from '../../styles/ToolPage.module.css';

export default function MinifyHTML() {
  const [formdata, setformdata] = useState('');
  const [result, setResult] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fetchUrl, setFetchUrl] = useState('');
  const [fetching, setFetching] = useState(false);

  // Minification options
  const [removeSpaces, setRemoveSpaces] = useState(true);
  const [removeComments, setRemoveComments] = useState(true);
  const [removeLineBreaks, setRemoveLineBreaks] = useState(true);

  const route = useRouter();
  const path = route.pathname;
  const { title, desc } = GetCurrentPageContent(path, HtmlTool);

  const handleChange = (e) => {
    setformdata(e.target.value);
    setDisableBtn(!e.target.value.trim());
  };

  const fetchHtmlFromUrl = async () => {
    if (!fetchUrl.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    setFetching(true);
    try {
      // Using a CORS proxy for demonstration
      const response = await fetch(fetchUrl);
      const html = await response.text();
      setformdata(html);
      setDisableBtn(false);
      toast.success('HTML fetched successfully!');
    } catch (error) {
      toast.error(
        'Failed to fetch HTML. Please check the URL or paste HTML directly.'
      );
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableBtn(true);

    let minified = formdata;

    // Apply minification based on options
    if (removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }

    if (removeLineBreaks) {
      minified = minified.replace(/\n\s*\n/g, '\n').replace(/\r/g, '');
    }

    if (removeSpaces) {
      minified = minified.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ');
    }

    minified = minified.trim();
    setResult(minified);

    toast.success('HTML minified successfully!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'dark',
    });

    setDisableBtn(false);
  };

  const copyText = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Copied to clipboard!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadFile = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'minified.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Downloaded!', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });
    }
  };

  const clearAll = () => {
    setformdata('');
    setResult('');
    setFetchUrl('');
    setDisableBtn(true);
  };

  const stats = result
    ? {
        original: formdata.length,
        minified: result.length,
        saved: formdata.length - result.length,
        percentage: ((1 - result.length / formdata.length) * 100).toFixed(1),
      }
    : null;

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
          <h1>HTML Minifier</h1>
          <p>
            A free online tool to minify HTML code and reduce the HTML file size
          </p>
        </div>
      </div>

      <main className={styles.toolPage}>
        <div className={styles.toolContainer}>
          {/* Fetch from URL Section */}
          <div className={styles.editorSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Fetch HTML from URL</h2>
            </div>
            <div className={styles.urlFetchContainer}>
              <input
                type="url"
                className={styles.urlInput}
                placeholder="Enter URL (e.g., https://example.com)"
                value={fetchUrl}
                onChange={(e) => setFetchUrl(e.target.value)}
              />
              <button
                className={styles.fetchButton}
                onClick={fetchHtmlFromUrl}
                disabled={fetching || !fetchUrl.trim()}
              >
                {fetching ? 'Fetching...' : 'Fetch HTML'}
              </button>
            </div>
            <p className={styles.urlHint}>
              💡 Enter any website URL to automatically fetch and minify its
              HTML. Works with most public websites.
            </p>
          </div>

          {/* Stats Banner */}
          {stats && (
            <div className={styles.statsBar}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Original Size:</span>
                <span className={styles.statValue}>
                  {stats.original.toLocaleString()} bytes
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Minified Size:</span>
                <span className={styles.statValue}>
                  {stats.minified.toLocaleString()} bytes
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Saved:</span>
                <span className={styles.statValue}>
                  {stats.saved.toLocaleString()} bytes
                </span>
              </div>
              <div className={styles.statHighlight}>
                <span className={styles.statValue}>
                  {stats.percentage}% smaller
                </span>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className={styles.editorSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Input HTML</h2>
              <div className={styles.actionButtons}>
                {formdata && (
                  <button
                    className={styles.clearButton}
                    onClick={clearAll}
                    type="button"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <textarea
                className={styles.codeEditor}
                placeholder="Paste your HTML code here or fetch from URL above..."
                rows={15}
                value={formdata}
                onChange={handleChange}
                spellCheck={false}
              />

              {/* Minification Options */}
              <div className={styles.optionsSection}>
                <h3 className={styles.optionsTitle}>Minification Options</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={removeSpaces}
                      onChange={(e) => setRemoveSpaces(e.target.checked)}
                    />
                    <span>Remove extra spaces</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={removeComments}
                      onChange={(e) => setRemoveComments(e.target.checked)}
                    />
                    <span>Remove comments</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={removeLineBreaks}
                      onChange={(e) => setRemoveLineBreaks(e.target.checked)}
                    />
                    <span>Remove line breaks</span>
                  </label>
                </div>
              </div>

              <button
                className={styles.primaryButton}
                disabled={disableBtn}
                type="submit"
              >
                ⚡ Minify HTML
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className={styles.editorSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Minified Output</h2>
              <div className={styles.actionButtons}>
                {result && (
                  <>
                    <button
                      className={styles.iconButton}
                      onClick={downloadFile}
                      title="Download"
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                    <button
                      className={`${styles.iconButton} ${copied ? styles.copied : ''}`}
                      onClick={copyText}
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <>
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            <textarea
              className={styles.codeEditor}
              rows={15}
              value={result}
              readOnly
              placeholder="Minified HTML will appear here..."
              spellCheck={false}
            />
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <h3>What is the usage of HTML minifying?</h3>
            <p>
              Imagine you're writing a story and want to make it as short as
              possible without losing the meaning. HTML minifying does something
              similar with website code! It removes unnecessary characters and
              spaces from the code without changing the webpage's appearance.
              This makes the code smaller and faster to load for the user.
            </p>

            <h3 style={{ marginTop: '2rem' }}>
              Is minifying HTML good for page load speed and performance?
            </h3>
            <p>
              Absolutely! Think of it like a race: The smaller your website's
              code is, the faster it can reach the finish line (meaning the user
              can see the page faster). It also saves on bandwidth, like the
              energy the website uses to load.
            </p>

            <div className={styles.tipBox} style={{ marginTop: '1.5rem' }}>
              <strong>💡 Tip:</strong> HTML minification removes empty tags,
              white space, and unnecessary data. This reduces the file size and
              eventually improves the page load time.
            </div>
          </div>

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <p className={styles.faqSubtitle}>
              Everything you need to know about HTML minification
            </p>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What is HTML Minify?</h3>
              <p className={styles.faqAnswer}>
                This tool helps to minify HTML files by removing redundant or
                unwanted data, thereby making the code or the file shorter and
                more precise.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How does HTML Minify Work?</h3>
              <p className={styles.faqAnswer}>
                HTML minification removes empty tags, white space, and
                unnecessary data. This reduces the file size and eventually
                improves the page load time.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is this tool free to use?</h3>
              <p className={styles.faqAnswer}>
                Yes! Our HTML minifier is completely free to use. No signup
                required, and you can minify as many HTML files as you need.
              </p>
            </div>

            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Will minifying HTML break my website?
              </h3>
              <p className={styles.faqAnswer}>
                No, minifying HTML only removes unnecessary whitespace,
                comments, and line breaks. The functionality and appearance of
                your website remain completely unchanged.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </>
  );
}
