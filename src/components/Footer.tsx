"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Placeholder for future Admin Login modal/route
  };

  return (
    <footer className="relative z-30 w-full bg-[#08080c] border-t border-red-500/20 text-slate-200 overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Logo & Address */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-start gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
              <Image
                src="/tempfiles/matrix-logo (1).webp"
                alt="Team Matrix Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-[family-name:var(--font-black-ops)] text-xl sm:text-2xl text-white tracking-wider">
                TEAM MATRIX
              </h3>
              <p className="font-mono text-xs sm:text-sm text-slate-300 uppercase leading-relaxed tracking-wide font-medium">
                K.K. WAGH INSTITUTE OF ENGINEERING EDUCATION &amp; RESEARCH, NASHIK
              </p>
              <p className="font-mono text-xs text-red-400/90 font-semibold tracking-widest uppercase">
                MAHARASHTRA - 422003, INDIA
              </p>
            </div>
          </div>

          {/* CENTER COLUMN: Quick Links */}
          <div className="md:col-span-4 flex flex-col space-y-3">
            <h4 className="font-[family-name:var(--font-black-ops)] text-sm tracking-[0.2em] text-red-500 uppercase">
              QUICK LINKS
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 font-mono text-xs sm:text-sm tracking-wider uppercase">
              <a
                href="#"
                className="text-slate-300 hover:text-red-400 transition-colors duration-200"
              >
                HOME
              </a>
              <a
                href="#members"
                className="text-slate-300 hover:text-red-400 transition-colors duration-200"
              >
                MEMBERS
              </a>
              <a
                href="#about"
                className="text-slate-300 hover:text-red-400 transition-colors duration-200"
              >
                ABOUT
              </a>
              <a
                href="#sponsors"
                className="text-slate-300 hover:text-red-400 transition-colors duration-200"
              >
                SPONSORS
              </a>
              <a
                href="#stories"
                className="text-slate-300 hover:text-red-400 transition-colors duration-200"
              >
                STORIES
              </a>
              <button
                onClick={handleAdminClick}
                className="text-left text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 cursor-pointer"
              >
                ADMIN LOGIN
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Info */}
          <div className="md:col-span-3 flex flex-col space-y-3.5 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-3 text-slate-200 hover:text-red-400 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <a href="tel:8412843505" className="tracking-wider">
                8412843505 / 8956271193
              </a>
            </div>

            <div className="flex items-center gap-3 text-slate-200 hover:text-red-400 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center flex-shrink-0 text-red-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <a
                href="mailto:teammatrixofficials@gmail.com"
                className="tracking-wider text-xs sm:text-xs truncate"
              >
                TEAMMATRIXOFFICIALS@GMAIL.COM
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM SUB-FOOTER */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <p className="tracking-widest uppercase text-center sm:text-left">
            &copy; 2025 TEAM MATRIX. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-4">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/teammatrix._/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/company/team-matrixs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Admin Login Icon Button */}
            <button
              onClick={handleAdminClick}
              title="Admin Login"
              aria-label="Admin Login"
              className="px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 hover:text-white hover:bg-red-900/60 hover:border-red-500 flex items-center gap-1.5 transition-all duration-200 cursor-pointer font-mono text-[11px]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>ADMIN</span>
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}
