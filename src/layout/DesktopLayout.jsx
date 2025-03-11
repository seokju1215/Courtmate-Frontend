import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw; 
  align-items: center;
  display: flex; 
  flex-direction: column; 
  padding-top : 80px;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  min-width: 320px;
  height: auto;
  padding: 20px;
  background: white;
  margin: 0 auto
  flex-grow: 1; 
`;

const DesktopLayout = ({ children }) => {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
};

export default DesktopLayout;