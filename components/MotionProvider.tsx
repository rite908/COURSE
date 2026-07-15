"use client";

import { MotionConfig } from "framer-motion";

/**
 * Wraps the app with Framer Motion's built-in reduced-motion support.
 * `reducedMotion="user"` automatically disables transform/opacity-driving
 * animations for users who have "prefers-reduced-motion: reduce" set at
 * the OS level, without us needing to branch every animation manually.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
