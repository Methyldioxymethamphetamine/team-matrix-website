"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LEFT = [
  { label: "About", href: "/#about" },
  { label: "Members", href: "/members" },
  { label: "Gallery", href: "/gallery" },
];

const NAV_RIGHT = [
  { label: "Alumni", href: "/alumni" },
  { label: "Projects", href: "/projects" },
];

const ALL_LINKS = [...NAV_LEFT, ...NAV_RIGHT];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on route change — adjusted during render (React's
  // recommended way to reset state on a prop change) rather than in an
  // effect, so it takes effect before the stale menu ever paints.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Lock scroll while the mobile menu is open
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

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-8 pointer-events-none">
        {/* LEFT ISLAND — desktop only */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {NAV_LEFT.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${
                pathname === href
                  ? "text-white bg-white/[0.10]"
                  : "text-slate-300/80 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_16px_rgba(239,68,68,0.18)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Mobile spacer — balances the hamburger button so the logo stays centered */}
        <div className="md:hidden w-11 h-11" aria-hidden="true" />

        {/* CENTER LOGO */}
        <div className="pointer-events-auto relative flex flex-col items-center" style={{ flex: "0 0 auto" }}>
          {/* Breathing circuit ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <CircuitRing />
          </div>
          <Link href="/" className="relative z-10 w-12 sm:w-14 md:w-16 block transition-transform duration-300 hover:scale-110">
            <Image
              src="/tempfiles/matrixlogo (2).png"
              alt="Matrix Logo"
              width={80}
              height={80}
              className="w-full h-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* RIGHT ISLAND — desktop only */}
        <nav className="hidden md:flex pointer-events-auto items-center gap-0.5 px-2 py-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {NAV_RIGHT.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${
                pathname === href
                  ? "text-white bg-white/[0.10]"
                  : "text-slate-300/80 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_0_16px_rgba(239,68,68,0.18)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Link
            href="/apply"
            className={`px-4 py-1.5 rounded-full text-sm font-sans font-semibold text-red-300 bg-red-950/50 border border-red-500/30 transition-all duration-200 hover:bg-red-900/60 hover:text-red-200 active:scale-95 whitespace-nowrap ${
              pathname === "/apply" ? "bg-red-900/60 text-red-200" : ""
            }`}
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
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${
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
          {ALL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3.5 rounded-2xl text-base font-sans font-medium transition-colors ${
                pathname === href ? "text-white bg-white/[0.08]" : "text-slate-300/85 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/apply"
            onClick={() => setMenuOpen(false)}
            className={`mt-1 px-4 py-3.5 rounded-2xl text-base font-sans font-semibold text-center text-red-300 bg-red-950/50 border border-red-500/30 transition-colors ${
              pathname === "/apply" ? "bg-red-900/60 text-red-200" : "hover:bg-red-900/50 hover:text-red-200"
            }`}
          >
            Apply
          </Link>
        </nav>
      </div>
    </>
  );
}

/* Breathing SVG circuit ring */
function CircuitRing() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      className="circuit-ring"
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.18; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.45; transform: translate(-50%,-50%) scale(1.08); }
        }
        .circuit-ring {
          animation: breathe 3.2s ease-in-out infinite;
          transform-origin: center;
          pointer-events: none;
        }
      `}</style>

      {/* Outer ring */}
      <circle cx="36" cy="36" r="33" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="4 3" />
      {/* Inner ring */}
      <circle cx="36" cy="36" r="26" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 4" />

      {/* Cardinal tick marks */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 36 + 27 * Math.cos(rad);
        const y1 = 36 + 27 * Math.sin(rad);
        const x2 = 36 + 33 * Math.cos(rad);
        const y2 = 36 + 33 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />;
      })}

      {/* Diagonal mini ticks */}
      {[45, 135, 225, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 36 + 29 * Math.cos(rad);
        const y1 = 36 + 29 * Math.sin(rad);
        const x2 = 36 + 33 * Math.cos(rad);
        const y2 = 36 + 33 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round" />;
      })}

      {/* Circuit trace arcs — quadrant connectors */}
      <path d="M 36 3 L 36 10 M 36 62 L 36 69 M 3 36 L 10 36 M 62 36 L 69 36" stroke="#ef4444" strokeWidth="0.7" />
      <path d="M 15 15 L 20 20 M 57 15 L 52 20 M 15 57 L 20 52 M 57 57 L 52 52" stroke="#ef4444" strokeWidth="0.5" />

      {/* Small corner squares */}
      {[
        [18, 18], [52, 18], [18, 52], [52, 52]
      ].map(([cx, cy], i) => (
        <rect key={i} x={cx - 2} y={cy - 2} width="4" height="4" rx="0.5" stroke="#ef4444" strokeWidth="0.6" fill="none" />
      ))}
    </svg>
  );
}
