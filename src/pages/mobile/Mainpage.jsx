import React, { useState } from "react";
import MobileLayout from "../../layout/MobileLayout";
import Header from "../../components/common/Header";
import MobileDateSlider from "../../components/mobile/MobileDateSlider";
import MatchList from "../../components/common/MatchList";

const MainPage = () => {
  const today = useTodayDate();
  const [selectedDate, setSelectedDate] = useState("2025-03-20");

  return (
    <MobileLayout>
      <Header />
      <MobileDateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <MatchList selectedDate={selectedDate} />
    </MobileLayout>
  );
};

export default MainPage;