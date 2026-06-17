import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMouseGlowTrail } from "@/hooks/useMouseGlowTrail";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/components/ThemeProvider";
import {
  SPRING_CONFIG,
  OUTER_SIZE,
  INNER_SIZE,
  GLOW_COLOR,
  OPACITY,
  RESPONSIVE,
} from "@/lib/glowConfig";

/**
 * Full-viewport overlay that renders a mouse-trailing gold glow.
 *
 * - Native cursor stays visible (cursor:none is NOT used).
 * - Outer ring (200px) + inner ring (80px) with radial gradients.
 * - `mix-blend-mode: screen` for natural light blending.
 * - 100–150ms spring lag for organic trailing feel.
 * - Disabled when prefers-reduced-motion or mobile (<768px).
 * - Tablet (768–1024px) runs at 0.8× opacity.
 *
 * @component
 */
const MouseGlowTrail = memo(function MouseGlowTrail() {
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const { x, y } = useMouseGlowTrail();

  /** Screen-width responsive state */
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (prefersReduced) return;

    let raf;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setWidth(window.innerWidth);
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  /* ── Guard clauses ─────────────────────────────── */
  if (prefersReduced) return null; // accessibility
  if (width < RESPONSIVE.mobileMax) return null; // mobile disabled

  /* ── Theme & responsive opacity ─────────────────── */
  const isDark = theme === "dark";
  const opacitySet = isDark ? OPACITY.dark : OPACITY.light;

  const isTablet = width >= RESPONSIVE.mobileMax && width < RESPONSIVE.desktopMin;
  const layerFactor = isTablet ? RESPONSIVE.tabletFactor : 1;

  const outerAlpha = opacitySet.outer * layerFactor;
  const innerAlpha = opacitySet.inner * layerFactor;

  /* ── Build gradient strings ─────────────────────── */
  const outerGradient = `radial-gradient(circle at center, rgba(${GLOW_COLOR}, ${outerAlpha}) 0%, rgba(${GLOW_COLOR}, 0) 70%)`;
  const innerGradient = `radial-gradient(circle at center, rgba(${GLOW_COLOR}, ${innerAlpha}) 0%, rgba(${GLOW_COLOR}, 0) 65%)`;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ contain: "layout style paint", mixBlendMode: "screen" }}
      aria-hidden="true"
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full will-change-transform"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          background: outerGradient,
        }}
      />

      {/* Inner glow ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full will-change-transform"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: INNER_SIZE,
          height: INNER_SIZE,
          background: innerGradient,
        }}
      />
    </div>
  );
});

MouseGlowTrail.displayName = "MouseGlowTrail";
export default MouseGlowTrail;