import React, { useState } from "react";
import styled from "styled-components";

const dates = ["2025-03-20", "2025-03-21", "2025-03-22", "2025-03-23"];

const SliderContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  background-color: white;
  position: sticky;
  top: 60px;
  z-index: 99;
  border-bottom: 1px solid #ddd;
  scroll-snap-type: x mandatory;
  white-space: nowrap;
`;

const DateButton = styled.button`
  flex: 0 0 auto;
  padding: 10px 15px;
  font-size: 16px;
  background: ${(props) => (props.selected ? "#007bff" : "transparent")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 8px;
  cursor: pointer;
  margin: 0 5px;
  scroll-snap-align: center;
`;

const MobileDateSlider = ({ selectedDate, onSelectDate }) => {
  return (
    <SliderContainer>
      {dates.map((date) => (
        <DateButton
          key={date}
          selected={selectedDate === date}
          onClick={() => onSelectDate(date)}
        >
          {date}
        </DateButton>
      ))}
    </SliderContainer>
  );
};

export default MobileDateSlider;