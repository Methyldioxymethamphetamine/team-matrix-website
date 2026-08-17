"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StrokeText from "./StrokeText";
import DotField from "./DotField";
import ExplodedCallouts from "./ExplodedCallouts";
import GradualBlur from "./GradualBlur";
import Strands from "./Strands";

const DRONE_1_COUNT = 60;
const DRONE_2_COUNT = 70;
const DRONE_3_COUNT = 70;

export default function TubeLightLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMovedToNav, setIsMovedToNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Preloading & intro transition sync state
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);

  // Video state & refs for About section video
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

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

  // Preload transparent RGBA WebP frames for all 3 drone sequences + about-video.mp4
  useEffect(() => {
    let loadedCount = 0;
    const totalCount = DRONE_1_COUNT + DRONE_2_COUNT + DRONE_3_COUNT + 1; // 200 frames + 1 video

    const incrementLoad = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / totalCount) * 100));
      setLoadProgress(pct);
      if (loadedCount >= totalCount) {
        setIsAssetsLoaded(true);
      }
    };

    // 1) Sequence 1: drone.webm (60 frames)
    const imgs1: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_1_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.onload = incrementLoad;
      img.onerror = incrementLoad;
      img.src = `/tempfiles/drone_frames/frame_${idx}.webp`;
      imgs1.push(img);
    }
    setSeq1Images(imgs1);

    // 2) Sequence 2: drone1.webm (70 frames)
    const imgs2: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_2_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.onload = incrementLoad;
      img.onerror = incrementLoad;
      img.src = `/tempfiles/drone1_frames/frame_${idx}.webp`;
      imgs2.push(img);
    }
    setSeq2Images(imgs2);

    // 3) Sequence 3: drone_reversed.webm (70 frames)
    const imgs3: HTMLImageElement[] = [];
    for (let i = 1; i <= DRONE_3_COUNT; i++) {
      const img = new window.Image();
      const idx = String(i).padStart(3, "0");
      img.onload = incrementLoad;
      img.onerror = incrementLoad;
      img.src = `/tempfiles/drone_reversed_frames/frame_${idx}.webp`;
      imgs3.push(img);
    }
    setSeq3Images(imgs3);

    // 4) Preload about-video.mp4
    const videoObj = document.createElement("video");
    videoObj.src = "/tempfiles/about-video.mp4";
    videoObj.preload = "auto";
    videoObj.oncanplaythrough = incrementLoad;
    videoObj.onerror = incrementLoad;
    videoObj.load();

    const fallbackTimer = setTimeout(() => {
      setIsAssetsLoaded(true);
      setLoadProgress(100);
    }, 12000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Synchronize logo navigation transition to only happen when BOTH intro finished and assets fully loaded + 2s intentional delay
  useEffect(() => {
    if (introFinished && isAssetsLoaded) {
      const delayTimer = setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.style.overflow = "auto";
        }
        setIsMovedToNav(true);
      }, 2000); // Intentional 2 second loading screen delay

      return () => clearTimeout(delayTimer);
    }
  }, [introFinished, isAssetsLoaded]);

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
          // Signal that tubelight intro has finished
          setIntroFinished(true);
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

  // Multi-stage sequential 3D Canvas Frame Renderer
  useEffect(() => {
    if (!seq1Images.length || !seq2Images.length || !seq3Images.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const render = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const P = Math.min(1, Math.max(0, scrollY / maxScroll));
        setScrollProgress(P);

        let activeSet: HTMLImageElement[] = [];
        let localProgress = 0;
        let opacity = 0;

        // Sequence Stage 1: drone.webm (0.00 -> 0.40)
        // Stage 0 (0.00 -> 0.12): About Section taking over screen; drone canvas hidden (opacity = 0)
        // Stage 0.5 (0.12 -> 0.18): About Section fades out; drone canvas fades in (opacity 0 -> 1), frame 0 static
        // Stage 1 (0.18 -> 0.38): drone.webm scroll animation plays (0% to 100% of seq1Images)
        // Stage 1.5 (0.38 -> 0.42): Hold / fade drone.webm last frame
        if (P < 0.42) {
          activeSet = seq1Images;
          if (P < 0.12) {
            opacity = 0; // Completely hidden while About Team Matrix box takes over screen (3 scroll buffer)
            localProgress = 0;
          } else if (P < 0.18) {
            opacity = (P - 0.12) / 0.06; // Smooth fade in of drone canvas as About box fades out
            localProgress = 0;
          } else if (P < 0.38) {
            opacity = 1;
            localProgress = (P - 0.18) / 0.20; // Plays 100% of drone.webm
          } else {
            // Fade out drone.webm
            opacity = (0.42 - P) / 0.04;
            localProgress = 1;
          }
        }
        // Sequence Stage 2: drone1.webm (0.42 -> 0.62) - Plays explosion to 100%
        else if (P < 0.62) {
          activeSet = seq2Images;
          if (P < 0.44) {
            opacity = (P - 0.42) / 0.02; // Fade in drone1
            localProgress = 0;
          } else {
            opacity = 1;
            localProgress = (P - 0.44) / 0.18; // Plays 100% of drone1.webm to full exploded view
          }
        }
        // Sequence Stage 2.5: PAUSED EXPLODED FRAME (0.62 -> 0.80) - PAUSED SCROLLS FOR CALLOUTS
        else if (P < 0.80) {
          activeSet = seq2Images;
          opacity = 1;
          localProgress = 1; // Holds the fully exploded 3D frame static
        }
        // Sequence Stage 3: drone_reversed.webm (0.80 -> 1.00) - Collapses assembly back down
        else {
          activeSet = seq3Images;
          if (P < 0.94) {
            opacity = 1;
            localProgress = (P - 0.80) / 0.14; // Plays 100% of drone_reversed.webm
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

  const isExplodedCalloutsVisible = scrollProgress >= 0.60 && scrollProgress <= 0.82;
  const pauseProgress = Math.min(1, Math.max(0, (scrollProgress - 0.62) / 0.18));

  let aboutOpacity = 0;
  if (isMovedToNav) {
    if (scrollProgress <= 0.12) {
      aboutOpacity = 1;
    } else if (scrollProgress <= 0.18) {
      aboutOpacity = (0.18 - scrollProgress) / 0.06;
    } else {
      aboutOpacity = 0;
    }
  }

  // Auto pause about-video when user scrolls away
  useEffect(() => {
    if (aboutOpacity < 0.05 && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [aboutOpacity]);

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

      {/* THREE-ISLAND NAV: Left | (Logo center via logoGroupRef) | Right */}
      <header
        className={`fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 pointer-events-none transition-all duration-700 ${isMovedToNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        {/* LEFT ISLAND: About Work Drones */}
        <nav className="pointer-events-auto flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {["About", "Work", "Drones"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-slate-300/80 transition-all duration-200 hover:text-white hover:bg-white/[0.08] active:scale-95 whitespace-nowrap"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CENTER SPACER — logo is positioned by logoGroupRef */}
        <div className="flex-1" />

        {/* RIGHT ISLAND: FAQ Contact Join */}
        <nav className="pointer-events-auto flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {["FAQ", "Contact"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-slate-300/80 transition-all duration-200 hover:text-white hover:bg-white/[0.08] active:scale-95 whitespace-nowrap"
            >
              {label}
            </a>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <a
            href="#join"
            className="px-4 py-1.5 rounded-full text-sm font-sans font-semibold text-red-300 bg-red-950/50 border border-red-500/30 transition-all duration-200 hover:bg-red-900/60 hover:text-red-200 hover:shadow-[0_0_18px_rgba(239,68,68,0.3)] active:scale-95 whitespace-nowrap"
          >
            Join
          </a>
        </nav>
      </header>

      {/* LOGO & TEXT ANIMATION CONTAINER */}
      <div ref={logoGroupRef} className="fixed inset-0 z-50 pointer-events-none">
        {/* CENTER MATRIX LOGO EMBLEM (Transitions to top acrylic navbar center) */}
        <div
          className={`fixed transition-all duration-700 ease-in-out pointer-events-none ${isMovedToNav
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
          className={`fixed right-[calc(50%+7rem)] sm:right-[calc(50%+9.5rem)] md:right-[calc(50%+12.5rem)] lg:right-[calc(50%+14.5rem)] top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-500 ease-out ${isMovedToNav ? "opacity-0 scale-90" : "opacity-100 scale-100"
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

        {/* INITIAL PAGE LOADING INDICATOR BELOW LOGO */}
        {!isMovedToNav && (
          <div
            className={`fixed left-1/2 -translate-x-1/2 top-[70%] sm:top-[74%] flex flex-col items-center justify-center space-y-3.5 pointer-events-none z-50 transition-opacity duration-700 ${
              isAssetsLoaded && introFinished ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-center font-mono text-xs sm:text-sm tracking-[0.4em] text-red-500 font-bold uppercase animate-pulse drop-shadow-[0_0_14px_rgba(239,68,68,0.9)]">
              loading {Math.round(loadProgress)}%
            </div>
            {/* Material You Capsule Curved Loading Bar */}
            <div className="w-56 sm:w-72 md:w-80 h-2.5 sm:h-3 bg-slate-950/80 rounded-full overflow-hidden border border-red-500/40 p-0.5 shadow-[0_0_20px_rgba(239,68,68,0.35)] backdrop-blur-md">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full transition-all duration-300 shadow-[0_0_14px_rgba(239,68,68,0.9)]"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ABOUT TEAM MATRIX & VIDEO SECTION - Open layout split only by a neon red line */}
        <div
          className="fixed top-1/2 left-1/2 w-[92vw] max-w-[1380px] transition-all duration-700 ease-out z-50 pointer-events-auto"
          style={{
            opacity: aboutOpacity,
            transform: `translate(-50%, -50%) scale(${0.95 + 0.05 * aboutOpacity}) translateY(${(1 - aboutOpacity) * 20}px)`,
            pointerEvents: aboutOpacity > 0.05 ? "auto" : "none",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center text-left">
            
            {/* LEFT HALF: ABOUT TEAM MATRIX */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                  <h2 className="text-sm sm:text-base font-mono tracking-[0.2em] text-red-400 font-bold uppercase">
                    ABOUT TEAM MATRIX
                  </h2>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">
                  OFFICIAL ROBOTICS TEAM
                </span>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed font-sans font-normal tracking-wide max-h-[45vh] lg:max-h-[360px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-red-500/40">
                Team Matrix is the official robotics team at K.K. Wagh Institute of Engineering Education and Research, Nashik (An Autonomous Institute), affiliated with SPPU. Our team unites passionate students from diverse technical branches, including Mechanical, Electronics & Telecommunication, Robotics, and Computer Engineering. By fostering collaboration across disciplines, we develop innovative robotic solutions that highlight the strength of interdisciplinary engineering. Our journey is marked by numerous achievements, including participation in Techfest IIT Bombay 2024, Robotex National Championship 2024, IRoCU-2024 (ISRO Robotics Challenge, URSC Bengaluru), IRoCU-2025 and qualifying for Robotex International 2023 to represent India. We have also showcased our expertise at Robotex National Championship 2023, Robotex Maharashtra Zonal, BITS Goa QUARK, IIT Bombay Techfest, VJTI Roborace, LOGMIEER Roborace, GGSP Technical Fest Roborace, and Sapkal College Roborace.
              </p>
            </div>

            {/* CENTER NEON RED SEPARATING LINE */}
            <div className="hidden lg:block w-[2px] h-[340px] bg-gradient-to-b from-red-500/0 via-red-500 to-red-500/0 shadow-[0_0_18px_rgba(239,68,68,0.9)] rounded-full my-auto" />

            {/* RIGHT HALF: 16:9 VIDEO PLAYBACK */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                  <h3 className="text-sm sm:text-base font-mono tracking-[0.2em] text-red-400 font-bold uppercase">
                    TEAM MATRIX // VIDEO STREAM
                  </h3>
                </div>
                <button
                  onClick={toggleMute}
                  className="text-[10px] sm:text-xs font-mono text-slate-300 hover:text-red-400 tracking-wider flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                      MUTED
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      UNMUTED
                    </>
                  )}
                </button>
              </div>

              {/* 16:9 Aspect Ratio Video Container */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-red-500/35 bg-black/90 group shadow-[0_0_35px_rgba(239,68,68,0.2)]">
                <video
                  ref={videoRef}
                  src="/tempfiles/about-video.mp4"
                  muted={isMuted}
                  controls
                  preload="metadata"
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    type="button"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] transition-all hover:bg-slate-950/40 cursor-pointer group"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.85)] border border-red-400/80 transition-transform group-hover:scale-110">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="mt-2.5 text-[11px] sm:text-xs font-mono tracking-widest text-red-300 uppercase font-semibold drop-shadow-md">
                      Click to Play Video
                    </span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* FINAL STATE: TEAM MATRIX capsule — appears just below the logo in navbar */}
        <div
          className={`fixed top-[54px] sm:top-[60px] left-1/2 -translate-x-1/2 z-50 transition-all duration-500 delay-200 ease-out ${
            isMovedToNav
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-75 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d0d14]/85 backdrop-blur-xl border border-white/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-red-500 text-[11px] sm:text-xs tracking-[0.22em]">
              TEAM
            </span>
            <span className="font-[family-name:var(--font-black-ops)] font-normal text-slate-100 text-xs sm:text-sm tracking-[0.1em] drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]">
              MATRIX
            </span>
          </div>
        </div>
      </div>

      {/* FULL SCREEN 3D DRONE CANVAS ANIMATION */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover filter drop-shadow-[0_0_55px_rgba(239,68,68,0.5)]"
        />
      </div>

      {/* BLUEPRINT SVG CALLOUT LINES & LABELS OVERLAY */}
      <ExplodedCallouts pauseProgress={pauseProgress} isVisible={isExplodedCalloutsVisible} />

      {/* BOTTOM GRADUAL BACKDROP BLUR OVERLAY */}
      <GradualBlur
        target="page"
        position="bottom"
        height="4.5rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        zIndex={35}
      />

      {/* HERO SCROLL PROMPT */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${!isMovedToNav || scrollProgress > 0.12 ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
            }`}
        >
          <div className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 text-red-300 text-xs font-mono tracking-widest backdrop-blur-md animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            SCROLL TO PLAY 3D DRONE SEQUENCES
          </div>
          <div className="w-5 h-9 rounded-full border-2 border-red-500/50 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 bg-red-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
