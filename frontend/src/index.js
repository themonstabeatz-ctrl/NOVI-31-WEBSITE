import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { API_BASE } from "./config/api";

// ✅ RUNTIME GUARD: Fail hard if API_BASE is not correct
const EXPECTED_API_BASE = "https://price-analyzer-8.preview.emergentagent.com";

if (API_BASE !== EXPECTED_API_BASE) {
  console.error("❌ API_BASE MISCONFIGURED:", API_BASE);
  throw new Error(`API_BASE must be ${EXPECTED_API_BASE}. Current=${API_BASE}`);
}

console.log("🔐 LOCKED FRONTEND =", window.location.origin);
console.log("🔐 LOCKED API_BASE =", API_BASE);
console.log("✅ API_BASE verified =", API_BASE);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
