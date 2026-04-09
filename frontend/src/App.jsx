import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
  <Route path="/result" element={<ResultPage />} />
        </Routes>
  );
}

export default App;
