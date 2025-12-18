import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { API_BASE } from "./config/api";

function isValidUrl(url) {
  try { new URL(url); return true; } catch { return false; }
}

const BACKEND_URL = API_BASE; // 🔐 hard lock

// ✅ samo log, nikad throw - app MORA da se renderuje
if (!isValidUrl(BACKEND_URL)) {
  console.error("⚠️ Invalid BACKEND_URL but app must not crash:", BACKEND_URL);
} else {
  console.log("🔐 LOCKED BACKEND_URL =", BACKEND_URL);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
