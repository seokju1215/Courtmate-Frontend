import React from "react";
import styled from "styled-components";

const Button = styled.button`
  max-width : 500px;
  width: 100%;
  padding: 12px;
  background-color: ${(props) => (props.disabled ? "#ddd" : "#f2821f")};
  color: ${(props) => (props.disabled ? "#888" : "white")};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: bold;
`;

const FormButton = ({ text, onClick }) => {
  return <Button onClick={onClick}>{text}</Button>;
};

export default FormButton;