"use client";

import React, { useEffect, useRef, useState } from "react";

export interface FuzzyTextProps {
  children: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  baseIntensity?: number;
  hoverIntensity?: number;
  enableHover?: boolean;
  className?: string;
}

export default function FuzzyText({
  children,
  fontSize = 180,
  fontWeight = "900",
  fontFamily = "'Black Ops One', system-ui, sans-serif",
  color = "#EF4444",
  baseIntensity = 0.2,
  hoverIntensity = 0.5,
  enableHover = true,
  className = "",
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let numericFontSize = 180;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else if (typeof fontSize === "string") {
        const parsed = parseInt(fontSize);
        if (!isNaN(parsed) && parsed > 20) {
          numericFontSize = parsed;
        } else if (typeof window !== "undefined") {
          numericFontSize = Math.min(220, Math.max(90, Math.floor(window.innerWidth * 0.12)));
        }
      }

      const cleanFontFamily = fontFamily.replace(/var\([^)]+\),?\s*/g, "");
      const text = String(children);
      ctx.font = `${fontWeight} ${numericFontSize}px ${cleanFontFamily}`;
      const metrics = ctx.measureText(text);
      const textWidth = Math.ceil(metrics.width);
      const fontHeight = Math.ceil(
        (metrics.actualBoundingBoxAscent || numericFontSize * 0.8) + (metrics.actualBoundingBoxDescent || numericFontSize * 0.2)
      );

      const padding = 40;
      const width = textWidth + padding * 2;
      const height = fontHeight + padding * 2;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const offscreen = document.createElement("canvas");
      offscreen.width = width * dpr;
      offscreen.height = height * dpr;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        offCtx.scale(dpr, dpr);
        offCtx.font = `${fontWeight} ${numericFontSize}px ${cleanFontFamily}`;
        offCtx.fillStyle = color;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillText(text, width / 2, height / 2);

        const currentIntensity = isHovered && enableHover ? hoverIntensity : baseIntensity;
        const maxOffset = Math.max(1, currentIntensity * 28);

        const sliceHeight = 3;
        const totalSlices = Math.ceil(height / sliceHeight);

        for (let i = 0; i < totalSlices; i++) {
          const sy = i * sliceHeight;
          const randomOffset = (Math.random() - 0.5) * 2 * maxOffset;
          const alpha = 1.0 - Math.random() * currentIntensity * 0.4;

          ctx.globalAlpha = Math.max(0.3, alpha);
          ctx.drawImage(
            offscreen,
            0,
            sy * dpr,
            width * dpr,
            sliceHeight * dpr,
            randomOffset,
            sy,
            width,
            sliceHeight
          );
        }

        if (currentIntensity > 0) {
          ctx.globalAlpha = currentIntensity * 0.5;
          ctx.filter = `blur(${currentIntensity * 8}px)`;
          ctx.drawImage(offscreen, 0, 0, width, height);
          ctx.filter = "none";
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [children, fontSize, fontWeight, fontFamily, color, baseIntensity, hoverIntensity, enableHover, isHovered]);

  return (
    <div
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
