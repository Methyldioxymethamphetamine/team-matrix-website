"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

export interface StrandsProps {
  colors?: string[];
  count?: number;
  speed?: number;
  amplitude?: number;
  waviness?: number;
  thickness?: number;
  glow?: number;
  taper?: number;
  spread?: number;
  intensity?: number;
  saturation?: number;
  opacity?: number;
  scale?: number;
  glass?: boolean;
  refraction?: number;
  dispersion?: number;
  glassSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColors[5];
  uniform int uColorCount;
  uniform float uCount;
  uniform float uSpeed;
  uniform float uAmplitude;
  uniform float uWaviness;
  uniform float uThickness;
  uniform float uGlow;
  uniform float uTaper;
  uniform float uSpread;
  uniform float uIntensity;
  uniform float uSaturation;
  uniform float uOpacity;
  uniform float uScale;

  varying vec2 vUv;

  vec3 adjustSaturation(vec3 color, float value) {
    const vec3 luminanceWeight = vec3(0.2126, 0.7152, 0.0722);
    float luminance = dot(color, luminanceWeight);
    return mix(vec3(luminance), color, value);
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    st *= uScale;

    vec3 finalColor = vec3(0.0);
    float totalAlpha = 0.0;
    float t = uTime * uSpeed * 0.8;

    for (int i = 0; i < 8; i++) {
      if (float(i) >= uCount) break;

      float fi = float(i);
      float offset = (fi - (uCount - 1.0) * 0.5) * uSpread * 0.35;

      float wave1 = sin(st.x * uWaviness * 2.5 + t + fi * 1.5) * uAmplitude * 0.25;
      float wave2 = cos(st.x * uWaviness * 1.8 - t * 0.7 + fi * 2.1) * uAmplitude * 0.15;
      float strandY = offset + wave1 + wave2;

      float edgeTaper = 1.0 - pow(clamp(abs(st.x) / (0.6 * uScale), 0.0, 1.0), uTaper);
      
      float dist = abs(st.y - strandY);
      float coreWidth = uThickness * 0.015 * edgeTaper;
      float glowRadius = uGlow * 0.035;

      float lineIntensity = smoothstep(coreWidth + glowRadius, 0.0, dist) * uIntensity;
      lineIntensity += pow(clamp(coreWidth / (dist + 0.0005), 0.0, 1.0), 1.6) * uIntensity;
      lineIntensity *= edgeTaper;

      vec3 strandColor = vec3(1.0);
      if (uColorCount > 0) {
        int colIdx = i - (i / uColorCount) * uColorCount;
        if (colIdx == 0) strandColor = uColors[0];
        else if (colIdx == 1) strandColor = uColors[1];
        else if (colIdx == 2) strandColor = uColors[2];
        else if (colIdx == 3) strandColor = uColors[3];
        else strandColor = uColors[4];
      }

      finalColor += strandColor * lineIntensity;
      totalAlpha += lineIntensity;
    }

    finalColor = adjustSaturation(finalColor, uSaturation);
    float alpha = clamp(totalAlpha * uOpacity, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function Strands({
  colors = ["#F97316", "#7C3AED", "#06B6D4"],
  count = 3,
  speed = 0.5,
  amplitude = 1,
  waviness = 1,
  thickness = 0.7,
  glow = 2.6,
  taper = 3,
  spread = 1,
  intensity = 0.6,
  saturation = 1.5,
  opacity = 1,
  scale = 1.5,
  className = "",
  style = {},
}: StrandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);

    // Convert hex colors to OGL vec3 RGB colors
    const colorVecs = colors.slice(0, 5).map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });
    // Pad to 5 colors
    while (colorVecs.length < 5) {
      colorVecs.push([1, 1, 1]);
    }

    const flatColors = colorVecs.flat();

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uColors: { value: flatColors },
        uColorCount: { value: colors.length },
        uCount: { value: count },
        uSpeed: { value: speed },
        uAmplitude: { value: amplitude },
        uWaviness: { value: waviness },
        uThickness: { value: thickness },
        uGlow: { value: glow },
        uTaper: { value: taper },
        uSpread: { value: spread },
        uIntensity: { value: intensity },
        uSaturation: { value: saturation },
        uOpacity: { value: opacity },
        uScale: { value: scale },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    }
    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;
    function update(t: number) {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (gl.canvas && gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
    };
  }, [
    colors,
    count,
    speed,
    amplitude,
    waviness,
    thickness,
    glow,
    taper,
    spread,
    intensity,
    saturation,
    opacity,
    scale,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={style}
    />
  );
}
