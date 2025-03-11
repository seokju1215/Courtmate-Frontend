import React, { useState } from "react";
import DesktopLayout from "../../layout/DesktopLayout";
import Header from "../../components/common/Header.jsx";
import DesktopDateNav from "../../components/desktop/DesktopDateNave.jsx";
import MatchList from "../../components/common/MatchList.jsx";

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState("2025-03-20"); // 기본값

  return (
    <DesktopLayout>
      <Header />
      <DesktopDateNav selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <MatchList selectedDate={selectedDate} />
    </DesktopLayout>
  );
};

export default MainPage;