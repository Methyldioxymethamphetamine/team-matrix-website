"use client";

import Link from "next/link";
import Image from "next/image";
import DotField from "@/components/DotField";
import FuzzyText from "@/components/FuzzyText";

export default function NotFound() {
  const hoverIntensity = 0.6;
  const enableHover = true;

  return (
    <div className="relative min-h-screen w-full bg-black text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Interactive Red Dots Background */}
      <div className="fixed inset-0 z-0">
        <DotField
          dotRadius={1.6}
          dotSpacing={16}
          bulgeStrength={70}
          glowRadius={180}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(239, 68, 68, 0.35)"
          gradientTo="rgba(185, 28, 28, 0.15)"
          glowColor="rgba(239, 68, 68, 0.25)"
        />
      </div>

      {/* Background Radial Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* TOP BAR: Logo Badge Island (left) + Pill Nav Island (center-right) */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 pt-4">
        {/* LOGO BADGE ISLAND */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] group transition-all hover:border-red-500/30">
          <div className="w-7 sm:w-8 h-auto">
            <Image
              src="/tempfiles/matrixlogo (2).png"
              alt="Team Matrix Logo"
              width={80}
              height={80}
              className="w-full h-auto object-contain filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] transition-transform group-hover:scale-110"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-red-500 text-xs sm:text-sm tracking-[0.2em]">
              TEAM
            </span>
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-slate-100 text-sm sm:text-base tracking-[0.08em] drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
              MATRIX
            </span>
          </div>
        </Link>

        {/* STATUS + RETURN PILL ISLAND */}
        <nav className="flex items-center gap-1 px-2 py-2 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-red-400/80 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            404
          </span>
          <div className="hidden sm:block w-px h-4 bg-white/10 mx-1" />
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-sm font-[family-name:var(--font-black-ops)] tracking-[0.06em] text-red-300 bg-red-950/50 border border-red-500/30 transition-all duration-200 hover:bg-red-900/60 hover:text-red-200 hover:shadow-[0_0_18px_rgba(239,68,68,0.3)] active:scale-95"
          >
            Return
          </Link>
        </nav>
      </div>

      {/* MAIN 404 CONTENT CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* FUZZY TEXT 404 */}
          <div className="drop-shadow-[0_0_50px_rgba(239,68,68,0.6)]">
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={hoverIntensity}
              enableHover={enableHover}
            >
              404
            </FuzzyText>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-mono text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              TELEMETRY PATH NOT FOUND
            </div>
            <h1 className="text-xl sm:text-2xl font-mono tracking-wider font-bold text-slate-100 uppercase">
              LOST IN THE MATRIX
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed tracking-wide">
              The coordinate trajectory you are seeking does not exist or has been relocated within the grid.
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600/90 text-white font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold transition-all hover:bg-red-500 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.7)] border border-red-400"
            >
              <svg className="w-4 h-4 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Mission Control
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER METADATA */}
      <footer className="relative z-10 py-4 text-center text-[10px] font-mono text-slate-400 tracking-widest border-t border-red-500/15 bg-slate-950/40 backdrop-blur-md">
        <span>TEAM MATRIX // SYSTEM TELEMETRY // ERROR 404</span>
      </footer>
    </div>
  );
}
