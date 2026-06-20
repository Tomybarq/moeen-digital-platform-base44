import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PullToRefresh({ onRefresh, children, className }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);
  const THRESHOLD = 70;

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY > 2) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) { setPullDistance(0); return; }
    setPullDistance(Math.min(dy * 0.5, THRESHOLD + 30));
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(50);
      try { await onRefresh(); } catch {}
      setRefreshing(false);
    }
    startY.current = null;
    setPullDistance(0);
  }, [pullDistance, refreshing, onRefresh]);

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        initial={false}
        animate={{ height: pullDistance > 0 ? pullDistance : 0, opacity: pullDistance > 0 ? 1 : 0 }}
        className="flex items-center justify-center overflow-hidden"
      >
        <div className={cn(
          "w-8 h-8 rounded-full border-2 border-primary/30",
          refreshing ? "border-t-primary animate-spin" : "border-t-primary"
        )}
          style={!refreshing && pullDistance > 0 ? { transform: `rotate(${pullDistance * 3}deg)` } : undefined}
        />
      </motion.div>
      {children}
    </div>
  );
}