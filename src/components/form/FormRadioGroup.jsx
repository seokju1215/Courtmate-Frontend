import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 20px;
  max-width : 500px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const RadioWrapper = styled.div`
  margin-top : 10px;
  display: flex;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const FormRadioGroup = ({ label, options, selected,name, onChange }) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <RadioWrapper>
        {options.map((option) => (
          <label key={option.value} style={{display : "flex" ,flex : "1"}}>
            <RadioInput
              type="radio"
              name = {name}
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => onChange(e)}
            />
            {option.label}
          </label>
        ))}
      </RadioWrapper>
    </Wrapper>
  );
};

export default FormRadioGroup;