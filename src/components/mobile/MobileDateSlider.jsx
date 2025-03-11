import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { formatDateWithDay } from "../../utils/dateUtils";
import { dates } from "../../utils/dates";

const SliderContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  background-color: white;
  position: sticky;
  top: 80px;
  z-index: 99;
  border-bottom: 1px solid #ddd;
  scroll-snap-type: x mandatory;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch; 
  cursor: grab; /* ✅ 기본 커서를 grab으로 설정 */

  &::-webkit-scrollbar {
    display: none; /* ✅ 스크롤바 숨김 */
  }

  &:active {
    cursor: grabbing; /* ✅ 드래그 중일 때 커서 변경 */
  }
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
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #007bff;
    color: white;

    span {
      color: white; /* ✅ hover 시 날짜와 요일 흰색 */
    }
  }
`;

const MobileDateSlider = ({ selectedDate, onSelectDate }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (sliderRef.current) {
      // ✅ 선택된 날짜가 보이도록 자동 스크롤
      const selectedElement = sliderRef.current.querySelector(".selected");
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [selectedDate]);

  // ✅ 마우스로 드래그 가능하도록 이벤트 핸들러 추가
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.scrollBehavior = "auto"; // 드래그 중에는 부드러운 스크롤 제거
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // 이동 거리 조정
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    sliderRef.current.style.scrollBehavior = "smooth"; // 드래그가 끝나면 부드러운 스크롤 활성화
  };

  return (
    <SliderContainer
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {dates.map((date) => {
        const [fullDate, day] = formatDateWithDay(date).split("\n");
        return (
          <DateButton
            key={date}
            selected={selectedDate === date}
            onClick={() => onSelectDate(date)}
            className={selectedDate === date ? "selected" : ""}
          >
            <span>{fullDate}</span>
            <span style={{ fontSize: "15px", color: "#666" }}>{day}</span>
          </DateButton>
        );
      })}
    </SliderContainer>
  );
};

export default MobileDateSlider;