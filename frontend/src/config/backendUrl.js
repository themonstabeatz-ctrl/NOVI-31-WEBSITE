// /app/frontend/src/config/backendUrl.js

const DEFAULT_BACKEND =
  "https://relaxhub-1.preview.emergentagent.com";

export function getBackendUrl() {
  const env = (process.env.REACT_APP_BACKEND_URL || "").trim();

  // 🔴 HARD FAIL: Ako .env pokušava da postavi pogrešan backend
  if (env.includes("massage-hub-")) {
    console.error("🔴 FATAL: REACT_APP_BACKEND_URL points to frontend domain:", env);
    throw new Error("FATAL BACKEND URL MISCONFIG (frontend domain)");
  }

  const isScheduler =
    env.startsWith("https://massage-scheduler-") ||
    env === DEFAULT_BACKEND;

  const backend = isScheduler ? env : DEFAULT_BACKEND;

  console.log("✅ BACKEND_URL (guarded):", backend);
  return backend;
}
