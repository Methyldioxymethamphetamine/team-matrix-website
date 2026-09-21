"use client";

import { memo, useEffect, useState } from "react";
import LogoLoop, { LogoItem } from "./LogoLoop";
import Reveal from "./Reveal";

// Rendered as a static, prop-less child of TubeLightLogo, which re-renders on
// every scroll frame — memoizing means this whole subtree (including its own
// fetch + Reveal observers) is skipped on every one of those.
function SponsorsSection() {
  // Sponsors are managed through /admin — fetched at runtime (like the
  // gallery's /api/works) rather than imported statically, so add/remove
  // there shows up here without a rebuild.
  const [sponsorLogos, setSponsorLogos] = useState<LogoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((data: LogoItem[]) => {
        if (!cancelled) setSponsorLogos(data);
      })
      .catch(() => {
        if (!cancelled) setSponsorLogos([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="sponsors"
      aria-label="Our Sponsors"
      className="relative z-25 w-full min-h-[55vh] sm:min-h-[60vh] flex flex-col justify-center pt-10 sm:pt-14 pb-20 sm:pb-24 border-t border-red-500/10 overflow-hidden"
    >
      <Reveal className="relative max-w-[1800px] mx-auto px-6 sm:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block w-8 h-[2px] bg-red-500 rounded-full" />
            <span className="font-mono text-[9px] tracking-[0.08em] sm:text-xs sm:tracking-[0.28em] text-red-500 font-semibold uppercase whitespace-nowrap">
              TEAM MATRIX / SPONSORS &amp; PARTNERS
            </span>
            <span className="hidden sm:block w-8 h-[2px] bg-red-500 rounded-full" />
          </div>

          <h2 className="font-[family-name:var(--font-black-ops)] text-2xl sm:text-3xl md:text-4xl text-white tracking-wide">
            POWERING OUR INNOVATION
          </h2>

          <p className="font-sans text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Proudly backed by industry leaders and visionary organizations driving our robotic achievements forward.
          </p>
        </div>
      </Reveal>

      {/* Infinite Logo Loop */}
      <Reveal delayMs={150} className="relative w-full py-4 sm:py-6">
        <LogoLoop
          logos={sponsorLogos}
          speed={65}
          direction="left"
          logoHeight={165}
          gap={56}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#0a0a0f"
          ariaLabel="Sponsor logos loop"
        />
      </Reveal>
    </section>
  );
}

export default memo(SponsorsSection);
