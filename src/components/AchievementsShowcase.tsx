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
const MOBILE_CAROUSEL_PROPS = { cardWidth: 340, cardHeight: 220, radius: 28, depth: 60, spread: 60 };

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
      <h2 className="relative font-[family-name:var(--font-black-ops)] text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight text-center drop-shadow-[0_0_20px_rgba(239,68,68,0.25)] mb-2 sm:mb-3 px-4">
        Achievements
      </h2>

      {/* DepthCarousel centers its cards vertically within this box's full height, so its
          height is kept close to the card's own height (cardHeight above) rather than
          generously oversized — the difference is dead space split above and below the
          image, which is what made the heading feel far from the picture. Mobile keeps
          ~40px of headroom beyond MOBILE_CAROUSEL_PROPS.cardHeight (220) since on wider
          "mobile" widths (up to the 640px breakpoint) DepthCarousel's auto-scale can reach
          1x, i.e. the full 220px card — with no headroom the image touched this box's
          edges and got clipped by overflow-hidden. */}
      <div className={`w-full overflow-hidden ${isDesktop ? "h-[400px] md:h-[420px]" : "h-[260px]"}`}>
        <DepthCarousel
          items={items}
          tilt={0}
          autoplay={true}
          showIndicators={false}
          onChange={(index) => setActiveIndex(index)}
          {...carouselProps}
        />
      </div>

      {/* Caption readout for the active card — max-w doubled on desktop (2xl = 42rem -> 84rem)
          so the longer captions have more room per line now that the font is bigger; mobile
          keeps the original width since the screen itself is the limiting factor there.
          `w-full` is required here: this is a flex child of the `items-center` section
          above, which shrinks children to fit their content by default, so max-w alone
          would only matter for captions already longer than the old 2xl cap. */}
      <div className="mt-6 sm:mt-4 w-full max-w-2xl sm:max-w-[84rem] mx-auto text-center px-4">
        <p className="font-sans text-lg sm:text-2xl md:text-3xl text-white leading-snug transition-opacity duration-300">
          {active.caption}
        </p>
      </div>
    </section>
  );
}
