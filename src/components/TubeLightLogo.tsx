"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StrokeText from "./StrokeText";
import DotField from "./DotField";
import GradualBlur from "./GradualBlur";
import Strands from "./Strands";
import SponsorsSection from "./SponsorsSection";
import Footer from "./Footer";

const DRONE_1_COUNT = 60;

export default function TubeLightLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMovedToNav, setIsMovedToNav] = useState(false);
  const [readyForScroll, setReadyForScroll] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Preloading & intro transition sync state
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);

  // Tracks whether scroll animation sections should be visible
  const [worksRawVisible, setWorksRawVisible] = useState(false);

  // Video state & refs for About section video
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => { });
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

  // In-memory frame buffer for drone 3D animation sequence
  const [seq1Images, setSeq1Images] = useState<HTMLImageElement[]>([]);

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

  // Preload transparent RGBA WebP frames for drone sequence + about-video.mp4
  useEffect(() => {
    let loadedCount = 0;
    const totalCount = DRONE_1_COUNT + 1; // 60 frames + 1 video

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

    // 2) Preload about-video.mp4
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

  // Synchronize: after intro + assets + 3s intentional delay → set readyForScroll
  // Then the FIRST scroll/wheel event triggers isMovedToNav (task 5 + 5.1)
  useEffect(() => {
    if (introFinished && isAssetsLoaded) {
      const delayTimer = setTimeout(() => {
        setReadyForScroll(true);
      }, 3000); // Intentional 3s loading screen delay

      return () => clearTimeout(delayTimer);
    }
  }, [introFinished, isAssetsLoaded]);

  // Scroll-triggered transition: first scroll after ready → fly logo to nav
  useEffect(() => {
    if (!readyForScroll || isMovedToNav) return;

    const triggerNav = () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
      }
      setIsMovedToNav(true);
    };

    window.addEventListener("scroll", triggerNav, { once: true, passive: true });
    window.addEventListener("wheel", triggerNav, { once: true, passive: true });
    window.addEventListener("touchmove", triggerNav, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", triggerNav);
      window.removeEventListener("wheel", triggerNav);
      window.removeEventListener("touchmove", triggerNav);
    };
  }, [readyForScroll, isMovedToNav]);

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

      // Tubelight turn-on flicker sequence (reduced glow intensities)
      tl.set(logoGroup, { opacity: 0, filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))" })
        .to(logoGroup, { opacity: 0.1, duration: 0.12 })
        .to(logoGroup, { opacity: 0, duration: 0.06 })
        .to(logoGroup, { opacity: 0.85, filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))", duration: 0.05 })
        .to(logoGroup, { opacity: 0.15, filter: "drop-shadow(0 0 2px rgba(239, 68, 68, 0.15))", duration: 0.1 })
        .to(logoGroup, { opacity: 0.95, filter: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))", duration: 0.04 })
        .to(logoGroup, { opacity: 0.2, filter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.15))", duration: 0.08 })
        .to(logoGroup, { opacity: 1, filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 28px rgba(239, 68, 68, 0.5))", duration: 0.12 })
        .to(logoGroup, { opacity: 0.85, filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))", duration: 0.06 })
        .to(logoGroup, {
          opacity: 1,
          filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 24px rgba(239, 68, 68, 0.4))",
          duration: 0.15,
        });

      // Subtle ambient hum glow — much softer
      gsap.to(logoGroup, {
        filter: "drop-shadow(0 0 16px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 32px rgba(239, 68, 68, 0.35))",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: tl.duration(),
      });
    },
    { scope: containerRef }
  );

  // 3D Canvas Frame Renderer for Drone Sequence
  useEffect(() => {
    if (!seq1Images.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const render = () => {
      const scrollY = window.scrollY;

      // ─── DRONE SCROLL BUDGET (decoupled from total page height) ───────────────
      // Drone animation runs across 350vh of scrolling (= 3.5 * innerHeight px).
      // Higher scroll sensitivity than a 1:1 budget — the same physical scroll
      // covers more of the animation. Keep this in sync with the spacer height
      // below, or the animation will finish with unscrolled empty space left.
      const DRONE_VH = 3.5; // 350vh expressed as viewport-height multiples
      const droneMaxPx = DRONE_VH * window.innerHeight;
      const P = Math.min(1, Math.max(0, scrollY / droneMaxPx));
      setScrollProgress(P);

      // ─── OUR STORIES VISIBILITY ────────────────────────────────────────
      // Visible once drone animation wraps up (P >= 0.95)
      setWorksRawVisible(P >= 0.95);

      let activeSet: HTMLImageElement[] = seq1Images;
      let localProgress = 0;
      let opacity = 0;

      // Sequence Stage 1: drone.webm (0.00 -> 1.00)
      // Stage 0 (0.00 -> 0.12): About Section taking over screen; drone canvas hidden (opacity = 0)
      // Stage 0.5 (0.12 -> 0.18): About Section fades out; drone canvas fades in (opacity 0 -> 1), frame 0 static
      // Stage 1 (0.18 -> 0.55): drone.webm scroll animation plays (0% to 100% of seq1Images)
      // Stage 1.5 (0.55 -> 0.65): Hold drone.webm last frame static
      // Stage 2 (0.65 -> 0.75): Fade out drone canvas smoothly — finishes well before P=0.80, the
      //   point where the Apply CTA section (right after this 350vh spacer) starts entering the
      //   viewport from below. Without that margin, the fixed full-screen canvas (z-20) would still
      //   be opaque/fading on top of the CTA while it scrolls in, hiding it underneath.
      // Stage 3 (0.75 -> 1.00): Fully hidden — nothing left to draw, canvas is inert.
      if (P < 0.12) {
        opacity = 0; // Completely hidden while About Team Matrix box takes over screen
        localProgress = 0;
      } else if (P < 0.18) {
        opacity = (P - 0.12) / 0.06; // Smooth fade in of drone canvas as About box fades out
        localProgress = 0;
      } else if (P < 0.55) {
        opacity = 1;
        localProgress = (P - 0.18) / 0.37; // Plays 100% of drone.webm
      } else if (P < 0.65) {
        // Hold last frame static
        opacity = 1;
        localProgress = 1;
      } else if (P < 0.75) {
        // Fade out drone canvas smoothly
        opacity = Math.max(0, 1 - (P - 0.65) / 0.10);
        localProgress = 1;
      } else {
        opacity = 0;
        localProgress = 1;
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

          // The drone frames are 16:9 (landscape). On a landscape/desktop
          // canvas, COVER (fill the screen, cropping overflow) looks right.
          // On a portrait mobile canvas, COVER would crop most of the frame
          // away sideways to fill the tall viewport — instead CONTAIN so the
          // whole drone fits on screen, centered, with the page's own
          // background showing through the letterboxed top/bottom.
          const isPortrait = canvas.width < canvas.height;
          const ratio = isPortrait
            ? Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
            : Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);

          const drawW = img.naturalWidth * ratio;
          const drawH = img.naturalHeight * ratio;
          const offsetX = (canvas.width - drawW) / 2;
          const offsetY = (canvas.height - drawH) / 2;

          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

          // On mobile (contain mode), the frame's top/bottom edges land in the
          // middle of the screen as a hard rectangular cutoff. Feather them
          // into transparency so the drone fades into the background instead
          // of showing an obvious box edge.
          if (isPortrait) {
            const fadeHeight = Math.min(90 * dpr, drawH * 0.3);
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "destination-out";

            const topFade = ctx.createLinearGradient(0, offsetY, 0, offsetY + fadeHeight);
            topFade.addColorStop(0, "rgba(0,0,0,1)");
            topFade.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = topFade;
            ctx.fillRect(offsetX, offsetY, drawW, fadeHeight);

            const bottomFade = ctx.createLinearGradient(0, offsetY + drawH - fadeHeight, 0, offsetY + drawH);
            bottomFade.addColorStop(0, "rgba(0,0,0,0)");
            bottomFade.addColorStop(1, "rgba(0,0,0,1)");
            ctx.fillStyle = bottomFade;
            ctx.fillRect(offsetX, offsetY + drawH - fadeHeight, drawW, fadeHeight);

            ctx.restore();
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [seq1Images]);

  const isExplodedCalloutsVisible = scrollProgress >= 0.74 && scrollProgress <= 0.88;
  const pauseProgress = Math.min(1, Math.max(0, (scrollProgress - 0.76) / 0.10));

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

  // Lock scroll + allow Escape while the mobile nav menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Our Stories visible when: intro done + raw scroll past 2-viewport delay
  const worksVisible = isMovedToNav && worksRawVisible;

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white select-none">
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

      {/* ── SCROLL ANCHORS ── */}
      {/* #about  → About Team Matrix section (visible 0–1.98vh, anchor at 100vh) */}
      <div id="about"  aria-hidden="true" style={{ position: "absolute", top: "100vh",  left: 0, width: 1, height: 1, pointerEvents: "none" }} />
      {/* #drones → drone animation starts at P≈0.20 of 350vh = ~70vh scroll */}
      <div id="drones" aria-hidden="true" style={{ position: "absolute", top: "200vh",  left: 0, width: 1, height: 1, pointerEvents: "none" }} />

      {/* THREE-ISLAND NAV: Left | Center logo | Right */}
      <header
        className={`fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 pointer-events-none transition-all duration-700 ${isMovedToNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        {/* LEFT ISLAND: About Members Gallery — desktop only */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {([
            { label: "About",   href: "#about"    },
            { label: "Members", href: "/members"  },
            { label: "Gallery", href: "/gallery"  },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-slate-300/80 transition-all duration-200 hover:text-white hover:bg-white/[0.08] active:scale-95 whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile spacer — balances the hamburger button so the logo stays centered */}
        <div className="md:hidden w-11 h-11" aria-hidden="true" />

        {/* CENTER SPACER — logo is positioned by logoGroupRef */}
        <div className="flex-1" />

        {/* RIGHT ISLAND: Alumni Projects Apply — desktop only */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {([
            { label: "Alumni",   href: "/alumni"   },
            { label: "Projects", href: "/projects" },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-1.5 rounded-full text-sm font-sans font-medium text-slate-300/80 transition-all duration-200 hover:text-white hover:bg-white/[0.08] active:scale-95 whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Link
            href="/apply"
            className="px-4 py-1.5 rounded-full text-sm font-sans font-semibold text-red-300 bg-red-950/50 border border-red-500/30 transition-all duration-200 hover:bg-red-900/60 hover:text-red-200 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] active:scale-95 whitespace-nowrap"
          >
            Apply
          </Link>
        </nav>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] active:scale-95 transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="text-slate-200">
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[45] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <nav
          className={`absolute top-20 left-5 right-5 rounded-3xl bg-[#0d0d14]/95 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-2 flex flex-col transition-all duration-300 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          {([
            { label: "About",    href: "#about"    },
            { label: "Members",  href: "/members"  },
            { label: "Gallery",  href: "/gallery"  },
            { label: "Alumni",   href: "/alumni"   },
            { label: "Projects", href: "/projects" },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3.5 rounded-2xl text-base font-sans font-medium text-slate-300/85 transition-colors hover:text-white hover:bg-white/[0.06]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/apply"
            onClick={() => setMenuOpen(false)}
            className="mt-1 px-4 py-3.5 rounded-2xl text-base font-sans font-semibold text-center text-red-300 bg-red-950/50 border border-red-500/30 transition-colors hover:bg-red-900/50 hover:text-red-200"
          >
            Apply
          </Link>
        </nav>
      </div>

      {/* LOGO & TEXT ANIMATION CONTAINER */}
      <div ref={logoGroupRef} className="fixed inset-0 z-50 pointer-events-none">
        {/* CENTER MATRIX LOGO EMBLEM (Transitions to top acrylic navbar center) */}
        <div
          className={`fixed transition-all duration-700 ease-in-out pointer-events-none ${isMovedToNav
            ? "top-2 sm:top-3 left-1/2 -translate-x-1/2 w-12 sm:w-14 md:w-16 translate-y-0"
            : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 sm:w-72 md:w-88 lg:w-[380px]"
            }`}
        >
          {/* Breathing circuit ring — only visible in nav state */}
          {isMovedToNav && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "scale(3.2)" }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="circuit-ring-nav" aria-hidden="true">
                <style>{`
                  @keyframes breatheNav {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50%       { opacity: 0.40; transform: scale(1.06); }
                  }
                  .circuit-ring-nav {
                    animation: breatheNav 3.4s ease-in-out infinite;
                    transform-origin: center;
                  }
                `}</style>
                <circle cx="36" cy="36" r="33" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 3" />
                <circle cx="36" cy="36" r="26" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 4" />
                {[0, 90, 180, 270].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line key={angle}
                      x1={36 + 27 * Math.cos(rad)} y1={36 + 27 * Math.sin(rad)}
                      x2={36 + 33 * Math.cos(rad)} y2={36 + 33 * Math.sin(rad)}
                      stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"
                    />
                  );
                })}
                {[45, 135, 225, 315].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line key={angle}
                      x1={36 + 29 * Math.cos(rad)} y1={36 + 29 * Math.sin(rad)}
                      x2={36 + 33 * Math.cos(rad)} y2={36 + 33 * Math.sin(rad)}
                      stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round"
                    />
                  );
                })}
                <path d="M 36 3 L 36 10 M 36 62 L 36 69 M 3 36 L 10 36 M 62 36 L 69 36" stroke="#ef4444" strokeWidth="0.7" />
                <path d="M 15 15 L 20 20 M 57 15 L 52 20 M 15 57 L 20 52 M 57 57 L 52 52" stroke="#ef4444" strokeWidth="0.5" />
                {[[18,18],[52,18],[18,52],[52,52]].map(([cx, cy], i) => (
                  <rect key={i} x={cx-2} y={cy-2} width="4" height="4" rx="0.5" stroke="#ef4444" strokeWidth="0.6" fill="none" />
                ))}
              </svg>
            </div>
          )}
          <Image
            src="/tempfiles/matrixlogo (2).png"
            alt="Matrix Logo"
            width={500}
            height={500}
            className="w-full h-auto object-contain drop-shadow-[0_0_18px_rgba(239,68,68,0.35)]"
            priority
          />
        </div>

        {/* MOBILE (< sm): stacked ABOVE the logo — the desktop "beside logo" layout
            below needs way more horizontal room than a phone has (it starts
            clipping off the left edge well under 640px). */}
        <div
          className={`sm:hidden fixed left-1/2 -translate-x-1/2 top-[12%] flex flex-col items-center text-center pointer-events-none transition-all duration-500 ease-out ${isMovedToNav ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
        >
          <div className="w-[150px]">
            <StrokeText
              text="TEAM"
              strokeColor="#EF4444"
              fillColor="#EF4444"
              strokeWidth={2}
              drawDuration={1.2}
              fillDelay={0.1}
              stagger={0.07}
              fontSize={28}
              fontWeight={400}
              letterSpacing={8}
              trigger="mount"
              fillMode="fade"
              fontFamily="var(--font-black-ops), 'Black Ops One', system-ui, sans-serif"
            />
          </div>
          <div className="w-[210px] -mt-1">
            <StrokeText
              text="MATRIX"
              strokeColor="#EF4444"
              fillColor="#F8FAFC"
              strokeWidth={1.6}
              drawDuration={1.5}
              fillDelay={0.15}
              stagger={0.05}
              fillMode="wipe"
              fontSize={54}
              fontWeight={400}
              letterSpacing={-1}
              trigger="mount"
              fontFamily="var(--font-black-ops), 'Black Ops One', system-ui, sans-serif"
            />
          </div>
        </div>

        {/* sm and up: stacked to the LEFT of the logo */}
        <div
          className={`hidden sm:flex fixed sm:right-[calc(50%+9.5rem)] md:right-[calc(50%+12.5rem)] lg:right-[calc(50%+14.5rem)] top-1/2 -translate-y-1/2 flex-col items-center justify-center text-center pointer-events-none transition-all duration-500 ease-out ${isMovedToNav ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
        >
          <div className="w-[300px] md:w-[380px] lg:w-[460px]">
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

          <div className="w-[440px] md:w-[580px] lg:w-[680px] -mt-2 sm:-mt-4">
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
            className={`fixed left-1/2 -translate-x-1/2 top-[70%] sm:top-[74%] flex flex-col items-center justify-center space-y-3.5 pointer-events-none z-50 transition-opacity duration-700`}
          >
            {/* Loading progress — fades once assets ready */}
            <div className={`flex flex-col items-center gap-3 transition-opacity duration-700 ${readyForScroll ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <div className="text-center font-mono text-xs sm:text-sm tracking-[0.4em] text-red-500 font-bold uppercase animate-pulse">
                loading {Math.round(loadProgress)}%
              </div>
              {/* Material You Capsule Loading Bar */}
              <div className="w-56 sm:w-72 md:w-80 h-2.5 sm:h-3 bg-slate-950/80 rounded-full overflow-hidden border border-red-500/30 p-0.5 backdrop-blur-md">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 rounded-full transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
            {/* SCROLL TO ENTER — appears after 3s delay */}
            <div className={`flex flex-col items-center gap-3 transition-all duration-700 ${readyForScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="px-5 py-2 rounded-full border border-red-500/40 bg-black/50 text-red-300 text-xs font-mono tracking-[0.3em] backdrop-blur-md animate-pulse">
                SCROLL TO ENTER
              </div>
              <div className="w-5 h-9 rounded-full border-2 border-red-500/40 flex items-start justify-center p-1 bg-black/30 backdrop-blur-sm">
                <div className="w-1.5 h-2.5 bg-red-500/80 rounded-full animate-bounce" />
              </div>
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
              <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-red-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)] flex-shrink-0" />
                  <h2 className="text-xs sm:text-sm md:text-base font-mono tracking-[0.08em] sm:tracking-[0.2em] text-red-400 font-bold uppercase whitespace-nowrap">
                    ABOUT TEAM MATRIX
                  </h2>
                </div>
                <span className="text-[9px] sm:text-xs font-mono text-slate-400 tracking-tight sm:tracking-wider whitespace-nowrap">
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
              <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-red-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)] flex-shrink-0" />
                  <h3 className="text-xs sm:text-sm md:text-base font-mono tracking-[0.08em] sm:tracking-[0.2em] text-red-400 font-bold uppercase whitespace-nowrap">
                    <span className="sm:hidden">VIDEO STREAM</span>
                    <span className="hidden sm:inline">TEAM MATRIX // VIDEO STREAM</span>
                  </h3>
                </div>
                <button
                  onClick={toggleMute}
                  className="text-[9px] sm:text-xs font-mono text-slate-300 hover:text-red-400 tracking-tight sm:tracking-wider flex items-center gap-1.5 bg-red-950/60 border border-red-500/40 px-2.5 sm:px-3 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isMuted ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                      MUTED
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      </div>

      {/* FULL SCREEN 3D DRONE CANVAS ANIMATION */}
      <div className="fixed inset-0 z-20 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>

      {/* TOP GRADUAL BACKDROP BLUR OVERLAY (Z-35: ABOVE CONTENT AT Z-25, BELOW NAV AT Z-40) */}
      <GradualBlur
        target="page"
        position="top"
        height="5.5rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential={true}
        zIndex={35}
      />

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

      {/* HERO SCROLL PROMPT — shown after logo reaches nav */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-700 ${!isMovedToNav || scrollProgress > 0.12 ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
            }`}
        >
          <div className="px-4 py-1.5 rounded-full border border-red-500/25 bg-black/50 text-red-300/80 text-center whitespace-nowrap text-[9px] tracking-[0.08em] sm:text-xs sm:tracking-widest font-mono backdrop-blur-md animate-pulse">
            <span className="sm:hidden">SCROLL TO PLAY ANIMATION</span>
            <span className="hidden sm:inline">SCROLL TO PLAY 3D DRONE ANIMATION</span>
          </div>
          <div className="w-5 h-9 rounded-full border-2 border-red-500/40 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 bg-red-500/80 rounded-full animate-bounce" />
          </div>
        </div>
      </div>


      {/* Spacer equal to the drone scroll budget (DRONE_VH above) — gives the fixed canvas animation scroll distance */}
      <div style={{ height: "350vh" }} aria-hidden="true" />

      {/* ── FINAL SCREEN — Apply CTA + Sponsors + Footer, grouped so the whole
          closing block is at most one viewport tall: the CTA+Sponsors pair
          centers in the space above the footer, and the footer sits right
          under it — reaching the bottom of the scroll shows the Apply card
          too, not just the footer. */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          {/* Apply CTA */}
          <section className="relative w-full py-8 sm:py-10 px-6 flex flex-col items-center justify-center text-center gap-3 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(239,68,68,0.10) 0%, transparent 70%)",
              }}
            />
            <div className="relative flex items-center gap-2.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.1em] sm:text-[10px] sm:tracking-[0.3em] text-red-400 uppercase whitespace-nowrap">Team Matrix / Recruitment</span>
            </div>

            <h2 className="relative font-[family-name:var(--font-black-ops)] text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight">
              Ready to Build <span className="text-red-500 drop-shadow-[0_0_24px_rgba(239,68,68,0.5)]">With Us?</span>
            </h2>

            <p className="relative max-w-md text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
              We&apos;re always looking for passionate engineers, designers, and builders to join Team Matrix.
            </p>

            <Link
              href="/apply"
              className="
                relative group mt-1
                px-10 py-3 rounded-full
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
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10">APPLY NOW</span>
            </Link>
          </section>

          {/* Sponsors */}
          <SponsorsSection />
        </div>

        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </div>
  );
}
