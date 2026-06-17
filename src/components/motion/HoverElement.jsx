import { useCallback } from "react";
import { useMotionContext } from "@/context/MotionContext";
import { useReducedMotion } from "framer-motion";

/**
 * Wraps any interactive element to trigger cursor visual state ("hover").
 * Just wrap: <HoverElement><Button>...</Button></HoverElement>
 */
export default function HoverElement({ children, className = "" }) {
  const { setCursorState, enabled } = useMotionContext();
  const prefersReduced = useReducedMotion();

  const onEnter = useCallback(() => {
    if (!prefersReduced && enabled) setCursorState("hover");
  }, [prefersReduced, enabled, setCursorState]);

  const onLeave = useCallback(() => {
    if (!prefersReduced && enabled) setCursorState("default");
  }, [prefersReduced, enabled, setCursorState]);

  if (prefersReduced || !enabled) return children;

  return (
    <span
      className={`contents ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}