"use client";

import NavBar from "@/components/NavBar";
import DotField from "@/components/DotField";

export default function ApplyPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white select-none overflow-hidden">
      {/* Background dot field */}
      <div className="fixed inset-0 z-0">
        <DotField
          dotRadius={1.6} dotSpacing={16} bulgeStrength={70} glowRadius={180}
          sparkle={true} waveAmplitude={0}
          gradientFrom="rgba(239, 68, 68, 0.25)" gradientTo="rgba(185, 28, 28, 0.10)"
          glowColor="rgba(239, 68, 68, 0.18)"
        />
      </div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.10)_0%,transparent_65%)] pointer-events-none z-0" />

      <NavBar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Label */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.1em] sm:text-[10px] sm:tracking-[0.3em] text-red-400 uppercase whitespace-nowrap">Team Matrix / Recruitment</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-[family-name:var(--font-black-ops)] text-6xl sm:text-8xl text-slate-100 leading-none">
              Apply
            </h1>
            <p className="text-slate-400 font-sans text-sm sm:text-base tracking-wide max-w-xs">
              Join the matrix. Applications will open soon.
            </p>
          </div>

          {/* CTA Button — does nothing yet */}
          <button
            type="button"
            onClick={() => {}}
            className="
              group relative mt-2
              px-10 py-4 rounded-full
              bg-red-600/90 text-white
              font-[family-name:var(--font-black-ops)] text-base sm:text-lg tracking-[0.1em]
              border border-red-400/60
              transition-all duration-300
              hover:bg-red-500 hover:scale-105
              active:scale-95
              shadow-[0_0_30px_rgba(239,68,68,0.35),0_0_60px_rgba(239,68,68,0.15)]
              hover:shadow-[0_0_40px_rgba(239,68,68,0.55),0_0_80px_rgba(239,68,68,0.25)]
              overflow-hidden
            "
          >
            {/* Inner shimmer sweep */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <span className="relative z-10">APPLY NOW</span>
          </button>

          <p className="font-mono text-[10px] tracking-widest text-slate-600 uppercase">
            Applications not yet open
          </p>
        </div>
      </main>
    </div>
  );
}
