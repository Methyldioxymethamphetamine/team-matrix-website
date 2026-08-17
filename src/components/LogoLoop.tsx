"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // pixels per second or relative speed duration
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number; // 0 pauses animation, or custom speed multiplier on hover
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
}

export default function LogoLoop({
  logos,
  speed = 100,
  direction = "left",
  logoHeight = 48,
  gap = 48,
  hoverSpeed,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = "#000000",
  ariaLabel = "Sponsors and partners",
  className = "",
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate items 4 times to guarantee smooth looping across wider screens
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  const isHorizontal = direction === "left" || direction === "right";

  // Calculate animation duration based on speed and items
  const duration = Math.max(10, (logos.length * 150) / speed);

  // Handle hover speed adjustments (e.g. pause if hoverSpeed === 0 or slow down)
  const isPaused = isHovered && hoverSpeed === 0;

  return (
    <div
      aria-label={ariaLabel}
      className={`relative w-full overflow-hidden select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: isHorizontal ? `${logoHeight + 32}px` : "100%",
      }}
    >
      {/* Edge Fade Overlay */}
      {fadeOut && (
        <>
          {isHorizontal ? (
            <>
              <div
                className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${fadeOutColor} 0%, transparent 100%)`,
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to left, ${fadeOutColor} 0%, transparent 100%)`,
                }}
              />
            </>
          ) : (
            <>
              <div
                className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${fadeOutColor} 0%, transparent 100%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${fadeOutColor} 0%, transparent 100%)`,
                }}
              />
            </>
          )}
        </>
      )}

      {/* Marquee Track Container */}
      <div
        className={`flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"} w-max h-full`}
        style={{
          gap: `${gap}px`,
          animation: `logo-loop-move-${direction} ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicatedLogos.map((item, idx) => {
          const content = (
            <div
              className={`flex items-center justify-center transition-transform duration-300 ${
                scaleOnHover ? "hover:scale-105" : ""
              }`}
            >
              {item.node ? (
                item.node
              ) : item.src ? (
                <div
                  className="relative flex items-center justify-center rounded-full bg-white shadow-[0_4px_25px_rgba(255,255,255,0.15)] border border-white/20 overflow-hidden transition-all duration-300 group flex-shrink-0"
                  style={{
                    height: `${logoHeight}px`,
                    width: `${logoHeight}px`,
                    padding: `${logoHeight * 0.16}px`,
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={item.src}
                      alt={item.alt || item.title || `Sponsor logo ${idx}`}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-white font-mono text-sm">{item.title}</span>
              )}
            </div>
          );

          if (item.href) {
            return (
              <a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title || item.alt}
                className="inline-flex items-center justify-center flex-shrink-0"
              >
                {content}
              </a>
            );
          }

          return (
            <div key={idx} className="inline-flex items-center justify-center flex-shrink-0">
              {content}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes logo-loop-move-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes logo-loop-move-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes logo-loop-move-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes logo-loop-move-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
