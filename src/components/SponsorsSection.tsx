"use client";

import React from "react";
import LogoLoop, { LogoItem } from "./LogoLoop";

const sponsorLogos: LogoItem[] = [
  { src: "/sponsors/e8a0lhlzci4mrtuhxpyt.webp", alt: "Sponsor 1" },
  { src: "/sponsors/h1rnsk1iy3waveocvv1j.webp", alt: "Sponsor 2" },
  { src: "/sponsors/hen1xl53hgxkvioqzmxd.webp", alt: "Sponsor 3" },
  { src: "/sponsors/loav7g34xdjfefm4w6xm.webp", alt: "Sponsor 4" },
  { src: "/sponsors/otebodr8hqe2evljlopj.webp", alt: "Sponsor 5" },
  { src: "/sponsors/rnnelglgg3nglza3wdxd.webp", alt: "Sponsor 6" },
  { src: "/sponsors/ugkpfb0fnv9dwgd4d7vs.webp", alt: "Sponsor 7" },
  { src: "/sponsors/wnj2cd2wjjyaiantqwfx.webp", alt: "Sponsor 8" },
  { src: "/sponsors/zt14si7cbfqwv69zcdt1.webp", alt: "Sponsor 9" },
];

export default function SponsorsSection() {
  return (
    <section
      id="sponsors"
      aria-label="Our Sponsors"
      className="relative z-25 w-full py-6 sm:py-8 bg-[#0a0a0f] border-t border-red-500/10 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 mb-4">
        <div className="flex flex-col items-center text-center space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="hidden sm:block w-8 h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] rounded-full" />
            <span className="font-mono text-[9px] tracking-[0.08em] sm:text-xs sm:tracking-[0.28em] text-red-500 font-semibold uppercase whitespace-nowrap">
              TEAM MATRIX / SPONSORS &amp; PARTNERS
            </span>
            <span className="hidden sm:block w-8 h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] rounded-full" />
          </div>

          <h2 className="font-[family-name:var(--font-black-ops)] text-xl sm:text-2xl md:text-3xl text-white tracking-wide drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]">
            POWERING OUR INNOVATION
          </h2>

          <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Proudly backed by industry leaders and visionary organizations driving our robotic achievements forward.
          </p>
        </div>
      </div>

      {/* Infinite Logo Loop */}
      <div className="relative w-full py-1">
        <LogoLoop
          logos={sponsorLogos}
          speed={65}
          direction="left"
          logoHeight={100}
          gap={36}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#0a0a0f"
          ariaLabel="Sponsor logos loop"
        />
      </div>
    </section>
  );
}
