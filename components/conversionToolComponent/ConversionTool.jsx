import React, { useState, useEffect } from 'react';
import Head from 'next/head';

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

import { LineWave } from 'react-loader-spinner';

const ConversionTool = ({ currentPage }) => {
  const [formData, setFormData] = useState({
    inputValue: '',
    selectId: '',
    convertFrom: '',
    convertTo: '',
  });

  const [apiParamEndPoint, setapiParamEndPoint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const { inputValue, convertFrom, convertTo } = formData;

  const toolsData = unitsDB.find((item) => item.id === currentPage.type);
  const siteHost = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000';
  const canonicalUrl = siteHost + route.asPath;

  const faqs = [
    {
      question: 'How do I convert currency?',
      answer:
        'Select the source and target currencies, enter an amount, and click Convert. Results appear instantly.',
    },
    {
      question: 'Are rates updated automatically?',
      answer:
        'Rates come from the configured backend endpoint. Keep it online and updated for accuracy.',
    },
    {
      question: 'Do you store my conversion inputs?',
      answer:
        'No. Inputs are only used in your browser and for the outbound rate request.',
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
    setFormData((prevState) => {
      return { ...prevState, ['convertFrom']: e.target.value };
    });
  };
  const toHandler = (e) => {
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
        title={currentPage.title}
        ogUrl={canonicalUrl}
        metaDescription={currentPage.desc}
        ogImageUrl="/programming_tools.jpg"
        ogImageAlt="Fix tools og image"
      />
      {/* <HeaderNav /> */}
      <StyledConversionTool>
        <div className="conversion-tools-container">
          <StyledContainer>
            <form onSubmit={submitHandler} autoComplete="off">
              <div className="text">
                <h1 className="main-heading">{currentPage.title}</h1>
                <p className="tag-line">{currentPage.description}</p>
              </div>

              <div className="select-container">
                <div className="from-to">
                  <div className="from">
                    <select id={currentPage.type} onChange={fromHandler}>
                      <option value="" disabled selected>
                        Convert From
                      </option>
                      {toolsData.convertOptions.map((option, index) => {
                        return (
                          <option
                            className="convertFrom"
                            value={option}
                            key={index}
                          >
                            {firstLetterCapitalize(option)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="to">
                    <select id={currentPage.type} onChange={toHandler}>
                      <option value="" disabled selected>
                        Convert To
                      </option>
                      {toolsData.convertOptions.map((option, index) => {
                        return (
                          <option
                            className="convertFrom"
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
                <div className="input-value">
                  <label for="inputValue"></label>
                  <input
                    type="number"
                    id="inputValue"
                    value={inputValue}
                    onChange={changeHandler}
                    placeholder="Input value"
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
                    type="submit"
                  >
                    Convert
                  </button>

                  <div className="result">
                    <h1>Output</h1>
                    {loading ? (
                      <LineWave
                        height="80"
                        width="80"
                        radius="9"
                        color="royalBlue"
                        ariaLabel="loading"
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
      <div className="text-body" style={{ padding: '0 16px' }}>
        <h2>How to use the converter</h2>
        <ol>
          <li>Choose “Convert From” and “Convert To” units or currencies.</li>
          <li>
            Enter the amount and click Convert to see the result instantly.
          </li>
          <li>Change units and re-run as needed; inputs stay on the page.</li>
        </ol>

        <h3>Tips for accurate results</h3>
        <ul>
          <li>
            Ensure your backend API (`NEXT_PUBLIC_API_URL`) is reachable for
            currency rates.
          </li>
          <li>Double-check you selected different source and target units.</li>
          <li>
            For offline unit math (mass, length, etc.), results are calculated
            client-side.
          </li>
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
            <a href="/conversiontools/timeConversion">Time converter</a>
          </li>
          <li>
            <a href="/conversiontools/temperatureConversion">
              Temperature converter
            </a>
          </li>
          <li>
            <a href="/json/json-formatter">JSON formatter</a>
          </li>
        </ul>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ConversionTool;
