import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMotionContext } from "@/context/MotionContext";

/** Smooth trailing custom cursor — spring physics: damping 20, stiffness 150 */
export default function CustomCursor() {
  const { mouseRef, cursorStateRef, enabled } = useMotionContext();

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const cursorStateMV = useMotionValue("default"); // motion value for visual state

  // rAF loop — pull mouse position AND cursor state from refs
  useEffect(() => {
    if (!enabled) return;
    let raf;
    const tick = () => {
      const { x, y } = mouseRef.current;
      rawX.set(x);
      rawY.set(y);
      cursorStateMV.set(cursorStateRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, mouseRef, cursorStateRef, rawX, rawY, cursorStateMV]);

  // Spring physics for silky trailing
  const springX = useSpring(rawX, { damping: 20, stiffness: 150, mass: 0.5 });
  const springY = useSpring(rawY, { damping: 20, stiffness: 150, mass: 0.5 });

  // Derive visual properties from cursor state WITHOUT re-renders
  const isActive = useTransform(cursorStateMV, (s) => s === "hover" || s === "magnetic");
  const isMagnetic = useTransform(cursorStateMV, (s) => s === "magnetic");

  const outerScale = useTransform(isActive, (active) => (active ? 1.8 : 1));
  const innerScale = useTransform(isMagnetic, (mag) => (mag ? 0.6 : 1));

  const borderColor = useTransform(isActive, (active) =>
    active ? "#c8972a" : "hsl(var(--foreground) / 0.3)"
  );
  const bgColor = useTransform(isActive, (active) =>
    active ? "transparent" : "hsl(var(--foreground) / 0.08)"
  );
  const glow = useTransform(isActive, (active) =>
    active
      ? "0 0 14px 2px rgba(200, 151, 42, 0.35), 0 0 28px 4px rgba(200, 151, 42, 0.12)"
      : "none"
  );
  const dotColor = useTransform(isActive, (active) =>
    active ? "#c8972a" : "hsl(var(--primary))"
  );

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 32,
          height: 32,
          scale: outerScale,
          border: "1.5px solid",
          borderColor,
          background: bgColor,
          boxShadow: glow,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          scale: innerScale,
          background: dotColor,
        }}
      />
    </>
  );
}