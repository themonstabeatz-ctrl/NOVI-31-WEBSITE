import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollManager - Global scroll handler for React Router
 * 
 * Handles:
 * 1. Hash navigation (#top) - instant scroll to page top
 * 2. Other hash navigation (#section) - smooth scroll to element
 * 3. Route changes - scroll to top of page
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Special case: #top means scroll to absolute top of page
    if (hash === "#top") {
      // Small delay to ensure navigation is complete
      const timeoutId = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        console.log("📍 ScrollManager: Scrolled to TOP (hash=#top)");
      }, 50);
      return () => clearTimeout(timeoutId);
    }
    
    // If there's another hash, scroll to that element
    if (hash) {
      const timeoutId = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          console.log(`📍 ScrollManager: Scrolled to ${hash}`);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    
    // Default: scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    console.log("📍 ScrollManager: Scrolled to top (route change)");
  }, [pathname, hash]);

  return null;
}
