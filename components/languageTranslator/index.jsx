import React, { useState, useEffect } from 'react';

import StyledContainer from '../StyledContainer';
import { StyledConversionTool } from './styled';

// import HeaderNav from '../../components/common/HeaderNav';
// import Footer from '../../components/home/Footer/Footer';

// import { useParams } from 'react-router-dom';
import languageData from './languagesDb';
import { LineWave } from 'react-loader-spinner';
// import languages from "./languagesDb";

// import { useLocation } from 'react-router-dom';
// import { GetCurrentPageContent } from '../../utils';
// import conversionToolsDb from '../../dbTool/conversionToolsDb';
// import SEO from '../../components/SEO';

const LanguageTranslator = () => {
  // console.log(languages);
  const [formData, setFormData] = useState({
    inputValue: '',
    selectId: '',
    convertFrom: '',
    convertTo: '',
  });
  const [apiParamEndPoint, setapiParamEndPoint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [disableBtn, setDisableBtn] = useState(true);
  console.log(disableBtn);

  // const location = useLocation();
  // const path = location.pathname;
  // const { desc, image } = GetCurrentPageContent(path, conversionToolsDb);
  // const pageUrl = window.location.href;
  // const { id } = useParams();

  const { inputValue, convertFrom, convertTo } = formData;

  const { title, description } = languageData;

  // const toolsData = languageData.find(
  //   (item) => item.id === "languageConversion"
  // );
  // console.log(id);

  useEffect(() => {
    if (inputValue && convertFrom && convertTo) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [inputValue, convertFrom, convertTo]);

  // useEffect(() => {
  //   // document.title="Language Conversion"
  //   document.title = 'Language Conversion';
  //   setapiParamEndPoint('languageTranslation');
  // }, []);

  const changeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  const fromHandler = (e) => {
    // console.log(e.target.value);
    setFormData((prevState) => {
      return { ...prevState, ['convertFrom']: e.target.value };
    });
  };
  const toHandler = (e) => {
    // console.log(e.target.value);
    setFormData((prevState) => {
      return { ...prevState, ['convertTo']: e.target.value };
    });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    setDisableBtn(true);
    e.preventDefault();
    // https://onlinetoolbackend.herokuapp.com
    try {
      const response = await fetch(
        // `https://onlinetoolbackend.herokuapp.com/api/${apiParamEndPoint}`,
        // `https://fixtoolupdateninenovember.herokuapp.com/api/${apiParamEndPoint}`,
        'https://libretranslate.de/translate',
        // `https://fixtoolupdateninenovember.herokuapp/api/${apiParamEndPoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // input: inputValue,
            // from: languageData.convertOptions[convertFrom],
            // to: languageData.convertOptions[convertTo],
            q: inputValue,
            source: languageData.convertOptions[convertFrom],
            target: languageData.convertOptions[convertTo],
            format: 'text',
          }),
        }
      );

      console.log(response, 'response____');

      const data = await response.json();
      console.log('result ', data);
      if (data.translatedText) {
        setResult(data.translatedText);
      } else {
        setResult('Not Avalible');
      }

      setFormData((prevState) => {
        return { ...prevState, inputValue: '' };
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // setbuttonLoading(false);
      alert('ERROR: Unable to parse JSON');
    }
  };

  const propsArray = Object.keys(languageData.convertOptions);
  // console.log(convertFrom, convertTo, inputValue);
  return (
    <>
      {/* <SEO
        title={title}
        metaDescription={desc}
        ogImageUrl={image}
        ogImageAlt={`${title} image`}
        ogUrl={pageUrl}
      /> */}
      {/* <HeaderNav /> */}
      <StyledConversionTool>
        <div className='conversion-tools-container'>
          <StyledContainer>
            <form onSubmit={submitHandler}>
              <div className='text'>
                <h1 className='main-heading'>{title}</h1>
                <p className='tag-line'>{description}.</p>
              </div>

              <div className='select-container'>
                <div className='from-to'>
                  <div className='from'>
                    <select
                      id={languageData.id}
                      onChange={fromHandler}
                    >
                      <option
                        value=''
                        disabled
                        selected
                      >
                        Convert From
                      </option>

                      {propsArray.map((prop, index) => (
                        <option
                          className='convertFrom'
                          value={prop}
                          key={index}
                        >
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='to'>
                    <select
                      id={languageData.id}
                      onChange={toHandler}
                    >
                      <option
                        value=''
                        disabled
                        selected
                      >
                        Convert To
                      </option>

                      {propsArray.map((prop, index) => (
                        <option
                          className='convertFrom'
                          value={prop}
                          key={index}
                        >
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='input-value'>
                  <label for='inputValue'></label>
                  <input
                    type='text'
                    id='inputValue'
                    value={inputValue}
                    onChange={changeHandler}
                    placeholder='Input value'
                  />
                  <br />
                  <button
                    className={`${disableBtn ? 'btn-disable' : ''}`}
                    disabled={`${disableBtn ? 'true' : ''}`}
                    type='submit'
                  >
                    Convert
                  </button>
                  <div className='result'>
                    <h1>Output</h1>
                    {loading ? (
                      <LineWave
                        height='80'
                        width='80'
                        radius='9'
                        color='royalBlue'
                        ariaLabel='loading'
                        wrapperStyle
                        wrapperClass
                      />
                    ) : (
                      <div>{result}</div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </StyledContainer>
        </div>
      </StyledConversionTool>
      {/* <Footer /> */}
    </>
  );
};
export default LanguageTranslator;
