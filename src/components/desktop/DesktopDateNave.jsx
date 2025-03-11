import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { formatDateWithDay } from "../../utils/dateUtils";
import { dates } from "../../utils/dates";
import useTodayDate from "../../hooks/useTodayDate"; // ✅ 오늘 날짜 가져오는 훅 추가

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
  min-height: 50px;
  margin: 0 auto 10px auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
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
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
`;

const DesktopDateNav = ({ selectedDate, onSelectDate }) => {
  const sliderRef = useRef(null);
  const today = useTodayDate(); // ✅ 오늘 날짜 가져오기
  const [filteredDates, setFilteredDates] = useState([]);

  useEffect(() => {
    if (today) {
      // ✅ 오늘 날짜 이후만 필터링
      const validDates = dates.filter((date) => date >= today);
      setFilteredDates(validDates);
      onSelectDate(today); // ✅ 처음 선택된 날짜를 오늘로 설정
    }
  }, [today, onSelectDate]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 125;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 125;
    }
  };

  return (
    <NavContainer>
      <ArrowButton onClick={scrollLeft}>◀️</ArrowButton>
      <DateSlider ref={sliderRef}>
        {filteredDates.map((date) => {
          const [fullDate, day] = formatDateWithDay(date).split("\n"); // ✅ 날짜와 요일 분리
          return (
            <DateButton
              key={date}
              selected={selectedDate === date}
              onClick={() => onSelectDate(date)}
            >
              <span>{fullDate}</span>
              <span style={{ fontSize: "15px", color: "#666" }}>{day}</span> {/* ✅ 요일 스타일 적용 */}
            </DateButton>
          );
        })}
      </DateSlider>
      <ArrowButton onClick={scrollRight}>▶️</ArrowButton>
    </NavContainer>
  );
};

export default DesktopDateNav;