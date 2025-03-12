import React from "react";
import styled from "styled-components";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width : 500px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const FormInput = ({ label, type, name, value, onChange }) => {
  return (
    <InputWrapper>
      <Label>{label}</Label>
      <Input type={type} name = {name} value={value} onChange={onChange} />
    </InputWrapper>
  );
};

export default FormInput;