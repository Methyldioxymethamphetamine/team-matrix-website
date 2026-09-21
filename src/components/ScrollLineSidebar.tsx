"use client";

import { memo } from "react";

export interface ScrollLineSidebarStage {
  label: string;
}

interface ScrollLineSidebarProps {
  stages: ScrollLineSidebarStage[];
  /** 0-1 per stage, one per entry in `stages` — how "active" that stage is
   * right now. Continuous rather than a single active index so a stage's
   * line/label eases in and out exactly in step with its own crossfade,
   * instead of snapping between two discrete states. */
  weights: number[];
  visible: boolean;
  onSelect: (index: number) => void;
}

// A left-edge scroll-progress rail, inspired by reactbits.dev's "Line
// Sidebar" — same idea (a tick/line per item that grows and brightens toward
// an accent color) but driven by scroll-position weights computed in
// TubeLightLogo's own rAF loop instead of cursor proximity, and restyled to
// the site's red/black/mono brand instead of reactbits' purple defaults.
function ScrollLineSidebar({ stages, weights, visible, onSelect }: ScrollLineSidebarProps) {
  return (
    <nav
      aria-label="Page sections"
      className={`fixed left-5 sm:left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-5 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {stages.map((stage, i) => {
        const w = Math.min(1, Math.max(0, weights[i] ?? 0));
        return (
          <button
            key={stage.label}
            type="button"
            onClick={() => onSelect(i)}
            className="group flex items-center gap-3 py-1 text-left"
            aria-current={w > 0.5 ? "true" : undefined}
          >
            <span
              aria-hidden="true"
              className="block h-px rounded-full transition-[width,background-color] duration-150 ease-out"
              style={{
                width: `${16 + w * 28}px`,
                backgroundColor: w > 0.05 ? "#ef4444" : "#6c6c6c",
                opacity: 0.35 + w * 0.65,
              }}
            />
            <span
              className="font-mono text-[10px] tracking-[0.15em] uppercase whitespace-nowrap transition-[color,transform] duration-150 ease-out"
              style={{
                color: `rgb(${148 + w * (255 - 148)}, ${148 - w * 100}, ${148 - w * 100})`,
                transform: `translateX(${w * 4}px)`,
                fontWeight: w > 0.5 ? 600 : 400,
              }}
            >
              {stage.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// The parent recomputes `weights` as a brand-new array every scroll frame
// (60x/sec while scrolling), which would defeat a plain memo() — this
// compares rounded values instead of array identity, so a render is skipped
// whenever nothing changed enough to actually repaint (sub-1% weight drift
// doesn't move any pixel width/color this component renders).
function weightsRoughlyEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Math.round(a[i] * 100) !== Math.round(b[i] * 100)) return false;
  }
  return true;
}

export default memo(ScrollLineSidebar, (prev, next) => {
  return (
    prev.stages === next.stages &&
    prev.visible === next.visible &&
    prev.onSelect === next.onSelect &&
    weightsRoughlyEqual(prev.weights, next.weights)
  );
});
