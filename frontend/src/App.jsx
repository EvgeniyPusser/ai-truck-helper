import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HelperPage from "./pages/HelperPage";
import CompanyPage from "./pages/CompanyPage";
import TruckPage from "./pages/TruckPage";
import DriverPage from "./pages/DriverPage";
import AgentPage from "./pages/AgentPage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/helper" element={<HelperPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/truck" element={<TruckPage />} />
          <Route path="/driver" element={<DriverPage />} />
          <Route path="/agent" element={<AgentPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
