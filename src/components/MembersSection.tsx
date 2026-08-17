"use client";

import ProfileCard from "./ProfileCard";
import { members } from "@/data/members";

interface MembersSectionProps {
  visible: boolean;
}

// Red-themed gradient + glow to match Team Matrix aesthetic
const CARD_GRADIENT =
  "linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(10,10,15,0.96) 100%)";
const CARD_GLOW = "rgba(239, 68, 68, 0.5)";

export default function MembersSection({ visible }: MembersSectionProps) {
  return (
    <section
      aria-label="Members"
      style={{
        minHeight: "100vh",
        paddingTop: "8vh",
        paddingBottom: "10vh",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Ambient red glow backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(239,68,68,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        {/* ── Section header ───────────────────────────────────────────── */}
        <div
          style={{
            marginBottom: "3.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.25rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "2.5rem",
                height: "2px",
                background: "#ef4444",
                boxShadow: "0 0 10px rgba(239,68,68,0.9)",
                borderRadius: "9999px",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(239,68,68,0.85)",
                fontWeight: 600,
              }}
            >
              TEAM MATRIX / MEMBERS
            </span>
          </div>

          <h2
            style={{
              fontFamily:
                "var(--font-black-ops), 'Black Ops One', system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 400,
              color: "#f8fafc",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              textShadow: "0 0 40px rgba(239,68,68,0.3)",
            }}
          >
            Meet the Team
          </h2>

          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.95rem",
              color: "rgba(248,250,252,0.55)",
              maxWidth: "48ch",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            The engineers, designers, and builders behind every drone, robot, and victory.
          </p>
        </div>

        {/* ── 4 × 2 ProfileCard grid ───────────────────────────────────── */}
        <div
          className="members-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
        >
          {members.map((m) => (
            <ProfileCard
              key={m.id}
              name={m.name}
              title={m.title}
              handle={m.handle}
              status={m.status}
              avatarUrl={m.avatarUrl}
              contactText="Contact"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowEnabled={true}
              behindGlowColor={CARD_GLOW}
              innerGradient={CARD_GRADIENT}
            />
          ))}
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 1100px) {
          .members-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .members-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
