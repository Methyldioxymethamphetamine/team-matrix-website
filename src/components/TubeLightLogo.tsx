"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StrokeText from "./StrokeText";
import DotField from "./DotField";
import ExplodedCallouts from "./ExplodedCallouts";

const DRONE_1_COUNT = 60;
const DRONE_2_COUNT = 70;
const DRONE_3_COUNT = 70;

export default function TubeLightLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMovedToNav, setIsMovedToNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // In-memory frame buffers for all 3 sequential drone videos
  const [seq1Images, setSeq1Images] = useState<HTMLImageElement[]>([]);
  const [seq2Images, setSeq2Images] = useState<HTMLImageElement[]>([]);
  const [seq3Images, setSeq3Images] = useState<HTMLImageElement[]>([]);

  // Reset scroll position to top on page load / refresh & disable browser scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  // Preload transparent RGBA WebP frames for all 3 sequences for 120fps instantaneous 0ms playback
  useEffect(() => {
    // 1) Sequence 1: drone.webm (60 frames)
    const imgs1: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_1_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.src = `/tempfiles/drone_frames/frame_${idx}.webp`;
      imgs1.push(img);
    }
    setSeq1Images(imgs1);

    // 2) Sequence 2: drone1.webm (70 frames)
    const imgs2: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_2_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.src = `/tempfiles/drone1_frames/frame_${idx}.webp`;
      imgs2.push(img);
    }
    setSeq2Images(imgs2);

    // 3) Sequence 3: drone_reversed.webm (70 frames)
    const imgs3: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_3_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.src = `/tempfiles/drone_reversed_frames/frame_${idx}.webp`;
      imgs3.push(img);
    }
    setSeq3Images(imgs3);
  }, []);

  // Tubelight Intro GSAP Sequence
  useGSAP(
    () => {
      const logoGroup = logoGroupRef.current;
      if (!logoGroup) return;

      // Lock body scrolling during tubelight flicker intro
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Allow user to scroll once tubelight animation ends
          if (typeof document !== "undefined") {
            document.body.style.overflow = "auto";
          }

          // 2 seconds intentional delay before moving to top nav
          setTimeout(() => {
            setIsMovedToNav(true);
          }, 2000);
        },
      });

      // Tubelight turn-on flicker sequence
      tl.set(logoGroup, { opacity: 0, filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))" })
        .to(logoGroup, { opacity: 0.1, duration: 0.12 })
        .to(logoGroup, { opacity: 0, duration: 0.06 })
        .to(logoGroup, { opacity: 0.85, filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.6))", duration: 0.05 })
        .to(logoGroup, { opacity: 0.15, filter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.2))", duration: 0.1 })
        .to(logoGroup, { opacity: 0.95, filter: "drop-shadow(0 0 25px rgba(239, 68, 68, 0.8))", duration: 0.04 })
        .to(logoGroup, { opacity: 0.2, filter: "drop-shadow(0 0 5px rgba(239, 68, 68, 0.2))", duration: 0.08 })
        .to(logoGroup, { opacity: 1, filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 55px rgba(239, 68, 68, 0.7))", duration: 0.12 })
        .to(logoGroup, { opacity: 0.8, filter: "drop-shadow(0 0 15px rgba(239, 68, 68, 0.5))", duration: 0.06 })
        .to(logoGroup, {
          opacity: 1,
          filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 50px rgba(239, 68, 68, 0.6))",
          duration: 0.15,
        });

      // Subtle ambient hum glow animation once steady
      gsap.to(logoGroup, {
        filter: "drop-shadow(0 0 35px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 70px rgba(239, 68, 68, 0.85))",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: tl.duration(),
      });
    },
    { scope: containerRef }
  );

  // Multi-stage sequential 3D Canvas Frame Renderer (drone -> drone1 -> drone_reversed -> fadeout)
  useEffect(() => {
    if (!seq1Images.length || !seq2Images.length || !seq3Images.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const render = () => {
      const scrollY = window.scrollY;
      if (scrollY > 15) {
        setIsMovedToNav(true);
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const P = Math.min(1, Math.max(0, scrollY / maxScroll));
        setScrollProgress(P);

        let activeSet: HTMLImageElement[] = [];
        let localProgress = 0;
        let opacity = 0;

        // Sequence Stage 1: drone.webm (0.00 -> 0.22)
        if (P < 0.22) {
          activeSet = seq1Images;
          if (P < 0.03) {
            opacity = P / 0.03;
            localProgress = 0;
          } else if (P < 0.16) {
            opacity = 1;
            localProgress = (P - 0.03) / 0.13;
          } else if (P < 0.19) {
            // Hold LAST frame of drone.webm
            opacity = 1;
            localProgress = 1;
          } else {
            // Fade out drone.webm
            opacity = (0.22 - P) / 0.03;
            localProgress = 1;
          }
        }
        // Sequence Stage 2: drone1.webm (0.22 -> 0.42) - Plays explosion to 100%
        else if (P < 0.42) {
          activeSet = seq2Images;
          if (P < 0.25) {
            opacity = (P - 0.22) / 0.03; // Fade in drone1
            localProgress = 0;
          } else {
            opacity = 1;
            localProgress = (P - 0.25) / 0.17; // Plays 100% of drone1.webm to full exploded view
          }
        }
        // Sequence Stage 2.5: PAUSED EXPLODED FRAME (0.42 -> 0.76) - 4 CONSECUTIVE SCROLLS
        else if (P < 0.76) {
          activeSet = seq2Images;
          opacity = 1;
          localProgress = 1; // Holds the fully exploded 3D frame static for 4 scroll steps
        }
        // Sequence Stage 3: drone_reversed.webm (0.76 -> 1.00) - Collapses assembly back down
        else {
          activeSet = seq3Images;
          if (P < 0.94) {
            opacity = 1;
            localProgress = (P - 0.76) / 0.18; // Plays 100% of drone_reversed.webm
          } else if (P < 0.98) {
            // Hold LAST frame of drone_reversed.webm
            opacity = 1;
            localProgress = 1;
          } else {
            // Final Fade Out
            opacity = (1.00 - P) / 0.02;
            localProgress = 1;
          }
        }

        const parent = canvas.parentElement;
        if (parent && activeSet.length > 0) {
          const rect = parent.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const targetW = Math.floor(rect.width * dpr);
          const targetH = Math.floor(rect.height * dpr);

          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const frameIdx = Math.min(
            activeSet.length - 1,
            Math.floor(localProgress * (activeSet.length - 1))
          );
          const img = activeSet[frameIdx];

          if (img && img.complete && img.naturalWidth > 0 && opacity > 0.01) {
            ctx.globalAlpha = opacity;

            // Full Screen COVER scaling
            const ratio = Math.max(
              canvas.width / img.naturalWidth,
              canvas.height / img.naturalHeight
            );

            const drawW = img.naturalWidth * ratio;
            const drawH = img.naturalHeight * ratio;
            const offsetX = (canvas.width - drawW) / 2;
            const offsetY = (canvas.height - drawH) / 2;

            ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [seq1Images, seq2Images, seq3Images]);

  const isExplodedCalloutsVisible = scrollProgress >= 0.40 && scrollProgress <= 0.78;
  const pauseProgress = Math.min(1, Math.max(0, (scrollProgress - 0.42) / 0.34));

  return (
    <div ref={containerRef} className="relative min-h-[1100vh] w-full bg-black text-white select-none">
      {/* Interactive Canvas DotField Background */}
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
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.14)_0%,transparent_65%)] pointer-events-none z-0" />

      {/* ACRYLIC BLUR NAVIGATION BAR AT TOP OF PAGE */}
      <header
        className={`fixed top-0 left-0 right-0 h-16 sm:h-20 bg-slate-950/60 backdrop-blur-2xl border-b border-red-500/25 z-40 transition-all duration-700 ${
          isMovedToNav ? "opacity-100 translate-y-0 shadow-[0_4px_30px_rgba(239,68,68,0.2)]" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="text-xs font-mono text-red-500/80 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold">TEAM MATRIX // SYSTEM</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs font-mono text-slate-400">TELEMETRY: ONLINE</span>
            <button className="px-4 py-1.5 rounded-full border border-red-500/40 bg-red-950/30 text-red-300 text-xs font-mono tracking-wider transition-all hover:bg-red-900/50 hover:scale-105 active:scale-95">
              EXPLORE
            </button>
          </div>
        </div>
      </header>

      {/* LOGO & TEXT ANIMATION CONTAINER */}
      <div ref={logoGroupRef} className="fixed inset-0 z-50 pointer-events-none">
        {/* CENTER MATRIX LOGO EMBLEM (Transitions to top acrylic navbar center) */}
        <div
          className={`fixed transition-all duration-700 ease-in-out pointer-events-none ${
            isMovedToNav
              ? "top-2 sm:top-3 left-1/2 -translate-x-1/2 w-12 sm:w-14 md:w-16 translate-y-0"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 sm:w-72 md:w-88 lg:w-[380px]"
          }`}
        >
          <Image
            src="/tempfiles/matrixlogo (2).png"
            alt="Matrix Logo"
            width={500}
            height={500}
            className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(239,68,68,0.55)]"
            priority
          />
        </div>

        {/* INITIAL STATE: Left Stacked TEAM MATRIX Text (Fades out when transitioning to navbar) */}
        <div
          className={`fixed right-[calc(50%+7rem)] sm:right-[calc(50%+9.5rem)] md:right-[calc(50%+12.5rem)] lg:right-[calc(50%+14.5rem)] top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-500 ease-out ${
            isMovedToNav ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        >
          <div className="w-[200px] sm:w-[300px] md:w-[380px] lg:w-[460px]">
            <StrokeText
              text="TEAM"
              strokeColor="#EF4444"
              fillColor="#EF4444"
              strokeWidth={2.6}
              drawDuration={1.4}
              fillDelay={0.1}
              stagger={0.07}
              fontSize={58}
              fontWeight={400}
              letterSpacing={14}
              trigger="mount"
              fillMode="fade"
              fontFamily="var(--font-black-ops), 'Black Ops One', system-ui, sans-serif"
            />
          </div>

          <div className="w-[280px] sm:w-[440px] md:w-[580px] lg:w-[680px] -mt-2 sm:-mt-4">
            <StrokeText
              text="MATRIX"
              strokeColor="#EF4444"
              fillColor="#F8FAFC"
              strokeWidth={2.2}
              drawDuration={1.8}
              fillDelay={0.2}
              stagger={0.06}
              fillMode="wipe"
              fontSize={115}
              fontWeight={400}
              letterSpacing={-1}
              trigger="mount"
              fontFamily="var(--font-black-ops), 'Black Ops One', system-ui, sans-serif"
            />
          </div>
        </div>

        {/* FINAL STATE: TOP NAVBAR TEAM MATRIX TEXT (Fades + Pops in directly below top logo emblem) */}
        <div
          className={`fixed top-[60px] sm:top-[68px] left-1/2 -translate-x-1/2 z-50 transition-all duration-500 delay-200 ease-out ${
            isMovedToNav
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-75 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.35)]">
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-red-500 text-xs sm:text-sm md:text-base tracking-[0.2em]">
              TEAM
            </span>
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-slate-100 text-sm sm:text-base md:text-lg tracking-[0.08em] drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
              MATRIX
            </span>
          </div>
        </div>
      </div>

      {/* FULL SCREEN 3D DRONE CANVAS ANIMATION - Multi-stage sequential drone playback */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover filter drop-shadow-[0_0_55px_rgba(239,68,68,0.5)]"
        />
      </div>

      {/* BLUEPRINT SVG CALLOUT LINES & LABELS OVERLAY (4 CONSECUTIVE PAUSED SCROLLS) */}
      <ExplodedCallouts pauseProgress={pauseProgress} isVisible={isExplodedCalloutsVisible} />

      {/* HERO SCROLL PROMPT */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${
            scrollProgress > 0.05 ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono tracking-widest backdrop-blur-md animate-pulse">
            SCROLL TO PLAY 3D DRONE SEQUENCES
          </div>
          <div className="w-5 h-9 rounded-full border-2 border-red-500/50 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 bg-red-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
