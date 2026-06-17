import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { SPRING_CONFIG } from "@/lib/glowConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Tracks raw mouse coordinates via `requestAnimationFrame` and applies
 * spring physics so the glow trails ~100–150ms behind the cursor.
 *
 * @returns {{ x: MotionValue<number>, y: MotionValue<number> }}
 *   Spring-smoothed position values ready for `motion.div` style binding.
 */
export function useMouseGlowTrail() {
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);

  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (prefersReduced) return;

    /**
     * Update raw motion values on every mousemove.
     * Framer Motion's `useSpring` internally animates via requestAnimationFrame,
     * so no manual rAF loop is needed — the spring runs continuously even
     * when the mouse is stationary, providing the desired trailing delay.
     */
    const handleMouseMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReduced, rawX, rawY]);

  return { x: springX, y: springY };
}