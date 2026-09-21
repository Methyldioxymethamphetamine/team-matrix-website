"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react";
import DepthCarousel, { type DepthCarouselItem } from "./DepthCarousel";
import Reveal from "./Reveal";
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
const DESKTOP_CAROUSEL_PROPS = { cardWidth: 672, cardHeight: 432, radius: 58, depth: 120, spread: 312 };
const MOBILE_CAROUSEL_PROPS = { cardWidth: 408, cardHeight: 264, radius: 34, depth: 72, spread: 72 };

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

interface AchievementsShowcaseProps {
  /** "pinned" (default): fills a `fixed inset-0` ancestor whose own height is
   * the viewport, so `h-full` is correct — used on desktop's scroll-crossfade
   * pin. "flow": renders as an ordinary `min-h-screen` block in normal
   * document flow instead — used on mobile, where the pin/crossfade is
   * skipped in favor of normal scrolling (see TubeLightLogo.tsx), and where
   * `h-full` had nothing definite to size against, squeezing the heading,
   * carousel and caption together and making the caption overlap the image. */
  variant?: "pinned" | "flow";
}

// On desktop, rendered inside a `fixed inset-0` wrapper in TubeLightLogo
// whose opacity is scroll-driven (the achievements pin/crossfade) — this
// component takes only the `variant` prop, so memo still skips reconciling
// this subtree on every one of TubeLightLogo's scroll-frame re-renders as
// long as variant hasn't changed; only the wrapper's inline opacity style
// changes each frame while the pin is active.
function AchievementsShowcase({ variant = "pinned" }: AchievementsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = captions[activeIndex];
  const isDesktop = useIsDesktop();
  const carouselProps = isDesktop ? DESKTOP_CAROUSEL_PROPS : MOBILE_CAROUSEL_PROPS;
  const isFlow = variant === "flow";

  const items: DepthCarouselItem[] = useMemo(
    () => captions.map((c) => ({ image: `/achievements/${c.file}`, alt: c.caption })),
    []
  );

  return (
    <section
      className={`relative z-auto w-full flex flex-col items-center justify-center overflow-x-hidden ${
        isFlow ? "min-h-screen py-16" : "h-full pt-20 sm:pt-24 pb-6 sm:pb-8"
      }`}
    >
      <Reveal>
        <h2 className="relative font-[family-name:var(--font-black-ops)] text-4xl sm:text-5xl md:text-6xl font-normal text-white leading-tight text-center mb-2 sm:mb-3 px-4">
          Achievements
        </h2>
      </Reveal>

      {/* DepthCarousel centers its cards vertically within this box's full height, so its
          height is kept close to the card's own height (cardHeight above) rather than
          generously oversized — the difference is dead space split above and below the
          image, which is what made the heading feel far from the picture. Mobile keeps
          ~48px of headroom beyond MOBILE_CAROUSEL_PROPS.cardHeight (264) since on wider
          "mobile" widths (up to the 640px breakpoint) DepthCarousel's auto-scale can reach
          1x, i.e. the full 264px card — with no headroom the image touched this box's
          edges and got clipped by overflow-hidden. */}
      <div className={`w-full overflow-hidden ${isDesktop ? "h-[480px] md:h-[504px]" : isFlow ? "h-[336px]" : "h-[312px]"}`}>
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
      <div className={`w-full max-w-2xl sm:max-w-[84rem] mx-auto text-center px-4 ${isFlow ? "mt-10 pt-2" : "mt-6 sm:mt-4"}`}>
        {/* key={activeIndex} remounts the <p> on every slide change, restarting
            the fadeInUp animation — a plain transition class here does nothing
            since the text swaps instantly with no property actually changing. */}
        <p
          key={activeIndex}
          className="font-mono tracking-wide text-lg sm:text-2xl md:text-3xl text-white leading-snug"
          style={{ animation: "fadeInUp 450ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {active.caption}
        </p>
      </div>
    </section>
  );
}

export default memo(AchievementsShowcase);
