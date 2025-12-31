import { useRouter } from 'next/router';
import Head from 'next/head';
import AiTool from '@/dbTools/AiTools';
import { useEffect, useState } from 'react';

import { StyledAIToolsFormatter } from './styled';
import StyledContainer from '../StyledContainer';
import CustomHead from '../CustomHead';

export default function AiToolComp({ page }) {
  const { id } = page;

  const route = useRouter();
  //

  const [formData, setFormData] = useState('');
  const [result, setResult] = useState();
  const [apiParamEndPoint, setapiParamEndPoint] = useState('');
  const [buttonLoading, setbuttonLoading] = useState(false);
  const [selectedItem, setselectedItem] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const [characterLength, setCharacterLength] = useState('');

  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const faqs =
    page.type === 'questionAnswer'
      ? [
          {
            question: 'What can I ask the chat?',
            answer:
              'You can ask general questions, coding help, or troubleshooting prompts. Avoid sharing sensitive data.',
          },
          {
            question: 'Is there a character limit?',
            answer:
              'Inputs are capped at roughly 250 characters to keep responses fast and lightweight.',
          },
          {
            question: 'Is my text stored?',
            answer:
              'No. Your prompt is sent only to the configured AI endpoint for a response and not stored for reuse.',
          },
        ]
      : [];

  const faqStructuredData =
    faqs.length > 0
      ? {
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
        }
      : null;

  useEffect(() => {
    if (selectedItem) {
      if (
        selectedItem.title !== 'Q & A' &&
        selectedItem.title !== 'Movie To Emoji' &&
        selectedItem.title !== 'Interview Questions' &&
        selectedItem.title !== 'Write an Essay Outline online' &&
        selectedItem.title !== 'Explain Code' &&
        selectedItem.title !== 'Micro Horror Story' &&
        selectedItem.title !== 'Factual Answering' &&
        selectedItem.title !== 'Javascript Helper Chatbot' &&
        selectedItem.title !== 'Science Fiction Books List Maker' &&
        selectedItem.title !== 'ML/AI Language Model Tutor' &&
        selectedItem.title !== 'VR Fitness Idea Generator'
      ) {
        setCharacterLength('(Max 250 characters)');
      }
    }
  }, [selectedItem]);

  useEffect(() => {
    if (formData) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [formData]);

  function changeHandler(e) {
    if (page.title === 'Explain Code') {
      setFormData(e.target.value);
    } else if (page.title === 'Python Bug Fixer') {
      setFormData(e.target.value);
    } else if (page.title === 'Python To Natural Language') {
      setFormData(e.target.value);
    } else if (page.title === 'JavaScript To Python') {
      setFormData(e.target.value);
    } else if (page.title === 'Calculate Time Complexity') {
      setFormData(e.target.value);
    } else if (page.title === 'Science Fiction Books List Maker') {
      let inp = e.target.value.replace(
        /[abcdefghijklmnopqrstuvwxyz/.,!@#$%^&*()}{_+|"}]/gi,
        ''
      );
      if (Number(inp) <= 5) {
        setFormData(inp.trim());
      } else {
        setFormData('5');
      }
    } else if (page.title === 'VR fitness Idea Generator') {
      let inp = e.target.value.replace(
        /[abcdefghijklmnopqrstuvwxyz/.,!@#$%^&*()}{_+|"}]/gi,
        ''
      );
      if (Number(inp) <= 5) {
        setFormData(inp.trim());
      } else {
        setFormData('5');
      }
    } else {
      if (e.target.value.trim().length > 0) {
        // let inp = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
        let inp = e.target.value.replace(/[/!@#$%^&*()}{_>?+|"}<]/g, '');
        // inp = inp.replace(/[0-9]/g, '')
        if (inp === '.') {
          setFormData('');
        } else {
          setFormData(inp);
        }
      } else {
        setFormData(e.target.value.trim());
      }
    }
  }

  // let pageTitle = id.replace(/[A-Z]/g, ' $&').trim();
  // const formattedPageTitle = pageTitle[0].toUpperCase() + pageTitle.slice(1);
  // console.log(formattedPageTitle);
  useEffect(() => {
    if (page) {
      if (page.type !== 'qa') {
        setCharacterLength('max character length 250');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbuttonLoading(true);
    setDisableBtn(true);
    // https://sturdayapp.herokuapp.com
    // https://salty-fjord-37519.herokuapp.com/
    // `http://localhost:4000/api/${page.type}`,

    try {
      const response = await fetch(
        `https://salty-fjord-37519.herokuapp.com/api/${page.type}`,

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText: formData }),
        }
      );
      const data = await response.json();

      if (data.result) {
        if (selectedItem.title === 'Explain Code') {
          const res = data.result.replace(/[0123456789.]/g, '');
          setResult(res);
        } else if (selectedItem.title === 'Summarization') {
          const res = data.result.replace(/[:@#$%^&*()_.]/g, '');
          setResult(res);
        } else {
          setResult(data.result);
        }
      } else {
        setResult('Unknown');
      }

      setbuttonLoading(false);
      setDisableBtn(false);
      // setFormData("");
    } catch (err) {
      setbuttonLoading(false);
      alert('ERROR: Unable to parse JSON');
    }
  };

  //

  return (
    <>
      {faqStructuredData ? (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData),
            }}
          />
        </Head>
      ) : null}
      <CustomHead
        title={page.title}
        ogUrl={canonicalUrl}
        metaDescription={page.desc}
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fix tools og image"
      />

      {/*  */}
      <StyledAIToolsFormatter>
        <StyledContainer>
          <div
            className="tools-for-better-thinking"
            // style={{ padding: "5rem 0px 5rem 0px" }}
          >
            <div
            // className="container"
            >
              <div className="ai_tools_heading">
                <h1>{page.title}</h1>
              </div>
              <div className="ai_tools_description">
                <p>{page.desc}</p>
              </div>
              <label className="my-1 mr-2"></label>
              <div className="inp-out-container" style={{}}>
                <div className="inp-container">
                  <h2>Type Text Here {characterLength}</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group text-area-container">
                      <textarea
                        maxLength={250}
                        placeholder={page.desc + '...'}
                        className="form-control inp-textarea"
                        // rows="8"
                        id="input-comment"
                        value={formData}
                        onChange={changeHandler}
                        style={{ fontSize: '1.5rem', minHeight: '195px' }}
                      ></textarea>
                    </div>
                    {/* <button */}
                    {/* // btn btn-primary btn-block w-100 p-3 mt-4  */}
                    {/* className="sub-btn"
                      style={{ fontSize: "16px" }}
                      disabled={formData == ""}
                    >
                      {buttonLoading ? (
                        <div class="spinner-border text-dark" role="status">
                          <span class="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button> */}

                    <button
                      className={`styled-btn ${
                        disableBtn ? 'btn-disable' : ''
                      }`}
                      disabled={`${disableBtn ? 'true' : ''}`}
                      type="submit"
                    >
                      {buttonLoading ? (
                        <div class="spinner-border text-dark" role="status">
                          {/* <span class='sr-only'>Loading...</span> */}
                        </div>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </form>
                </div>

                <div className=" ai-tools-results-container">
                  <h2>Output</h2>
                  <div className="ai-tools-results">
                    {result?.split('\n').map((data, index) => (
                      <div key={index} className="">{data}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StyledContainer>
      </StyledAIToolsFormatter>
      {page.type === 'questionAnswer' ? (
        <div className="text-body" style={{ padding: '0 16px' }}>
          <h2>How to use Chat with AI</h2>
          <ol>
            <li>Enter a clear question or prompt (keep it concise).</li>
            <li>Click Submit to get a response in seconds.</li>
            <li>
              Refine your prompt for follow-ups; results stay on the page.
            </li>
          </ol>

          <h3>Prompt tips</h3>
          <ul>
            <li>
              Add context (language, framework, goal) to get sharper answers.
            </li>
            <li>
              For code, paste the snippet and describe the expected behavior.
            </li>
            <li>Avoid personal or sensitive data—keep prompts generic.</li>
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
              <a href="/aitools/summarize">Summarize for 2nd grader</a>
            </li>
            <li>
              <a href="/aitools/explainCode">Explain code</a>
            </li>
            <li>
              <a href="/json/json-formatter">JSON formatter</a>
            </li>
          </ul>
        </div>
      ) : null}
      {/*  */}
    </>
  );
}
