import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { formatDateWithDay } from "../../utils/dateUtils";
import { dates } from "../../utils/dates";
import useTodayDate from "../../hooks/useTodayDate"; 
import useResponsive from "../../hooks/useResponsive"; // ✅ 반응형 체크 훅 사용

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 90%;
  padding: 20px 0;
  background-color: white;
  position: sticky;
  top: 10px;
  z-index: 99;
  border-bottom: 1px solid #ddd;
  min-height: 40px;
  margin: 0 auto 10px auto;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;

  @media (max-width: 768px) { 
    display: none; /* ✅ 모바일에서는 화살표 버튼 숨김 */
  }
`;

const DateSlider = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  white-space: nowrap;
  padding: 0 10px;
  max-width: 90%;
  -webkit-overflow-scrolling: touch; 

  &::-webkit-scrollbar {
    display: none; /* 
  }

  scrollbar-width: none; /* 
`;

const DateButton = styled.button`
  flex: 0 0 auto;
  padding: 10px 15px;
  font-size: 16px;
  background: ${(props) => (props.selected ? "#F2821F" : "transparent")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 8px;
  cursor: pointer;
  margin: 0 5px;
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  border : none;
`;

const DesktopDateNav = ({ selectedDate, onSelectDate }) => {
  const sliderRef = useRef(null);
  const today = useTodayDate(); 
  const isMobile = useResponsive(); // ✅ 반응형 체크 (768px 이하인지 확인)
  const [filteredDates, setFilteredDates] = useState([]);

  useEffect(() => {
    if (today) {
      const validDates = dates.filter((date) => date >= today);
      setFilteredDates(validDates);
      onSelectDate(today);
    }
  }, [today, onSelectDate]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 135;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 135;
    }
  };

  return (
    <NavContainer>
      {!isMobile && <ArrowButton onClick={scrollLeft}>◀️</ArrowButton>}
      <DateSlider ref={sliderRef}>
        {filteredDates.map((date) => {
          const [fullDate, day] = formatDateWithDay(date).split("\n"); 
          return (
            <DateButton
              key={date}
              selected={selectedDate === date}
              onClick={() => onSelectDate(date)}
            >
              <span>{fullDate}</span>
              <span style={{ fontSize: "15px", color: "#666" }}>{day}</span> 
            </DateButton>
          );
        })}
      </DateSlider>
      {!isMobile && <ArrowButton onClick={scrollRight}>▶</ArrowButton>}
    </NavContainer>
  );
};

export default DesktopDateNav;