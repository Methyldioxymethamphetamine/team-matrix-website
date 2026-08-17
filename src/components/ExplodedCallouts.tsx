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
    id: "waapi",
    label: "waapi",
    sublabel: "WEB ANIMATION API",
    spec: "60 FPS NATIVE PIPELINE",
    origin: { x: 430, y: 260 },
    bend: { x: 570, y: 170 },
    end: { x: 740, y: 170 },
    triggerStep: 1,
  },
  {
    id: "timeline",
    label: "timeline",
    sublabel: "GSAP CONTROL SEQUENCER",
    spec: "MULTI-STAGE KEYFRAMES",
    origin: { x: 470, y: 340 },
    bend: { x: 590, y: 250 },
    end: { x: 740, y: 250 },
    triggerStep: 1,
  },
  {
    id: "stagger",
    label: "stagger",
    sublabel: "MATRIX PARALLEL PIPELINE",
    spec: "PARALLEL NODE EXECUTION",
    origin: { x: 470, y: 430 },
    bend: { x: 610, y: 330 },
    end: { x: 740, y: 330 },
    triggerStep: 2,
  },
  {
    id: "svg",
    label: "svg",
    sublabel: "VECTOR GRAPHICS OVERLAY",
    spec: "HARDWARE ACCELERATED SVG",
    origin: { x: 470, y: 530 },
    bend: { x: 630, y: 410 },
    end: { x: 740, y: 410 },
    triggerStep: 2,
  },
  {
    id: "spring",
    label: "spring",
    sublabel: "TENSION PHYSICS ENGINE",
    spec: "INERTIAL DAMPING 0.85",
    origin: { x: 480, y: 650 },
    bend: { x: 650, y: 490 },
    end: { x: 740, y: 490 },
    triggerStep: 3,
  },
  {
    id: "animation",
    label: "animation",
    sublabel: "120 FPS FRAME BUFFER",
    spec: "WEBP TRANSPARENT CANVAS",
    origin: { x: 440, y: 760 },
    bend: { x: 670, y: 570 },
    end: { x: 740, y: 570 },
    triggerStep: 3,
  },
];

export default function ExplodedCallouts({ pauseProgress, isVisible }: ExplodedCalloutsProps) {
  const currentStep = Math.min(4, Math.max(1, Math.floor(pauseProgress * 4) + 1));

  return (
    <div
      className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Blueprint SVG Leader Lines */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))" }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F8FAFC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {CALLOUTS.map((item) => {
          const startP = (item.triggerStep - 1) * 0.22;
          const endP = startP + 0.25;
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
              {/* Origin Target Dot & Pulsing Ring */}
              <circle cx={item.origin.x} cy={item.origin.y} r="5" fill="#EF4444" />
              <circle
                cx={item.origin.x}
                cy={item.origin.y}
                r="12"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.5"
                opacity={0.6 * lineP}
              >
                <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Main Blueprint Path */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Path Endpoint Dot */}
              {lineP > 0.6 && (
                <circle cx={endX} cy={item.end.y} r="4" fill="#F8FAFC" stroke="#EF4444" strokeWidth="2" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Text Callout Labels Stacked on Right (Matching Image 2 Aesthetic) */}
      <div className="absolute inset-0">
        {CALLOUTS.map((item) => {
          const startP = (item.triggerStep - 1) * 0.22;
          const lineP = Math.min(1, Math.max(0, (pauseProgress - startP) / 0.22));

          if (lineP <= 0) return null;

          const topPct = item.end.y / 10; // e.g. 170 -> 17%
          const leftPct = item.end.x / 10; // e.g. 740 -> 74%

          return (
            <div
              key={item.id}
              className="absolute transition-all duration-300 flex items-center gap-3"
              style={{
                top: `${topPct}%`,
                left: `${leftPct}%`,
                transform: `translate(12px, -50%) translateX(${(1 - lineP) * 20}px)`,
                opacity: lineP,
              }}
            >
              {/* Leader Horizontal Connector Pill */}
              <div className="w-4 h-[2px] bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

              {/* Label Group */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg sm:text-xl md:text-2xl font-light text-slate-200 tracking-wider hover:text-red-400 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-400 font-semibold">
                    0{item.triggerStep}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-widest uppercase">
                  {item.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOP SCROLL DIAGNOSTIC STEP BADGE (Showing the 4 Paused Scrolls Progression) */}
      <div className="absolute top-20 sm:top-24 right-6 sm:right-10 flex flex-col items-end gap-2 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.25)]">
        <div className="text-[10px] font-mono text-red-400/90 tracking-widest flex items-center gap-2 uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>EXPLODED VIEW // PAUSED FRAME</span>
        </div>

        {/* 4 Step Indicators */}
        <div className="flex items-center gap-1.5 mt-1">
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentStep >= step;
            const isCurrent = currentStep === step;

            return (
              <div
                key={step}
                className={`h-7 px-2.5 rounded-md flex items-center justify-center font-mono text-xs transition-all duration-300 ${
                  isCurrent
                    ? "bg-red-600 text-white font-bold border border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.8)] scale-105"
                    : isActive
                    ? "bg-red-950/60 text-red-300 border border-red-500/40"
                    : "bg-slate-900/60 text-slate-500 border border-slate-800"
                }`}
              >
                <span>SCROLL {step}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
          {currentStep === 4 ? "✓ DIAGNOSTIC COMPLETE" : `SCROLL DOWN TO ADVANCE (${currentStep}/4)`}
        </div>
      </div>
    </div>
  );
}
