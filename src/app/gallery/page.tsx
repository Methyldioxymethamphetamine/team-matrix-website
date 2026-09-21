"use client";

import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DotField from "@/components/DotField";
import Masonry from "@/components/Masonry";
import type { WorkItem } from "@/data/works";

const CARD_GRADIENT =
  "linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(10,10,15,0.96) 100%)";

// A work item enriched with its real image aspect ratio, measured client-side
type GalleryItem = WorkItem & { aspectRatio: number };

// Loads an image just far enough to read its natural size, without
// blocking on a full decode/paint. Resolves null if the file is broken.
function measureAspectRatio(src: string): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null);
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function GalleryPage() {
  const [worksItems, setWorksItems] = useState<GalleryItem[]>([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/works")
      .then((r) => r.json())
      .then(async (data: WorkItem[]) => {
        const enriched = await Promise.all(
          data.map(async (item) => {
            const aspectRatio = await measureAspectRatio(item.img);
            return aspectRatio ? { ...item, aspectRatio } : null;
          })
        );
        if (!cancelled) {
          setWorksItems(enriched.filter((i): i is GalleryItem => i !== null));
        }
      })
      .catch(() => {
        if (!cancelled) setWorksItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setWorksLoading(false);
        // brief delay so the page paints before the reveal animation
        requestAnimationFrame(() => setTimeout(() => setVisible(true), 80));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  void CARD_GRADIENT; // keep import live for future use

  return (
    <div className="relative min-h-screen w-full bg-black text-white select-none">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <DotField
          dotRadius={1.6} dotSpacing={16} bulgeStrength={70}
          sparkle={true} waveAmplitude={0}
          gradientFrom="rgba(239, 68, 68, 0.25)" gradientTo="rgba(185, 28, 28, 0.10)"
        />
      </div>

      <NavBar />

      <main className="relative z-10 pt-28 pb-24 px-6 sm:px-8 max-w-[1400px] mx-auto">
        {/* Section header */}
        <div
          className="mb-14 flex flex-col gap-3 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="inline-block w-10 h-[2px] rounded-full"
              style={{ background: "#ef4444" }}
            />
            <span className="font-mono text-[0.55rem] tracking-[0.1em] sm:text-[0.7rem] sm:tracking-[0.28em] uppercase font-semibold text-red-400/85 whitespace-nowrap">
              TEAM MATRIX / STORIES
            </span>
          </div>

          <h1
            className="leading-[1.05] tracking-[-0.02em] text-slate-50"
            style={{
              fontFamily: "var(--font-black-ops), 'Black Ops One', system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
              fontWeight: 400,
            }}
          >
            Our Stories
          </h1>

          <p className="font-sans text-[0.95rem] leading-relaxed text-slate-100/50 max-w-[42ch]">
            Moments from the field, the lab, and the podium — captured across every competition and milestone.
          </p>
        </div>

        {/* Grid */}
        {worksLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[380, 280, 460, 320, 410, 260].map((h, i) => (
              <div
                key={i}
                className="rounded-2xl border border-red-500/10"
                style={{
                  height: `${h}px`,
                  background: "rgba(255,255,255,0.04)",
                  animation: `pulse 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.7}}`}</style>
          </div>
        ) : worksItems.length === 0 ? (
          <div className="text-center py-16 font-mono text-[0.8rem] tracking-[0.15em] text-slate-100/25">
            DROP .JPG / .PNG FILES INTO /public/stories/ TO POPULATE THIS GALLERY
          </div>
        ) : (
          <Masonry
            items={worksItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.97}
            blurToFocus={true}
            colorShiftOnHover={false}
            visible={visible}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
