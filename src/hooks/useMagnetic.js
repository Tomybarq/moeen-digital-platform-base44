import { useRef, useCallback, useEffect } from "react";
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useMotionContext } from "@/context/MotionContext";

/**
 * Magnetic attraction hook for interactive elements (buttons, cards, icons).
 *
 * Usage:
 *   const ref = useRef(null);
 *   const { x, y, onMouseEnter, onMouseLeave } = useMagnetic(ref, { strength: 0.3, radius: 150 });
 *   <motion.button ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
 *     style={{ x, y }}>Click</motion.button>
 *
 * @param {React.RefObject} elementRef  — ref attached to the target DOM element
 * @param {Object}         options
 * @param {number}         options.strength  — pull intensity (0–1), default 0.25
 * @param {number}         options.radius    — attraction radius in px, default 120
 */
export function useMagnetic(elementRef, { strength = 0.25, radius = 120 } = {}) {
  const prefersReduced = useReducedMotion();
  const { mouseRef, setCursorState, enabled } = useMotionContext();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, { damping: 15, stiffness: 150, mass: 0.3 });
  const springY = useSpring(my, { damping: 15, stiffness: 150, mass: 0.3 });

  const trackingRef = useRef(false);

  // rAF-based tracking — reads mouseRef.current directly
  const tick = useCallback(() => {
    if (!trackingRef.current || !enabled) return;
    const el = elementRef.current;
    if (!el) return;

    const { x: mouseX, y: mouseY } = mouseRef.current;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = mouseX - centerX;
    const distY = mouseY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < radius) {
      const pull = Math.min((1 - dist / radius) * strength * (radius * 0.2), radius * 0.2);
      mx.set((distX / dist) * pull);
      my.set((distY / dist) * pull);
    } else {
      mx.set(0);
      my.set(0);
    }

    requestAnimationFrame(tick);
  }, [elementRef, mouseRef, enabled, radius, strength, mx, my]);

  const onMouseEnter = useCallback(() => {
    if (prefersReduced || !enabled) return;
    setCursorState("magnetic");
    trackingRef.current = true;
    requestAnimationFrame(tick);
  }, [prefersReduced, enabled, setCursorState, tick]);

  const onMouseLeave = useCallback(() => {
    if (prefersReduced || !enabled) return;
    setCursorState("default");
    trackingRef.current = false;
    mx.set(0);
    my.set(0);
  }, [prefersReduced, enabled, setCursorState, mx, my]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      trackingRef.current = false;
    };
  }, []);

  // If motion disabled — return identity transform
  if (prefersReduced || !enabled) {
    return { x: 0, y: 0, onMouseEnter: undefined, onMouseLeave: undefined };
  }

  return { x: springX, y: springY, onMouseEnter, onMouseLeave };
}