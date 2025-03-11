import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useResponsive from "./hooks/useResponsive.js";


import DesktopMainPage from "./pages/desktop/MainPage.jsx";
import DesktopFormPage from "./pages/desktop/FormPage.jsx";
import MobileMainPage from "./pages/mobile/Mainpage.jsx";
import MobileFormPage from "./pages/mobile/Formpage.jsx";


const App = () => {
  const isMobile = useResponsive();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <DesktopMainPage />}
        />
        <Route
          path="/form"
          element={isMobile ? <MobileFormPage /> : <DesktopFormPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;