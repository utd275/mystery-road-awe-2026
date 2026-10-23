import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("react-root");

if (!rootElement) {
  throw new Error("Could not find React root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);