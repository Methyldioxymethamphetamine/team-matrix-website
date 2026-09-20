"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

// Lightweight in-view number counter (no external animation deps),
// styled/behaved after reactbits' CountUp.
export default function CountUp({
  to,
  from = 0,
  duration = 1.4,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(from);
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const startTimer = window.setTimeout(() => {
          const startTs = performance.now();
          const durationMs = duration * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTs;
            const progress = Math.min(1, elapsed / durationMs);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(from + (to - from) * eased));

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }, delay * 1000);

        return () => window.clearTimeout(startTimer);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, from, duration, delay]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
