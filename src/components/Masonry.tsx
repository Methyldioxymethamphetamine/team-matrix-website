"use client";

import { useEffect, useRef, useLayoutEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

export interface MasonryItem {
  id: string;
  img: string;
  url: string;
  /** width / height of the source image — drives the card's natural size */
  aspectRatio: number;
  title?: string;
  category?: string;
  /** Story copy shown in the expanded view — left blank until written */
  story?: string;
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

// Reference column width used only to weigh column-balancing — the actual
// rendered width is whatever CSS gives each column; only the relative
// magnitude between items matters here.
const REF_COLUMN_WIDTH = 340;

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
}: MasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [selected, setSelected] = useState<MasonryItem | null>(null);

  const closeLightbox = useCallback(() => setSelected(null), []);

  // Lock page scroll + allow Escape to close while the lightbox is open
  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, closeLightbox]);

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

  // Distribute items into 3 columns, balancing by each image's own
  // (width-normalized) rendered height so columns stay roughly even
  // regardless of each photo's aspect ratio.
  const columns = [0, 1, 2].map(() => [] as MasonryItem[]);
  const heights = [0, 0, 0];

  items.forEach((item) => {
    const col = heights.indexOf(Math.min(...heights));
    columns[col].push(item);
    heights[col] += REF_COLUMN_WIDTH / (item.aspectRatio || 1);
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
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="masonry-card"
              aria-label="Expand photo"
              style={{
                display: "block",
                width: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
                position: "relative",
                willChange: "transform",
                opacity: 0, // start hidden, GSAP animates to 1
                border: "1px solid rgba(239,68,68,0.18)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.55)",
                background: "#0a0a0f",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {/* Image — sized purely by its own natural aspect ratio, so
                  the full photo always shows with no cropping or bars */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.title ?? "Story"}
                className="masonry-img"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: item.aspectRatio || undefined,
                  display: "block",
                  transformOrigin: "center",
                  willChange: "transform",
                  filter: "grayscale(100%) contrast(1.05)",
                  transition: "filter 0.4s",
                }}
              />

              {/* Expand hint — fades in on hover */}
              <div className="masonry-expand-hint" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "9999px",
                    background: "rgba(10,10,16,0.65)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </span>
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
            </button>
          ))}
        </div>
      ))}

      {/* Lightbox — expanded photo + story. Portaled to <body> so it always
          renders above the page (escapes the z-10 stacking context <main>
          creates, which would otherwise trap it below the z-40 NavBar). */}
      {selected && typeof document !== "undefined" && createPortal(
        <div
          className="masonry-lightbox"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5vh 5vw",
            background: "rgba(4,4,7,0.88)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="masonry-lightbox-content"
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: "1.25rem",
              maxWidth: "min(94vw, 1100px)",
              maxHeight: "90vh",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.img}
              alt={selected.title ?? "Story"}
              style={{
                display: "block",
                width: "auto",
                height: "auto",
                maxWidth: "min(65vw, 700px)",
                maxHeight: "80vh",
                borderRadius: "1rem",
                border: "1px solid rgba(239,68,68,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                flex: "0 1 auto",
              }}
            />

            <div
              className="masonry-lightbox-story"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flex: "0 0 300px",
                borderRadius: "1rem",
                padding: "1.5rem",
                background: "rgba(13,13,20,0.75)",
                border: "1px solid rgba(255,255,255,0.08)",
                overflowY: "auto",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: selected.story ? "#e2e8f0" : "rgba(226,232,240,0.4)",
                  fontStyle: selected.story ? "normal" : "italic",
                }}
              >
                {selected.story || "Story coming soon."}
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .masonry-card:hover .masonry-hover-glow {
          border-color: rgba(239,68,68,0.45) !important;
          box-shadow: 0 0 28px rgba(239,68,68,0.22) !important;
        }
        .masonry-card:hover .masonry-img {
          filter: grayscale(40%) contrast(1.08) !important;
        }
        .masonry-expand-hint {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .masonry-card:hover .masonry-expand-hint {
          opacity: 1;
        }
        .masonry-lightbox-content {
          flex-direction: row;
        }
        @media (max-width: 760px) {
          .masonry-lightbox-content {
            flex-direction: column;
            max-width: min(92vw, 560px) !important;
          }
          .masonry-lightbox-content img {
            max-width: 100% !important;
            max-height: 55vh !important;
          }
          .masonry-lightbox-story {
            flex: 0 0 auto !important;
            max-height: 30vh;
          }
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
