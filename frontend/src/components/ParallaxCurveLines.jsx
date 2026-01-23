// /app/frontend/src/components/ParallaxCurveLines.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ParallaxCurveLines({
  variant = "original", // "original" ili "mirrored"
  strokeWidth = 2,
  opacity = 0.95,
  top = 0,
  zIndex = 2,
  className = "",
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  // Parallax: lagano pomeranje u odnosu na scroll
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // progres kroz viewport (0..1)
      const progress = Math.min(1, Math.max(0, 1 - rect.top / vh));

      // sitno pomeranje (parallax)
      const px = Math.round((progress - 0.5) * 30); // -15..+15px
      setOffset(px);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dOriginal = "M0 199 Q512 977 1023 585";
  const dMirrored = "M0 800 Q512 21.8096 1023 414";
  const d = variant === "mirrored" ? dMirrored : dOriginal;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: 140,            // zona u kojoj je linija
        pointerEvents: "none",
        zIndex,
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 1024 1000"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d={d}
          fill="none"
          stroke="rgba(212,175,55,1)"
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      </svg>
    </div>
  );
}
