// main.jsx or App.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../src/index.css"
import { TestimonialProvider } from "./context/TestimonialContext";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TestimonialProvider>   
      <App />
    </TestimonialProvider>
  </React.StrictMode>
);
