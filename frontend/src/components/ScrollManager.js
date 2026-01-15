import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollManager - Global scroll handler for React Router
 * 
 * Handles:
 * 1. Hash navigation (#top, #section) - smooth scroll to element
 * 2. Route changes - scroll to top of page
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (#top), scroll to that element
    if (hash) {
      // Small delay to ensure DOM is ready after navigation
      const timeoutId = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Fallback: if hash element not found, scroll to top
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    
    // Default: scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}
