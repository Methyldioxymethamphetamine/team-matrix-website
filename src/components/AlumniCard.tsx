"use client";

import BorderGlow from "@/components/BorderGlow";

export interface AlumniCardProps {
  name: string;
  currentOrg: string;
  batch: string;
  avatarUrl: string;
}

export default function AlumniCard({ name, currentOrg, batch, avatarUrl }: AlumniCardProps) {
  return (
    <div className="alumni-card group transition-transform duration-300 hover:-translate-y-1">
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

          {/* Batch badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 border border-red-500/40 backdrop-blur-md">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-red-300 font-semibold whitespace-nowrap">
              {batch}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-[1.05rem] leading-snug font-bold text-white">{name}</h3>
          <p className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-red-400/90">
            {currentOrg}
          </p>
        </div>
      </BorderGlow>
    </div>
  );
}
