// /app/frontend/src/config/backendUrl.js

const DEFAULT_BACKEND =
  "https://massage-scheduler-4.preview.emergentagent.com";

export function getBackendUrl() {
  const env = (process.env.REACT_APP_BACKEND_URL || "").trim();

  const isScheduler =
    env.startsWith("https://massage-scheduler-") ||
    env === DEFAULT_BACKEND;

  const backend = isScheduler ? env : DEFAULT_BACKEND;

  // 🚨 Block invalid backend (self-link)
  if (backend.includes("massage-hub-")) {
    console.error("🔴 BLOCKED WRONG BACKEND URL:", backend);
    return DEFAULT_BACKEND;
  }

  console.log("✅ BACKEND_URL (guarded):", backend);
  return backend;
}
