import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useResponsive from "./hooks/useResponsive.js";


import DesktopMainPage from "./pages/desktop/MainPage.jsx";
import FormPage from "./pages/desktop/FormPage.jsx";


const App = () => {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={ <DesktopMainPage />}
        />
        <Route
          path="/form/:courtId/:matchId"
          element={ <FormPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;