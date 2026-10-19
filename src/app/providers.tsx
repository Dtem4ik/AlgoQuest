"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ThemeController } from "@/components/theme/ThemeController";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeController />
      {children}
    </MotionConfig>
  );
}
