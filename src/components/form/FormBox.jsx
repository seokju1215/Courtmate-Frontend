import React from "react";
import styled from "styled-components";

const BoxContainer = styled.div`
border-radius: 10px;
background-color : #FFFF;
padding : 10px;
`

const FormBox = ({ children }) => {
    return (
        <BoxContainer>{children}</BoxContainer>
    );
  };

export default FormBox;
  