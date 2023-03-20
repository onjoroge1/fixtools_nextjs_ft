import styled from 'styled-components';
import { footerFonts } from '../GlobalsStyles/GlobalsStyles';

const StyledConversionTool = styled.div`
  margin-top: 10px;
  margin-bottom: 60px;
  min-height: 500px;
  .conversion-tools-container {
    min-height: 500px;
    form {
      padding: 0 4px;
      .text {
        /* background-color: magenta; */
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .main-heading {
          /* background-color: red; */
          padding-bottom: 40px;
          font-weight: 900;
          color: #212529;
          font-size: 60px;
          /* background-color: red; */
          text-align: center;
          max-width: 800px;
          text-align: center;
        }
        .tag-line {
          text-align: center;
          /* background-color: green; */
          max-width: 800px;
          text-align: start;
          font-size: 20px;
          font-weight: 600;
        }
      }
      .select-container {
        /* background-color: blue; */
        /* display: flex;
        flex-direction: column; */

        select {
          width: 90%;
          height: 50px;
          font-size: 20px;
          font-family: ${footerFonts};
          border: none;
          margin-top: 10px;
          border-radius: 3px;
          background-color: wheat;
          background-color: whitesmoke;
          width: 100%;
        }
        .from-to {
          /* background-color: red; */
          margin: 30px 0px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 20px;
          @media screen and (max-width: 500px) {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      }
      .time-selector-inputs-container {
        margin-top: 50px;
        /* background-color: red; */

        .time-input-cnt {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          input {
            width: 100%;
            font-size: 35px;
            font-weight: 400;
            border: 1px solid #d3d3d3;
            padding: 16px 8px;
            border-radius: 3px;
          }

          .time-format {
            /* background-color: pink; */
            font-size: 40px;
            font-weight: 900;
            display: flex;
            align-items: center;
            @media screen and (max-width: 330px) {
              display: none;
            }
          }
        }
      }
      button {
        /* background-color: royalblue; */
        border: none;
        padding: 4px 16px;
        margin-top: 30px;
        color: #0a171c;
        border: 1px solid #0a171c;
        font-weight: 600;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          background-color: #0a171c;
          color: white;
        }
      }
      .btn-disable {
        background-color: #d3d3d3;
        border: none;
        color: gray;
        &:hover {
          background-color: #d3d3d3;
          color: gray;
        }
      }
      // .button-container {
      //   margin-top: 30px;
      //   /* background-color: red; */

      //   @media screen and (max-width: 330px) {
      //     display: flex;
      //     justify-content: center;
      //   }
      //   button {
      //     /* max-width: 300px; */
      //     max-width: 170px;
      //     width: 100%;
      //     border: none;
      //     background-color: royalblue;
      //     padding: 8px 8px;
      //     border-radius: 3px;
      //     color: white;
      //     font-size: 20px;
      //     font-weight: 600;
      //   }
      //   .disable-btn {
      //     background-color: #d3d3d3;
      //   }
      }
    }
    .result-container {
      /* background-color: red; */
      margin-top: 20px;
      display: flex;
      justify-content: center;
      .result {
        h1{
          font-size:20px;
          font-family: ${footerFonts};
          color:#8e8e8e;
        }
        background-color: whitesmoke;
        min-height: 400px;
        width: 100%;
        margin-top: 30px;
        font-size: 40px;
        min-height: 150px;
  
        padding: 25px 30px 25px 10px;
        padding: 0.375rem 0.75rem;
        border-radius: 3px;
        font-weight: 700;
        color: #212529;
        font-size: 30px;
      }
    }
  }
`;

const StyledFlexContainer = styled.div`
  /* background-color: red;
  display: flex;
  justify-content: space-between;
  align-items: center; */
`;

export { StyledConversionTool, StyledFlexContainer };
