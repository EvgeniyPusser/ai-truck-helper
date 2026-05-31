import React from "react";
import LandingGnomePage from "./LandingGnomePage";
import LandingStoryPage from "./LandingStoryPage";

export const LANDING_VARIANT = "gnome";

const LandingPage = () => {
  return LANDING_VARIANT === "gnome" ? <LandingGnomePage /> : <LandingStoryPage />;
};

export default LandingPage;
