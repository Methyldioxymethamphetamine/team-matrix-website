"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DepthCarousel, { type DepthCarouselItem } from "./DepthCarousel";
import captionsData from "../../public/achievements/captions.json";

interface AchievementCaption {
  file: string;
  caption: string;
  note?: string;
}

const captions = captionsData as AchievementCaption[];

// Runs before paint on the client (no SSR flash of the wrong size), falls
// back to a plain effect on the server where layout effects are a no-op.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// DepthCarousel's own ResizeObserver only ever scales *down* to a floor of
// 0.4x — on a mobile viewport the desktop card/spread numbers below hit that
// floor and render as a tiny, oddly-offset thumbnail with a lot of dead
// space around it (reported on Android). Pick proportionally smaller props
// on narrow viewports instead of relying on that floor to save it.
const DESKTOP_CAROUSEL_PROPS = { cardWidth: 560, cardHeight: 360, radius: 48, depth: 100, spread: 260 };
const MOBILE_CAROUSEL_PROPS = { cardWidth: 260, cardHeight: 168, radius: 24, depth: 48, spread: 120 };

function useIsDesktop(breakpointPx = 640) {
  const [isDesktop, setIsDesktop] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    setIsDesktop(mql.matches);
    const update = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpointPx]);

  return isDesktop;
}

export default function AchievementsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = captions[activeIndex];
  const isDesktop = useIsDesktop();
  const carouselProps = isDesktop ? DESKTOP_CAROUSEL_PROPS : MOBILE_CAROUSEL_PROPS;

  const items: DepthCarouselItem[] = useMemo(
    () => captions.map((c) => ({ image: `/achievements/${c.file}`, alt: c.caption })),
    []
  );

  return (
    <section
      id="achievements-section"
      className="relative z-30 w-full min-h-screen flex flex-col items-center justify-start pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-x-hidden"
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
    >
      <div className="flex items-center justify-center gap-2.5 mb-2 sm:mb-3 px-4">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-red-400 uppercase whitespace-nowrap">
          Team Matrix / Achievements
        </span>
      </div>

      <h2 className="relative font-[family-name:var(--font-black-ops)] text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight text-center drop-shadow-[0_0_20px_rgba(239,68,68,0.25)] mb-3 sm:mb-4 px-4">
        Achievements
      </h2>

      <div className={`w-full overflow-hidden ${isDesktop ? "h-[480px] md:h-[520px]" : "h-[220px]"}`}>
        <DepthCarousel
          items={items}
          tilt={0}
          autoplay={true}
          showIndicators={false}
          onChange={(index) => setActiveIndex(index)}
          {...carouselProps}
        />
      </div>

      {/* Caption readout for the active card */}
      <div className="mt-3 sm:mt-4 max-w-2xl mx-auto text-center px-4">
        <p className="font-sans text-lg sm:text-2xl md:text-3xl text-white leading-snug transition-opacity duration-300">
          {active.caption}
        </p>
        {active.note && (
          <p className="mt-1.5 font-mono text-xs sm:text-sm text-red-300/70">{active.note}</p>
        )}
      </div>
    </section>
  );
}
