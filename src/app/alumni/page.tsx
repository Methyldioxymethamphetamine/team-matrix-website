"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DotField from "@/components/DotField";

export default function AlumniPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white select-none overflow-hidden">
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
        <div className="flex flex-col items-center gap-4 opacity-30">
          <span className="font-mono text-xs tracking-[0.35em] text-red-400 uppercase">Team Matrix</span>
          <h1 className="font-[family-name:var(--font-black-ops)] text-5xl sm:text-7xl text-slate-100 leading-none">Alumni</h1>
          <span className="font-mono text-xs tracking-widest text-slate-500 uppercase mt-2">Coming Soon</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
