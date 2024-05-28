import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CurrentSearchProvider } from "./contexts/currentSearchData.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrentSearchProvider>
        <App />
      </CurrentSearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
