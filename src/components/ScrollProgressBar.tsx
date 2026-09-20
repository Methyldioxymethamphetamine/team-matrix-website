"use client";

import { useEffect, useRef } from "react";

// A thin fixed bar across the very top of the viewport showing overall page
// scroll progress. Intentionally decoupled from TubeLightLogo's own P/
// scrollProgress (the drone-sequence budget) — this tracks the whole
// document, has its own rAF loop, and never touches React state, so it can't
// add render churn or interfere with the existing scroll choreography.
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let lastPct = -1;

    const render = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (pct !== lastPct && barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
        lastPct = pct;
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[250] h-[3px] pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-red-600 via-red-400 to-red-600"
        style={{
          transform: "scaleX(0)",
          boxShadow: "0 0 12px rgba(239,68,68,0.7), 0 0 4px rgba(239,68,68,0.9)",
        }}
      />
    </div>
  );
}
