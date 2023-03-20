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

  console.log('curren item ', selectedItem);
  useEffect(() => {
    if (selectedItem) {
      if (
        selectedItem.title !== 'Q & A' &&
        selectedItem.title !== 'Movie To Emoji' &&
        selectedItem.title !== 'Interview Questions' &&
        selectedItem.title !== 'Essay Outline' &&
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

  console.log(selectedItem);
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

      console.log(formData);
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

    try {
      const response = await fetch(
        `http://localhost:4000/api/${page.type}`,

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputText: formData }),
        }
      );
      const data = await response.json();

      console.log('res is ', data);
      if (data.result) {
        if (selectedItem.title === 'Explain Code') {
          const res = data.result.replace(/[0123456789.]/g, '');
          setResult(res);
        } else if (selectedItem.title === 'Summarization') {
          console.log('come inside ');
          const res = data.result.replace(/[:@#$%^&*()_.]/g, '');
          console.log(data.result, '  resuklt');
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

  console.log(page);
  console.log({ route: route.asPath });
  return (
    <>
      <CustomHead
        title={page.title}
        ogUrl={process.env.NEXT_PUBLIC_HOST + route.asPath}
        metaDescription={page.desc}
        ogImageUrl='/programming_tools.jpg'
        ogImageAlt='Fix tools og image'
      />

      {/*  */}
      <StyledAIToolsFormatter>
        <StyledContainer>
          <div
            className='tools-for-better-thinking'
            // style={{ padding: "5rem 0px 5rem 0px" }}
          >
            <div
            // className="container"
            >
              <div className='ai_tools_heading'>
                <h1>{page.title}</h1>
              </div>
              <div className='ai_tools_description'>
                <p>{page.desc}</p>
              </div>
              <label className='my-1 mr-2'></label>
              <div
                className='inp-out-container'
                style={{}}
              >
                <div className='inp-container'>
                  <h2>Type Text Here {characterLength}</h2>
                  <form onSubmit={handleSubmit}>
                    <div className='form-group text-area-container'>
                      <textarea
                        maxLength={250}
                        placeholder={page.desc + '...'}
                        className='form-control inp-textarea'
                        // rows="8"
                        id='input-comment'
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
                      type='submit'
                    >
                      {buttonLoading ? (
                        <div
                          class='spinner-border text-dark'
                          role='status'
                        >
                          {/* <span class='sr-only'>Loading...</span> */}
                        </div>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </form>
                </div>

                <div className=' ai-tools-results-container'>
                  <h2>Output</h2>
                  <div className='ai-tools-results'>
                    {result?.split('\n').map((data) => (
                      <div className=''>{data}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StyledContainer>
      </StyledAIToolsFormatter>
      {/*  */}
    </>
  );
}
