import styled from "styled-components";

const StyledContainer = styled.div`
  max-width: ${(props) => props.maxWidth || "1113px"};
  margin: 0 auto;
  height: 100%;
`;

export default StyledContainer;
