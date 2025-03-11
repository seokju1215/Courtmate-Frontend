import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw; 
  align-items: center;
  display: flex; 
  flex-direction: column; 
  padding-top : 90px;
`;

const Container = styled.div`
  width: 90%;
  min-width : 320px;
  height: auto;
  padding: 20px;
  background: white;
  margin: 0 auto;
  flex-grow: 1; 
`;

const MobileLayout = ({ children }) => {
  return (
  <Wrapper>
    <Container>{children}</Container>
  </Wrapper>
  );
};

export default MobileLayout;