import AiToolComp from '@/components/aiTool';
import AiTool from '@/dbTools/AiTools';
import HeaderNav from '@/components/HeaderNav';
import Footer from '@/components/Footer/Footer';
export default function AiToolPage({ page }) {
  return (
    <>
      <HeaderNav />
      <AiToolComp page={page} />
      <Footer />
    </>
  );
}

export function getStaticPaths() {
  const pathArray = AiTool.map((tool) => {
    return { params: { toolname: tool.type } };
  });
  return {
    paths: pathArray,
    fallback: false,
  };
}

export function getStaticProps(ctx) {
  const currentPage = ctx.params.toolname;

  return {
    props: { page: AiTool.find((tool) => tool.type === currentPage) },
  };
}

// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import AiTool from '@/dbTools/AiTools';
// import { useEffect, useState } from 'react';
// export default function AiToolComp({ page }) {
//   const { id } = page;
//   //

//   const [formData, setFormData] = useState('');
//   const [result, setResult] = useState();
//   const [apiParamEndPoint, setapiParamEndPoint] = useState('');
//   const [buttonLoading, setbuttonLoading] = useState(false);
//   const [selectedItem, setselectedItem] = useState('');
//   const [disableBtn, setDisableBtn] = useState(true);
//   const [characterLength, setCharacterLength] = useState('');

//   console.log('curren item ', selectedItem);
//   useEffect(() => {
//     if (selectedItem) {
//       if (
//         selectedItem.title !== 'Q & A' &&
//         selectedItem.title !== 'Movie To Emoji' &&
//         selectedItem.title !== 'Interview Questions' &&
//         selectedItem.title !== 'Essay Outline' &&
//         selectedItem.title !== 'Explain Code' &&
//         selectedItem.title !== 'Micro Horror Story' &&
//         selectedItem.title !== 'Factual Answering' &&
//         selectedItem.title !== 'Javascript Helper Chatbot' &&
//         selectedItem.title !== 'Science Fiction Books List Maker' &&
//         selectedItem.title !== 'ML/AI Language Model Tutor' &&
//         selectedItem.title !== 'VR Fitness Idea Generator'
//       ) {
//         setCharacterLength('(Max 250 characters)');
//       }
//     }
//   }, [selectedItem]);

//   useEffect(() => {
//     if (formData) {
//       setDisableBtn(false);
//     } else {
//       setDisableBtn(true);
//     }
//   }, [formData]);

//   console.log(selectedItem);
//   function changeHandler(e) {
//     if (page.title === 'Explain Code') {
//       setFormData(e.target.value);
//     } else if (page.title === 'Python Bug Fixer') {
//       setFormData(e.target.value);
//     } else if (page.title === 'Python To Natural Language') {
//       setFormData(e.target.value);
//     } else if (page.title === 'JavaScript To Python') {
//       setFormData(e.target.value);
//     } else if (page.title === 'Calculate Time Complexity') {
//       setFormData(e.target.value);
//     } else if (page.title === 'Science Fiction Books List Maker') {
//       let inp = e.target.value.replace(
//         /[abcdefghijklmnopqrstuvwxyz/.,!@#$%^&*()}{_+|"}]/gi,
//         ''
//       );
//       if (Number(inp) <= 5) {
//         setFormData(inp.trim());
//       } else {
//         setFormData('5');
//       }
//     } else if (page.title === 'VR fitness Idea Generator') {
//       let inp = e.target.value.replace(
//         /[abcdefghijklmnopqrstuvwxyz/.,!@#$%^&*()}{_+|"}]/gi,
//         ''
//       );
//       if (Number(inp) <= 5) {
//         setFormData(inp.trim());
//       } else {
//         setFormData('5');
//       }

//       console.log(formData);
//     } else {
//       if (e.target.value.trim().length > 0) {
//         // let inp = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
//         let inp = e.target.value.replace(/[/!@#$%^&*()}{_>?+|"}<]/g, '');
//         // inp = inp.replace(/[0-9]/g, '')
//         if (inp === '.') {
//           setFormData('');
//         } else {
//           setFormData(inp);
//         }
//       } else {
//         setFormData(e.target.value.trim());
//       }
//     }
//   }

//   // let pageTitle = id.replace(/[A-Z]/g, ' $&').trim();
//   // const formattedPageTitle = pageTitle[0].toUpperCase() + pageTitle.slice(1);
//   // console.log(formattedPageTitle);
//   useEffect(() => {
//     if (selectedItem) {
//       if (selectedItem.title !== 'Q & A') {
//         setCharacterLength('max character length 250');
//       }
//     }
//     console.log('use effect selected item ', page.title);

//     if (id == 'correction') {
//       setapiParamEndPoint('grammerCorrection');
//     } else if (id == 'qa') {
//       setapiParamEndPoint('questionAnswer');
//     } else if (id == 'summarize') {
//       setapiParamEndPoint('summarizeContent');
//     } else if (id == 'languageConvertion') {
//       setapiParamEndPoint('languageConvertion');
//     } else if (id == 'unstructuredData') {
//       setapiParamEndPoint('unstructuredData');
//     } else if (id == 'movieEmoji') {
//       setapiParamEndPoint('movieEmoji');
//     } else if (id == 'keywordsExtract') {
//       setapiParamEndPoint('keywordsExtract');
//     } else if (id == 'friendChat') {
//       setapiParamEndPoint('friendChat');
//     } else if (id === 'studyNotes') {
//       setapiParamEndPoint('studyNotes');
//     } else if (id === 'interviewQuestions') {
//       setapiParamEndPoint('interviewQuestions');
//     } else if (id === 'chatWithAi') {
//       setapiParamEndPoint('chatWithAi');
//     } else if (id === 'turnByTurnDirections') {
//       setapiParamEndPoint('turnByTurnDirections');
//     } else if (id === 'essayOutline') {
//       setapiParamEndPoint('essayOutline');
//     } else if (id === 'notesToSummary') {
//       setapiParamEndPoint('notesToSummary');
//     } else if (id === 'analogyMaker') {
//       setapiParamEndPoint('analogyMaker');
//     } else if (id === 'classification') {
//       setapiParamEndPoint('classification');
//     } else if (id === 'thirdPersonConverter') {
//       setapiParamEndPoint('thirdPersonConverter');
//     } else if (id === 'explainCode') {
//       setapiParamEndPoint('explainCode');
//     } else if (id === 'tweetSentimentClassifie') {
//       setapiParamEndPoint('tweetSentimentClassifie');
//     } else if (id === 'recipeMakerByIngredients') {
//       setapiParamEndPoint('recipeMakerByIngredients');
//     } else if (id === 'microHorrorStoryMaker') {
//       setapiParamEndPoint('microHorrorStoryMaker');
//     } else if (id === 'pythonToNaturalLanguage') {
//       setapiParamEndPoint('pythonToNaturalLanguage');
//     } else if (id === 'factualAnswering') {
//       setapiParamEndPoint('factualAnswering');
//     } else if (id === 'javascriptHelperChatbot') {
//       setapiParamEndPoint('javascriptHelperChatbot');
//     } else if (id === 'scienceFictionbooksListMaker') {
//       setapiParamEndPoint('scienceFictionbooksListMaker');
//     } else if (id === 'textDescriptionToColor') {
//       setapiParamEndPoint('textDescriptionToColor');
//     } else if (id === 'javascriptToPython') {
//       setapiParamEndPoint('javascriptToPython');
//     } else if (id === 'javascriptOneLinerFunctionConverter') {
//       setapiParamEndPoint('javascriptOneLinerFunctionConverter');
//     } else if (id === 'tldrSummarization') {
//       setapiParamEndPoint('tldrSummarization');
//     } else if (id === 'adFromProductDescription') {
//       setapiParamEndPoint('adFromProductDescription');
//     } else if (id === 'esrbTextRating') {
//       setapiParamEndPoint('esrbTextRating');
//     } else if (id === 'marvTheSarcasticChatbot') {
//       setapiParamEndPoint('marvTheSarcasticChatbot');
//     } else if (id === 'calculateTimeComplexity') {
//       setapiParamEndPoint('calculateTimeComplexity');
//     } else if (id === 'pythonBugfixer') {
//       setapiParamEndPoint('pythonBugfixer');
//     } else if (id === 'createSqlQueries') {
//       setapiParamEndPoint('createSqlQueries');
//     } else if (id === 'mlAiLanguageModelTutor') {
//       setapiParamEndPoint('mlAiLanguageModelTutor');
//     } else if (id === 'extractContactInformation') {
//       setapiParamEndPoint('extractContactInformation');
//     } else if (id === 'restaurantReviewCreator') {
//       setapiParamEndPoint('restaurantReviewCreator');
//     } else if (id === 'writePythonDocString') {
//       setapiParamEndPoint('writePythonDocString');
//     } else if (id === 'airportCodeExtractor') {
//       setapiParamEndPoint('airportCodeExtractor');
//     } else if (id === 'vrFitnessIdeaGenerator') {
//       setapiParamEndPoint('vrFitnessIdeaGenerator');
//     } else if (id === 'currencyExchange') {
//       setapiParamEndPoint('currencyExchange');
//     }
//     const findCurrentItem = AiTool.find((item) => item.type === id);
//     setselectedItem(findCurrentItem);
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setbuttonLoading(true);
//     setDisableBtn(true);
//     // https://sturdayapp.herokuapp.com

//     try {
//       const response = await fetch(
//         `http://localhost:4000/api/${apiParamEndPoint}`,

//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ inputText: formData }),
//         }
//       );
//       const data = await response.json();

//       console.log('res is ', data);
//       if (data.result) {
//         if (selectedItem.title === 'Explain Code') {
//           const res = data.result.replace(/[0123456789.]/g, '');
//           setResult(res);
//         } else if (selectedItem.title === 'Summarization') {
//           console.log('come inside ');
//           const res = data.result.replace(/[:@#$%^&*()_.]/g, '');
//           console.log(data.result, '  resuklt');
//           setResult(res);
//         } else {
//           setResult(data.result);
//         }
//       } else {
//         setResult('Unknown');
//       }

//       setbuttonLoading(false);
//       setDisableBtn(false);
//       // setFormData("");
//     } catch (err) {
//       setbuttonLoading(false);
//       alert('ERROR: Unable to parse JSON');
//     }
//   };

//   //

//   console.log(page);
//   return (
//     <>
//       <Head>
//         <title> {page.title} </title>
//       </Head>

//       {/*  */}
//       <div>
//         <div>
//           <div
//             className='tools-for-better-thinking'
//             // style={{ padding: "5rem 0px 5rem 0px" }}
//           >
//             <div
//             // className="container"
//             >
//               <div className='ai_tools_heading'>
//                 <h1>{page.title}</h1>
//               </div>
//               <div className='ai_tools_description'>
//                 <p>{page.desc}</p>
//               </div>
//               <label className='my-1 mr-2'></label>
//               <div
//                 className='inp-out-container'
//                 style={{}}
//               >
//                 <div className='inp-container'>
//                   <h2>Type Text Here {characterLength}</h2>
//                   <form onSubmit={handleSubmit}>
//                     <div className='form-group text-area-container'>
//                       <textarea
//                         maxLength={250}
//                         placeholder={page.desc + '...'}
//                         className='form-control inp-textarea'
//                         // rows="8"
//                         id='input-comment'
//                         value={formData}
//                         onChange={changeHandler}
//                         style={{ fontSize: '1.5rem', minHeight: '195px' }}
//                       ></textarea>
//                     </div>
//                     {/* <button */}
//                     {/* // btn btn-primary btn-block w-100 p-3 mt-4  */}
//                     {/* className="sub-btn"
//                       style={{ fontSize: "16px" }}
//                       disabled={formData == ""}
//                     >
//                       {buttonLoading ? (
//                         <div class="spinner-border text-dark" role="status">
//                           <span class="sr-only">Loading...</span>
//                         </div>
//                       ) : (
//                         "Submit"
//                       )}
//                     </button> */}

//                     <button
//                       className={`styled-btn ${
//                         disableBtn ? 'btn-disable' : ''
//                       }`}
//                       disabled={`${disableBtn ? 'true' : ''}`}
//                       type='submit'
//                     >
//                       {buttonLoading ? (
//                         <div
//                           class='spinner-border text-dark'
//                           role='status'
//                         >
//                           <span class='sr-only'>Loading...</span>
//                         </div>
//                       ) : (
//                         'Submit'
//                       )}
//                     </button>
//                   </form>
//                 </div>

//                 <div className=' ai-tools-results-container'>
//                   <h2>Output</h2>
//                   <div className='ai-tools-results'>
//                     {result?.split('\n').map((data) => (
//                       <div className=''>{data}</div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/*  */}
//     </>
//   );
// }

// export function getStaticPaths() {
//   const pathArray = AiTool.map((tool) => {
//     return { params: { toolname: tool.type } };
//   });
//   return {
//     paths: pathArray,
//     fallback: false,
//   };
// }

// export function getStaticProps(ctx) {
//   const currentPage = ctx.params.toolname;

//   return {
//     props: { page: AiTool.find((tool) => tool.type === currentPage) },
//   };
// }
