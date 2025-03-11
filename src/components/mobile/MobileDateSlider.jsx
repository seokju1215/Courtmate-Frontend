import React, { useRef, useEffect } from "react";
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
  cursor: grab;

  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
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
  }

  span {
    font-size: 15px;
    color: #666;
  }
`;

const MobileDateSlider = ({ selectedDate, onSelectDate }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const startTouchX = useRef(0);
  const startScrollLeft = useRef(0);

  useEffect(() => {
    if (sliderRef.current) {
      const selectedElement = sliderRef.current.querySelector(".selected");
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [selectedDate]);

  // 마우스 드래그 핸들러
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.scrollBehavior = "auto"; 
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    sliderRef.current.style.scrollBehavior = "smooth";
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    startTouchX.current = e.touches[0].clientX;
    startScrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const moveX = touchX - startTouchX.current;
    sliderRef.current.scrollLeft = startScrollLeft.current - moveX;
  };

  return (
    <SliderContainer
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}  // ✅ 터치 시작
      onTouchMove={handleTouchMove}    // ✅ 터치 이동
      onTouchEnd={handleMouseUp}       // ✅ 터치 끝
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
            <span>{day}</span>
          </DateButton>
        );
      })}
    </SliderContainer>
  );
};

export default MobileDateSlider;