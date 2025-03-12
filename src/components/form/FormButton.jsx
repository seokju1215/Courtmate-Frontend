import React from "react";
import styled from "styled-components";

const Button = styled.button`
  max-width : 500px;
  width: 100%;
  padding: 12px;
  background-color: #f2821f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
`;

const FormButton = ({ text, onClick }) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export default FormButton;