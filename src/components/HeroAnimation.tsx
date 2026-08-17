"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Title & badge entrance
      tl.from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-title-line",
          {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
          },
          "-=0.4"
        )
        .from(
          ".hero-subtitle",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.4"
        )
        .from(
          ".hero-card",
          {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          "-=0.4"
        );

      // Continuous floating animation for cards
      gsap.to(".floating-shape-1", {
        y: "20px",
        rotation: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-shape-2", {
        y: "-25px",
        rotation: -12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white px-6 py-20"
    >
      {/* Decorative Gradient Orbs */}
      <div className="floating-shape-1 absolute top-1/4 left-10 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />
      <div className="floating-shape-2 absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />

      {/* Hero Content Header */}
      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Powered by Next.js & GSAP
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300 leading-tight">
          <span className="hero-title-line block">Crafting High Impact</span>
          <span className="hero-title-line block text-indigo-400">
            Web Experiences
          </span>
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Welcome to Team Matrix. A Next.js App Router boilerplate styled with modern aesthetics and butter-smooth GSAP animations.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta flex flex-wrap justify-center gap-4 pt-4">
          <button className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-105 active:scale-95">
            Explore Matrix
          </button>
          <button className="px-8 py-3.5 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 backdrop-blur-sm transition-all hover:border-slate-700">
            Documentation
          </button>
        </div>
      </div>

      {/* Interactive Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-16">
        <div className="hero-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-indigo-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Next.js App Router</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Built with React Server Components, optimal performance, and modern routing setup.
          </p>
        </div>

        <div className="hero-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            ✨
          </div>
          <h3 className="text-xl font-bold text-white mb-2">GSAP Animations</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Leveraging `@gsap/react` `useGSAP` hook for declarative, performance-first motion design.
          </p>
        </div>

        <div className="hero-card p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-cyan-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <h3 className="text-xl font-bold text-white mb-2">TypeScript Native</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Fully typed application layout, components, and props for seamless developer experience.
          </p>
        </div>
      </div>
    </div>
  );
}
