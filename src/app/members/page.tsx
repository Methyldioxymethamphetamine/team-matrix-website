"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DotField from "@/components/DotField";
import MemberCard from "@/components/MemberCard";
import CountUp from "@/components/CountUp";
import type { Member, Department } from "@/data/members";

type FilterValue = "All" | "Leadership" | Department;

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All", value: "All" },
  { label: "Leadership", value: "Leadership" },
  { label: "Mechanical", value: "Mechanical" },
  { label: "Electronics", value: "Electronics" },
  { label: "Algorithms", value: "Algorithms" },
  { label: "Management", value: "Management" },
];

export default function MembersPage() {
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/members")
      .then((r) => r.json())
      .then((data: Member[]) => {
        if (!cancelled) setMembers(data);
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const departmentCount = useMemo(
    () => new Set(members.map((m) => m.department)).size,
    [members]
  );
  const leadershipCount = useMemo(
    () => members.filter((m) => m.lead).length,
    [members]
  );

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesFilter =
        activeFilter === "All"
          ? true
          : activeFilter === "Leadership"
          ? Boolean(m.lead)
          : m.department === activeFilter;
      const matchesQuery =
        q.length === 0 ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [members, activeFilter, query]);

  // Animate the grid every time the filtered set changes
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll(".member-card");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.05,
        ease: "power3.out",
        overwrite: true,
      }
    );
  }, [filteredMembers]);

  return (
    <div className="relative min-h-screen w-full bg-black text-white select-none">
      {/* Background */}
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

      <main
        className="relative z-10 pt-28 pb-24 px-6 sm:px-8 max-w-[1400px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 right-0 h-[40vh]"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(239,68,68,0.10) 0%, transparent 70%)",
          }}
        />

        {/* Section header */}
        <div className="relative mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-10 h-[2px] rounded-full"
              style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.7)" }}
            />
            <span className="font-mono text-[0.55rem] tracking-[0.1em] sm:text-[0.7rem] sm:tracking-[0.28em] uppercase font-semibold text-red-400/85 whitespace-nowrap">
              TEAM MATRIX / MEMBERS
            </span>
          </div>

          <h1
            className="leading-[1.05] tracking-[-0.02em] text-slate-50 transition-all duration-700"
            style={{
              fontFamily: "var(--font-black-ops), 'Black Ops One', system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 400,
              textShadow: "0 0 40px rgba(239,68,68,0.3)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
            }}
          >
            Meet the{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #f87171 0%, #ef4444 60%, #b91c1c 100%)" }}
            >
              Team
            </span>
          </h1>

          <p className="font-sans text-[0.95rem] leading-relaxed text-slate-100/50 max-w-[48ch]">
            The engineers, designers, and builders behind every drone, robot, and victory.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              { label: "Members", value: members.length },
              { label: "Departments", value: departmentCount },
              { label: "Leadership", value: leadershipCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline gap-2 px-4 py-2.5 rounded-2xl bg-[#0d0d14]/70 backdrop-blur-xl border border-white/[0.07]"
              >
                <span
                  className="font-[family-name:var(--font-black-ops)] text-xl sm:text-2xl text-red-400 leading-none"
                  style={{ textShadow: "0 0 14px rgba(239,68,68,0.5)" }}
                >
                  <CountUp to={stat.value} duration={1.2} />
                </span>
                <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-slate-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter + search toolbar */}
        <div className="relative mb-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] w-fit">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  activeFilter === value
                    ? "text-white bg-red-600/90 shadow-[0_0_16px_rgba(239,68,68,0.45)]"
                    : "text-slate-300/80 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or role"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#0d0d14]/80 backdrop-blur-xl border border-white/[0.07] text-sm font-sans text-slate-100 placeholder:text-slate-500 outline-none focus:border-red-500/40 focus:shadow-[0_0_16px_rgba(239,68,68,0.25)] transition-all"
            />
          </div>
        </div>

        {/* Member grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 font-mono text-[0.8rem] tracking-[0.15em] text-slate-100/25">
            NO MEMBERS MATCH THIS SEARCH
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {filteredMembers.map((m) => (
              <MemberCard
                key={m.id}
                name={m.name}
                title={m.title}
                department={m.department}
                status={m.status}
                avatarUrl={m.avatarUrl}
                lead={m.lead}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
