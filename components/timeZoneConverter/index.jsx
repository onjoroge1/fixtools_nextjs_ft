import React, { useState, useEffect } from 'react';
// import HeaderNav from '../../components/common/HeaderNav';
// import Footer from '../../components/home/Footer/Footer';
import { StyledConversionTool, StyledFlexContainer } from './styled';
// import StyledContainer from '../../components/StyledContainer';
import StyledContainer from '../StyledContainer';

import { hoursArr, minutesArr, timeZoneData } from './timeZoneData';
import timeZoneFunction from './timeZoneFunctionalities';

// import SEO from '../../components/SEO';
// import conversionToolsDb from '../../dbTool/conversionToolsDb';
// import { useLocation } from 'react-router-dom';
// import { GetCurrentPageContent } from '../../utils';

const TimeZoneConverter = () => {
  const [formData, setFormData] = useState({
    convertFrom: '',
    convertTo: '',
    time: '',
    amPm: 'am/pm',
  });
  const [result, setResult] = useState('');

  // const location = useLocation();
  // const path = location.pathname;
  // const { title, desc, image } = GetCurrentPageContent(path, conversionToolsDb);
  // const pageUrl = window.location.href;

  const { amPm, convertFrom, convertTo, time } = formData;

  const hours = time.split(':')[0];
  const minutes = time.split(':')[1];

  useEffect(() => {
    // document.title = 'Time Zone Conversion';
    console.log(hours);
    const date = new Date();
    date.setHours(hours);
    const convention = date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: 'true',
        minute: 'numeric',
      })
      .split(' ')[1];
    // console.log("bahubaki", convention);
    if (hours) {
      setFormData((prevState) => {
        return { ...prevState, amPm: convention };
      });
    }
  }, [hours]);

  const changeHandler = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const date = new Date();
    console.log(hours);
    date.setHours(timeZoneFunction(convertFrom, convertTo, hours));
    // console.log(Number(hours) - 1);
    date.setMinutes(minutes);
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
    // console.log(time);
    setResult(time);
  };

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
                <h1 className='main-heading'>Time Zone Conversion</h1>
                <p className='tag-line'>Convert time zone.</p>
              </div>
              <StyledFlexContainer>
                <div className='select-container'>
                  <div className='from-to'>
                    <div className='from'>
                      <select
                        id='convertFrom'
                        value={convertFrom}
                        onChange={changeHandler}
                      >
                        <option
                          value=''
                          disabled
                          selected
                        >
                          Convert From
                        </option>
                        {timeZoneData.map((data) => (
                          <option>{data}</option>
                        ))}
                      </select>
                    </div>
                    <div className='to'>
                      <select
                        id='convertTo'
                        value={convertTo}
                        onChange={changeHandler}
                      >
                        <option
                          value=''
                          disabled
                          selected
                        >
                          Convert To
                        </option>
                        {timeZoneData.map((data) => (
                          <option>{data}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className='time-selector-inputs-container'>
                  <div className='time-input-cnt'>
                    <input
                      type='time'
                      id='time'
                      onChange={changeHandler}
                      value={time}
                    />
                    <div className='time-format'>{amPm}</div>
                  </div>
                </div>
              </StyledFlexContainer>
              <div className='button-container'>
                <button
                  className={`${
                    convertFrom && convertTo && hours && minutes
                      ? ''
                      : 'btn-disable'
                  }`}
                  disabled={`${
                    convertFrom && convertTo && hours && minutes ? '' : 'true'
                  }`}
                  type='submit'
                >
                  Convert
                </button>
              </div>
            </form>
            <div className='result-container'>
              <div className='result'>
                <h1>Output</h1>
                <div>{result}</div> {`${result ? convertTo : ''}`}
              </div>
            </div>
          </StyledContainer>
        </div>
      </StyledConversionTool>
      {/* <Footer /> */}
    </>
  );
};

export default TimeZoneConverter;
