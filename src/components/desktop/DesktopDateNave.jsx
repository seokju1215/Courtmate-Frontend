import React, { useRef } from "react";
import styled from "styled-components";

const dates = ["2025-03-18", "2025-03-19", "2025-03-20", "2025-03-21", "2025-03-22", "2025-03-23", "2025-03-24"];

const NavContainer = styled.div`
  display: flex;
  justify-content: center; /* ✅ 가로 중앙 정렬 */
  align-items: flex-start; /* ✅ 세로 정렬 없음 */
  width: 100%;
  max-width: 90%;
  padding: 10px 0;
  background-color: white;
  position: sticky;
  top: 10px;
  z-index: 99;
  border-bottom: 1px solid #ddd;
  min-height: 50px;
  margin: 0 auto 10px auto; /* ✅ 가로 중앙 정렬을 위한 margin */
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
`;

const DateSlider = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  white-space: nowrap;
  padding: 0 10px;
  max-width: 90%;
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

const DesktopDateNav = ({ selectedDate, onSelectDate }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 100;
    }
  };

  return (
    <NavContainer>
      <ArrowButton onClick={scrollLeft}>◀️</ArrowButton>
      <DateSlider ref={sliderRef}>
        {dates.map((date) => (
          <DateButton
            key={date}
            selected={selectedDate === date}
            onClick={() => onSelectDate(date)}
          >
            {date}
          </DateButton>
        ))}
      </DateSlider>
      <ArrowButton onClick={scrollRight}>▶️</ArrowButton>
    </NavContainer>
  );
};

export default DesktopDateNav;