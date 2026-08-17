"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StrokeText from "./StrokeText";
import DotField from "./DotField";

export default function TubeLightLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMovedToNav, setIsMovedToNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

          // After 0.5 seconds move logo to top acrylic nav & text to bottom of logo
          setTimeout(() => {
            setIsMovedToNav(true);
          }, 500);
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
        .to(logoGroup, { opacity: 0.8, filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))", duration: 0.06 })
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

  // Real-time Millisecond Scroll Video Scrubbing (runs every frame continuously)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const syncVideoToScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 15) {
        setIsMovedToNav(true);
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && video.duration && !isNaN(video.duration)) {
        // Slow down scroll-to-playback ratio so user scrolls more to play less video
        const progress = Math.min(1, Math.max(0, scrollY / (maxScroll * 0.95)));
        setScrollProgress(progress);

        const targetTime = progress * video.duration;

        // Instant frame seek update as user scrolls
        if (Math.abs(video.currentTime - targetTime) > 0.008) {
          if ("fastSeek" in video && typeof (video as { fastSeek?: (t: number) => void }).fastSeek === "function") {
            (video as { fastSeek: (t: number) => void }).fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        }
      }

      rafId = requestAnimationFrame(syncVideoToScroll);
    };

    rafId = requestAnimationFrame(syncVideoToScroll);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[600vh] w-full bg-black text-white select-none">
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

        {/* TEAM MATRIX TEXT (Transitions to directly below logo emblem in ONE single line, same Orbitron font) */}
        <div
          className={`fixed transition-all duration-700 ease-in-out ${
            isMovedToNav
              ? "top-[60px] sm:top-[68px] left-1/2 -translate-x-1/2 translate-y-0 flex flex-row items-center justify-center gap-2 whitespace-nowrap pointer-events-auto"
              : "right-[calc(50%+7rem)] sm:right-[calc(50%+9.5rem)] md:right-[calc(50%+12.5rem)] lg:right-[calc(50%+14.5rem)] top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none"
          }`}
        >
          {isMovedToNav ? (
            /* FINAL STATE: Single line, same Orbitron font, preserving design colors, below logo emblem */
            <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.35)]">
              <span className="font-orbitron font-extrabold text-red-500 text-xs sm:text-sm md:text-base tracking-[0.25em]">
                TEAM
              </span>
              <span className="font-orbitron font-black text-slate-100 text-sm sm:text-base md:text-lg tracking-[0.1em] drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
                MATRIX
              </span>
            </div>
          ) : (
            /* INITIAL STATE: Stacked StrokeText to the Left of Logo */
            <>
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
                  fontWeight={800}
                  letterSpacing={14}
                  trigger="mount"
                  fillMode="fade"
                  fontFamily="var(--font-orbitron), sans-serif"
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
                  fontWeight={900}
                  letterSpacing={-1}
                  trigger="mount"
                  fontFamily="var(--font-orbitron), sans-serif"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* TRANSPARENT WEBM DRONE VIDEO - Millisecond scroll scrubbing */}
      <div
        className={`fixed inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
          scrollProgress > 0.005 ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          src="/tempfiles/drone.webm"
          muted
          playsInline
          preload="auto"
          className="w-full max-w-2xl md:max-w-4xl h-auto object-contain drop-shadow-[0_0_50px_rgba(239,68,68,0.45)]"
        />
      </div>

      {/* HERO SCROLL PROMPT */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${
            scrollProgress > 0.05 ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/20 text-red-300 text-xs font-mono tracking-widest backdrop-blur-md animate-pulse">
            SCROLL TO PLAY 3D DRONE TELEMETRY
          </div>
          <div className="w-5 h-9 rounded-full border-2 border-red-500/50 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 bg-red-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
