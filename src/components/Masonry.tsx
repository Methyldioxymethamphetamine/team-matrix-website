"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
  title?: string;
  category?: string;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  /** When true, the container itself fades in (used for section reveal) */
  visible?: boolean;
  visibleDuration?: number;
}

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  visible = true,
  visibleDuration = 1.0,
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Build initial-from values based on animateFrom
  const getFrom = () => {
    const base: gsap.TweenVars = {
      opacity: 0,
      filter: blurToFocus ? "blur(12px)" : undefined,
    };
    if (animateFrom === "bottom") base.y = 60;
    if (animateFrom === "top") base.y = -60;
    if (animateFrom === "left") base.x = -60;
    if (animateFrom === "right") base.x = 60;
    return base;
  };

  // Animate cards in when `visible` flips to true
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !visible) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const cards = container.querySelectorAll<HTMLElement>(".masonry-card");

    gsap.fromTo(
      cards,
      getFrom(),
      {
        opacity: 1,
        y: 0,
        x: 0,
        filter: blurToFocus ? "blur(0px)" : undefined,
        duration,
        stagger,
        ease,
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Per-card hover GSAP effects
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>(".masonry-card");

    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      const img = card.querySelector<HTMLElement>(".masonry-img");

      const onEnter = () => {
        if (scaleOnHover && img) {
          gsap.to(img, { scale: 1.07, duration: 0.4, ease: "power2.out" });
        }
        if (colorShiftOnHover) {
          gsap.to(card, {
            filter: "hue-rotate(20deg) brightness(1.1)",
            duration: 0.4,
          });
        }
        gsap.to(card, { scale: hoverScale, duration: 0.35, ease: "power2.out" });
      };

      const onLeave = () => {
        if (scaleOnHover && img) {
          gsap.to(img, { scale: 1.0, duration: 0.4, ease: "power2.inOut" });
        }
        if (colorShiftOnHover) {
          gsap.to(card, { filter: "none", duration: 0.4 });
        }
        gsap.to(card, { scale: 1.0, duration: 0.4, ease: "power2.inOut" });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [items, scaleOnHover, hoverScale, colorShiftOnHover]);

  // Distribute items into 3 columns by height for visual balance
  const columns = [0, 1, 2].map(() => [] as MasonryItem[]);
  const heights = [0, 0, 0];

  items.forEach((item) => {
    const col = heights.indexOf(Math.min(...heights));
    columns[col].push(item);
    heights[col] += item.height;
  });

  return (
    <div
      ref={containerRef}
      className="masonry-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.25rem",
        alignItems: "start",
      }}
    >
      {columns.map((col, colIdx) => (
        <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {col.map((item) => (
            <div
              key={item.id}
              className="masonry-card"
              style={{
                display: "block",
                borderRadius: "1rem",
                overflow: "hidden",
                position: "relative",
                willChange: "transform",
                opacity: 0, // start hidden, GSAP animates to 1
                height: `${item.height}px`,
                border: "1px solid rgba(239,68,68,0.18)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.55)",
                background: "#0a0a0f",
              }}
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.title ?? "Story"}
                className="masonry-img"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  transformOrigin: "center",
                  willChange: "transform",
                  filter: "grayscale(100%) contrast(1.05)",
                  transition: "filter 0.4s",
                }}
              />

              {/* Overlay with gradient + labels */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "1.1rem 1.2rem",
                  pointerEvents: "none",
                }}
              >
                {item.category && (
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "0.62rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(239,68,68,0.9)",
                      marginBottom: "0.35rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                )}
                {item.title && (
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontSize: "0.82rem",
                      color: "#f8fafc",
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </span>
                )}
              </div>

              {/* Red glow on hover via CSS */}
              <div
                className="masonry-hover-glow"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "1rem",
                  border: "1px solid rgba(239,68,68,0)",
                  transition: "border-color 0.35s, box-shadow 0.35s",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      ))}

      <style>{`
        .masonry-card:hover .masonry-hover-glow {
          border-color: rgba(239,68,68,0.45) !important;
          box-shadow: 0 0 28px rgba(239,68,68,0.22) !important;
        }
        .masonry-card:hover .masonry-img {
          filter: grayscale(40%) contrast(1.08) !important;
        }
        @media (max-width: 900px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .masonry-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
