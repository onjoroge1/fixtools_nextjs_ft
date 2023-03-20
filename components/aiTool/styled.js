import styled from 'styled-components';

const StyledAIToolsFormatter = styled.div`
  padding: 0px 8px;
  .inp-out-container {
    //  background-color: red;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;

    @media screen and (max-width: 950px) {
      flex-direction: column;
    }
    .inp-container {
      width: 100%;
      h2 {
        margin-bottom: 10px;
        font-size: 2rem;
        font-weight: 500;
      }
    }
  }

  .text-area-container {
    /* padding: 4px; */
    textarea {
      padding: 16px;
      &::placeholder {
        color: #c5c5c5;
        font-size: 17px;
        // padding: 20px  4px;
      }
    }
  }
  // button {
  //   /* background-color: red !important; */
  //   font-weight: 600;
  //   font-size: 20px !important;
  // }
  button {
    /* background-color: royalblue; */
    border: none;
    padding: 6px 16px;
    margin-top: 15px;
    color: #0a171c;
    border: 1px solid #0a171c;
    font-weight: 600;
    border-radius: 3px;
    cursor: pointer;
    min-width: 100px;

    &:hover {
      background-color: #0a171c;
      color: white;
    }
    margin-bottom: 5rem;

    @media screen and (max-width: 500px) {
      margin-bottom: 2rem;
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
  .ai-tools-results-container {
    width: 100%;
    h2 {
      margin-bottom: 10px;
      font-size: 2rem;
      font-weight: 500;
    }
  }
  .ai-tools-results {
    border: 1px solid #ced4da;
    width: 100%;
    background-color: white;
    // background-color:red;
    // max-height: 195px;
    // height:190px;
    padding: 16px;
    overflow-y: scroll;

    word-wrap: break-word;
    @media screen and (max-width: 500px) {
      max-width: 750px;
      margin-right: 4px;
    }
  }
`;

export { StyledAIToolsFormatter };
