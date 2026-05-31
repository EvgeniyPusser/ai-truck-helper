import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LandingGnomePage from "./pages/LandingGnomePage";
import LandingStoryPage from "./pages/LandingStoryPage";
import QuotePage from "./pages/QuotePage";
import ResultPage from "./pages/ResultPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing-story" element={<LandingStoryPage />} />
      <Route path="/landing-gnome" element={<LandingGnomePage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
    </Routes>
  );
}

export default App;
