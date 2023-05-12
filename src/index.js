import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./tailwind.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <Router>
      <App />
    </Router>
  </RecoilRoot>
);
