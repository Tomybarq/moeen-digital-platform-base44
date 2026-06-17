/**
 * @file Mouse Glow Trail Configuration
 * @description Centralized constants for MouseGlowTrail —
 *   sizes, opacities, spring physics, and theme-aware colours.
 *   Edit here to tune the glow effect across the entire platform.
 */

/** Spring physics — tuned for 100–150ms visual delay behind cursor */
export const SPRING_CONFIG = {
  stiffness: 100,
  damping: 30,
  mass: 1,
};

/** Outer glow diameter (px) */
export const OUTER_SIZE = 200;
/** Inner glow diameter (px) */
export const INNER_SIZE = 80;

/** Dark-theme colour token */
export const GLOW_COLOR = "200, 151, 42"; // brand-gold RGB

/** Opacity per theme */
export const OPACITY = {
  dark: {
    outer: 0.12,
    inner: 0.25,
  },
  light: {
    outer: 0.08,
    inner: 0.16,
  },
};

/** Responsive scaling factors */
export const RESPONSIVE = {
  /** px breakpoint below which glow is fully disabled */
  mobileMax: 768,
  /** opacity multiplier for tablet (≥768px, <1024px) */
  tabletFactor: 0.8,
  /** px breakpoint for full desktop */
  desktopMin: 1024,
};