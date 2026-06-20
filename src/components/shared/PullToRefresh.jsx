import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PullToRefresh({ onRefresh, children, className }) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);
  const THRESHOLD = 70;

  const handleTouchStart = useCallback((e) => {
    if (containerRef.current?.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
    setPulling(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) { setPullDistance(0); return; }
    setPullDistance(Math.min(dy * 0.5, THRESHOLD + 20));
  }, [pulling]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(50);
      if (onRefresh) await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    setPulling(false);
  }, [pullDistance, onRefresh]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="overflow-auto"
      >
        {pulling && pullDistance > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: pullDistance }}
            className="flex items-center justify-center overflow-hidden"
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary",
              refreshing ? "animate-spin" : ""
            )} />
          </motion.div>
        )}
        {children}
      </div>
    </div>
  );
}