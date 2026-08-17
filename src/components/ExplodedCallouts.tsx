"use client";

import React from "react";

export interface ExplodedCalloutsProps {
  pauseProgress: number; // 0.0 to 1.0 across the paused 4 scrolls
  isVisible: boolean;
}

interface CalloutItem {
  id: string;
  label: string;
  sublabel: string;
  spec: string;
  origin: { x: number; y: number }; // viewBox 0..1000
  bend: { x: number; y: number };
  end: { x: number; y: number };
  triggerStep: number; // 1, 2, 3, 4
}

const CALLOUTS: CalloutItem[] = [
  {
    id: "propeller",
    label: "propeller",
    sublabel: "PRIMARY FLIGHT PROPULSION",
    spec: "CW ROTATION / 114MM PITCH",
    origin: { x: 455, y: 165 },
    bend: { x: 650, y: 165 },
    end: { x: 760, y: 240 },
    triggerStep: 1,
  },
  {
    id: "shell",
    label: "shell",
    sublabel: "OUTER ROTOR CASING",
    spec: "CNC ALUMINUM ALLOY 19MM PCD",
    origin: { x: 490, y: 185 },
    bend: { x: 650, y: 185 },
    end: { x: 760, y: 320 },
    triggerStep: 1,
  },
  {
    id: "diamagnetic-shell",
    label: "Diamagnetic shell",
    sublabel: "MAGNETIC ISOLATION SLEEVE",
    spec: "STAINLESS STEEL 0.8MM",
    origin: { x: 508, y: 370 },
    bend: { x: 650, y: 370 },
    end: { x: 760, y: 420 },
    triggerStep: 2,
  },
  {
    id: "magnets",
    label: "Magnets",
    sublabel: "NEODYMIUM MAGNET ARRAY",
    spec: "14 SEGMENTS N42SH ALTERNATING N-S",
    origin: { x: 508, y: 485 },
    bend: { x: 650, y: 485 },
    end: { x: 760, y: 520 },
    triggerStep: 2,
  },
  {
    id: "electric-shell-winding",
    label: "electric shell and winding",
    sublabel: "COPPER ARMATURE WINDINGS",
    spec: "12 POLES / 18 AWG COILS",
    origin: { x: 508, y: 645 },
    bend: { x: 650, y: 645 },
    end: { x: 760, y: 670 },
    triggerStep: 3,
  },
  {
    id: "electronmagnetic-barrel",
    label: "electronmagnetic barrel",
    sublabel: "VECTORING HOUSING BASE",
    spec: "5MM MAIN SHAFT MOUNT 4X19MM",
    origin: { x: 510, y: 775 },
    bend: { x: 650, y: 775 },
    end: { x: 760, y: 800 },
    triggerStep: 3,
  },
];

export default function ExplodedCallouts({ pauseProgress, isVisible }: ExplodedCalloutsProps) {
  return (
    <div
      className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Blueprint SVG Leader Lines */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))" }}
      >
        <defs>
          <linearGradient id="lineGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#F8FAFC" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
          </linearGradient>
        </defs>

        {CALLOUTS.map((item) => {
          const startP = (item.triggerStep - 1) * 0.22;
          const lineP = Math.min(1, Math.max(0, (pauseProgress - startP) / 0.22));

          if (lineP <= 0) return null;

          // Compute interpolated path points based on lineP
          const bendX = item.origin.x + (item.bend.x - item.origin.x) * Math.min(1, lineP * 1.5);
          const bendY = item.origin.y + (item.bend.y - item.origin.y) * Math.min(1, lineP * 1.5);

          let endX = item.bend.x;
          if (lineP > 0.6) {
            const hP = (lineP - 0.6) / 0.4;
            endX = item.bend.x + (item.end.x - item.bend.x) * hP;
          }

          const pathD =
            lineP <= 0.6
              ? `M ${item.origin.x} ${item.origin.y} L ${bendX} ${bendY}`
              : `M ${item.origin.x} ${item.origin.y} L ${item.bend.x} ${item.bend.y} L ${endX} ${item.end.y}`;

          return (
            <g key={item.id}>
              {/* Main Blueprint Line Path */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#lineGradCyan)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Layer for 1:1 Non-distorted Perfect Circular Dots & Labels */}
      <div className="absolute inset-0">
        {CALLOUTS.map((item, idx) => {
          const startP = (item.triggerStep - 1) * 0.22;
          const lineP = Math.min(1, Math.max(0, (pauseProgress - startP) / 0.22));

          if (lineP <= 0) return null;

          let endX = item.bend.x;
          if (lineP > 0.6) {
            const hP = (lineP - 0.6) / 0.4;
            endX = item.bend.x + (item.end.x - item.bend.x) * hP;
          }

          const originTopPct = item.origin.y / 10;
          const originLeftPct = item.origin.x / 10;
          const endTopPct = item.end.y / 10;
          const endLeftPct = endX / 10;

          return (
            <React.Fragment key={item.id}>
              {/* Origin Target Dot (HTML 1:1 Perfect Geometric Circle) */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                style={{
                  top: `${originTopPct}%`,
                  left: `${originLeftPct}%`,
                  opacity: lineP,
                }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
                <div className="absolute w-8 h-8 rounded-full border border-cyan-400 animate-ping opacity-60" />
              </div>

              {/* Endpoint Dot (HTML 1:1 Perfect Geometric Circle) */}
              {lineP > 0.6 && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                  style={{
                    top: `${endTopPct}%`,
                    left: `${endLeftPct}%`,
                    opacity: lineP,
                  }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-100 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
                </div>
              )}

              {/* Text Label Group Stacked on Right */}
              <div
                className="absolute transition-all duration-300 flex items-center gap-3"
                style={{
                  top: `${endTopPct}%`,
                  left: `${item.end.x / 10}%`,
                  transform: `translate(12px, -50%) translateX(${(1 - lineP) * 25}px)`,
                  opacity: lineP,
                }}
              >
                {/* Leader Horizontal Connector Pill */}
                <div className="w-5 h-[2.5px] bg-cyan-400/90 shadow-[0_0_10px_rgba(6,182,212,0.9)]" />

                {/* Label Content */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base sm:text-lg md:text-xl font-bold text-slate-100 tracking-wider hover:text-cyan-300 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono text-cyan-400/90 tracking-widest uppercase">
                    {item.sublabel}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400/80 tracking-wider">
                    {item.spec}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
