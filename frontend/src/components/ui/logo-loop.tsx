"use client";

import { cn } from "@/lib/utils";
import "./logo-loop.css";

interface LogoLoopProps {
  items: React.ReactNode[];
  /** Seconds for a full loop (lower = faster) */
  duration?: number;
  direction?: "left" | "right";
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  className?: string;
}

export function LogoLoop({
  items,
  duration = 30,
  direction = "left",
  gap = 56,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = "#ffffff",
  className,
}: LogoLoopProps) {
  return (
    <div
      className={cn("relative overflow-hidden w-full", className)}
      style={
        {
          "--logo-gap": `${gap}px`,
          "--logo-duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      {/* Fade edges */}
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${fadeOutColor} 20%, transparent)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${fadeOutColor} 20%, transparent)` }}
          />
        </>
      )}

      {/* Marquee viewport */}
      <div
        className={cn(
          "logo-loop-track",
          direction === "right" && "logo-loop-track--reverse",
          pauseOnHover && "logo-loop-track--hoverable"
        )}
      >
        {/* Two identical sets for seamless wrap */}
        {[0, 1].map((set) => (
          <div
            key={set}
            className="logo-loop-set"
            aria-hidden={set === 1}
          >
            {items.map((item, i) => (
              <div key={i} className="logo-loop-item">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
