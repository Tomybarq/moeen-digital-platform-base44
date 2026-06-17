import { createContext, useContext, useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "framer-motion";

const MotionContext = createContext(null);

export function MotionProvider({ children }) {
  const prefersReduced = useReducedMotion();
  const mouseRef = useRef({ x: -100, y: -100 });
  const cursorStateRef = useRef("default"); // default | hover | magnetic
  const rafRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // Detect touch-capable device — only enable cursor on non-touch
  useEffect(() => {
    if (prefersReduced) {
      setEnabled(false);
      return;
    }
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isEnabled = !hasTouch;
    setEnabled(isEnabled);

    // Toggle class on <html> for CSS cursor:none rule
    if (isEnabled) {
      document.documentElement.classList.add("motion-enabled");
    }
    return () => {
      document.documentElement.classList.remove("motion-enabled");
    };
  }, [prefersReduced]);

  // Track mouse via rAF — stored in ref to avoid re-renders
  const onMouseMove = useCallback((e) => {
    // Batch pending rAF to avoid queue stacking
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, onMouseMove]);

  const setCursorState = useCallback((state) => {
    cursorStateRef.current = state;
  }, []);

  return (
    <MotionContext.Provider value={{ mouseRef, cursorStateRef, setCursorState, enabled }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionContext() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotionContext must be used within MotionProvider");
  return ctx;
}