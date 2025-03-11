import React, { useState } from "react";
import DesktopLayout from "../../layout/DesktopLayout";
import useTodayDate from "../../hooks/useTodayDate"; 
import Header from "../../components/common/Header.jsx";
import DesktopDateNav from "../../components/desktop/DesktopDateNave.jsx";
import MatchList from "../../components/common/MatchList.jsx";

const MainPage = () => {
  const today = useTodayDate();
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <DesktopLayout>
      <Header />
      <DesktopDateNav selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <MatchList selectedDate={selectedDate} />
    </DesktopLayout>
  );
};

export default MainPage;