"use client";

import type { ReactNode } from "react";
import type { Department } from "@/data/members";
import BorderGlow from "@/components/BorderGlow";

export interface MemberCardProps {
  name: string;
  title: string;
  department: Department;
  status: string;
  avatarUrl: string;
  lead?: boolean;
  onContact?: () => void;
}

const DEPARTMENT_ICON: Record<Department, ReactNode> = {
  Leadership: (
    <path d="M12 2l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 15.9l-5.5 2.7 1.4-6.1-4.7-4.2 6.2-.6L12 2z" />
  ),
  Mechanical: (
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2-2 2.1-2.1z" />
  ),
  Electronics: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
    </>
  ),
  Algorithms: (
    <path d="M9 4 4 12l5 8M15 4l5 8-5 8" />
  ),
  Management: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
};

export default function MemberCard({
  name,
  title,
  department,
  status,
  avatarUrl,
  lead = false,
  onContact,
}: MemberCardProps) {
  return (
    <div className="member-card group transition-transform duration-300 hover:-translate-y-1">
      <BorderGlow borderRadius={16}>
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#111117]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />

          {/* Seam gradient into the footer */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

          {/* Lead badge */}
          {lead && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 border border-red-500/40 backdrop-blur-md">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 15.9l-5.5 2.7 1.4-6.1-4.7-4.2 6.2-.6L12 2z" />
              </svg>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-red-300 font-semibold">
                Lead
              </span>
            </div>
          )}

          {/* Status dot */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/55 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-slate-300">
              {status}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <h3 className="text-[1.05rem] leading-snug font-bold text-white">{name}</h3>
            <p className="mt-0.5 font-mono text-[0.68rem] tracking-[0.12em] uppercase text-red-400/90">
              {title}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <span className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-slate-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                {DEPARTMENT_ICON[department]}
              </svg>
              {department}
            </span>
            <button
              type="button"
              onClick={onContact}
              className="px-3 py-1.5 rounded-full text-[0.68rem] font-sans font-medium text-slate-300 border border-white/[0.12] transition-all duration-200 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 active:scale-95"
            >
              Contact
            </button>
          </div>
        </div>
      </BorderGlow>
    </div>
  );
}
