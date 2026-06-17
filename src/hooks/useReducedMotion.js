import { useReducedMotion as framerUseReducedMotion } from "framer-motion";

/**
 * Thin accessibility wrapper over Framer Motion's reduced-motion hook.
 * Returns `true` when the user has requested reduced motion via OS settings.
 *
 * @returns {boolean}  `true` → disable animations entirely
 */
export function useReducedMotion() {
  return framerUseReducedMotion();
}

export default useReducedMotion;