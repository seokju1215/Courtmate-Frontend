import { useState, useEffect } from "react";

const useTodayDate = () => {
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0]; 
    setTodayDate(formattedToday);
  }, []);

  return todayDate;
};

export default useTodayDate;