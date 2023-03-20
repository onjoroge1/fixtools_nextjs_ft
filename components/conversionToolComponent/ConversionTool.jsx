import React, { useState, useEffect } from 'react';

import StyledContainer from '../StyledContainer';
import { StyledConversionTool } from './styled';
import unitsDB from './toolsData';

import CustomHead from '../CustomHead';
import { useRouter } from 'next/router';

import {
  massConversion,
  volumeConversion,
  areaConversion,
  bitByteConversion,
  powerConversion,
  timeConversion,
  temperatureConversion,
  presurreConversion,
  lengthConversion,
  energyConversion,
  speedConversion,
  fuelEconomyConversion,
  planeAngleConversion,
} from './conversionToolsFunctions';

// import { useParams } from 'react-router-dom';

import { LineWave } from 'react-loader-spinner';

// import SEO from '../../components/SEO';
// import conversionToolsDb from '../../dbTool/conversionToolsDb';
// import { useLocation } from 'react-router-dom';
// import { GetCurrentPageContent } from '../../utils';

const ConversionTool = ({ currentPage }) => {
  const [formData, setFormData] = useState({
    inputValue: '',
    selectId: '',
    convertFrom: '',
    convertTo: '',
  });

  console.log({ env: process.env.NEXT_PUBLIC_HELLO });
  console.log(unitsDB);

  const [apiParamEndPoint, setapiParamEndPoint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const { inputValue, convertFrom, convertTo } = formData;

  const toolsData = unitsDB.find((item) => item.id === currentPage.type);

  // const location = useLocation();
  // const path = location.pathname;
  // const { title, desc, image } = GetCurrentPageContent(path, conversionToolsDb);
  // const pageUrl = window.location.href;

  // useEffect(() => {
  //   document.title = toolsData.title;
  //   if (id === 'currencyConversion') {
  //     setapiParamEndPoint('currencyConversion');
  //   }
  // }, [id]);

  const changeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  const fromHandler = (e) => {
    console.log(e.target.value);
    setFormData((prevState) => {
      return { ...prevState, ['convertFrom']: e.target.value };
    });
  };
  const toHandler = (e) => {
    console.log(e.target.value);
    setFormData((prevState) => {
      return { ...prevState, ['convertTo']: e.target.value };
    });
  };

  const submitHandler = async (e) => {
    if (convertFrom === convertTo) {
      setFormData((prevState) => {
        return { ...prevState, inputValue: '' };
      });
      return alert(
        'Inputs should not be same \nPlease provide different Inputs'
      );
    }
    e.preventDefault();
    // setFormData((prevState) => {
    //   return { ...prevState, inputValue: "" };
    // });
    if (currentPage.type === 'presurreConversion') {
      setResult(
        presurreConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'temperatureConversion') {
      return setResult(
        temperatureConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'massConversion') {
      return setResult(
        massConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'volumeConversion') {
      return setResult(
        volumeConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'areaConversion') {
      return setResult(
        areaConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'bitByteConversion') {
      return setResult(
        bitByteConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'timeConversion') {
      return setResult(
        timeConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'powerConversion') {
      return setResult(
        powerConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'lengthConversion') {
      return setResult(
        lengthConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'fuelEconomyConversion') {
      return setResult(
        fuelEconomyConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'planeAngleConversion') {
      return setResult(
        planeAngleConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'energyConversion') {
      setResult(
        energyConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'speedConversion') {
      return setResult(
        speedConversion(convertFrom, convertTo, Number(inputValue)) +
          ' ' +
          convertTo
      );
    } else if (currentPage.type === 'currencyConversion') {
      setLoading(true);
      console.log('hello');
      try {
        const response = await fetch(
          // `https://onlinetoolbackend.herokuapp.com/api/${apiParamEndPoint}`
          // `http://localhost:4000/api/${currentPage.type}`
          `${process.env.NEXT_PUBLIC_API_URL}/${currentPage.type}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: inputValue,
              from: convertFrom,
              to: convertTo,
            }),
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.result) {
          setResult(data.result + ' ' + convertTo);
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

      //
      //
    }
  };

  function firstLetterCapitalize(input) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      if (i === 0) {
        result = result + input[i].toUpperCase();
      } else {
        result = result + input[i];
      }
    }
    return result;
  }

  console.log(result);
  return (
    <>
      <CustomHead
        title={currentPage.title}
        ogUrl={process.env.NEXT_PUBLIC_HOST + route.asPath}
        metaDescription={currentPage.desc}
        ogImageUrl='/programming_tools.jpg'
        ogImageAlt='Fix tools og image'
      />
      {/* <HeaderNav /> */}
      <StyledConversionTool>
        <div className='conversion-tools-container'>
          <StyledContainer>
            <form
              onSubmit={submitHandler}
              autoComplete='off'
            >
              <div className='text'>
                <h1 className='main-heading'>{currentPage.title}</h1>
                <p className='tag-line'>{currentPage.description}</p>
              </div>

              <div className='select-container'>
                <div className='from-to'>
                  <div className='from'>
                    <select
                      id={currentPage.type}
                      onChange={fromHandler}
                    >
                      <option
                        value=''
                        disabled
                        selected
                      >
                        Convert From
                      </option>
                      {toolsData.convertOptions.map((option, index) => {
                        return (
                          <option
                            className='convertFrom'
                            value={option}
                            key={index}
                          >
                            {firstLetterCapitalize(option)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className='to'>
                    <select
                      id={currentPage.type}
                      onChange={toHandler}
                    >
                      <option
                        value=''
                        disabled
                        selected
                      >
                        Convert To
                      </option>
                      {toolsData.convertOptions.map((option, index) => {
                        return (
                          <option
                            className='convertFrom'
                            value={option}
                            key={index}
                          >
                            {firstLetterCapitalize(option)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className='input-value'>
                  <label for='inputValue'></label>
                  <input
                    type='number'
                    id='inputValue'
                    value={inputValue}
                    onChange={changeHandler}
                    placeholder='Input value'
                  />
                  <br />
                  <button
                    className={`${
                      convertFrom && convertTo && inputValue
                        ? ''
                        : 'btn-disable'
                    }`}
                    disabled={`${
                      inputValue && convertFrom && convertTo ? '' : 'true'
                    }`}
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

export default ConversionTool;
