import { useId } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type AirBandsProps = {
  variant?: "light" | "dark";
  animated?: boolean;
  className?: string;
  /** Number of bands drawn (3 or 4). */
  bands?: 3 | 4;
};

const PATHS = [
  "M-40 150 C 180 60, 380 60, 600 130 S 1020 210, 1240 110",
  "M-40 190 C 200 100, 400 110, 610 170 S 1030 250, 1240 150",
  "M-40 230 C 220 145, 420 160, 620 210 S 1040 290, 1240 190",
  "M-40 270 C 240 190, 440 210, 630 250 S 1050 330, 1240 230",
];

/**
 * Signature motif: curved parallel air-flow bands (blue → sky gradient).
 * Purely decorative — always aria-hidden.
 */
export function AirBands({
  variant = "light",
  animated = false,
  className,
  bands = 4,
}: AirBandsProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduce = useReducedMotion();
  const animate = animated && !reduce;
  const isDark = variant === "dark";

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 360"
      preserveAspectRatio="none"
      className={cn("pointer-events-none select-none", className)}
    >
      <defs>
        <linearGradient id={`ab-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop
            offset="0%"
            stopColor={isDark ? "#1E7FE0" : "#0D3B8E"}
            stopOpacity={isDark ? 0.15 : 0.08}
          />
          <stop offset="45%" stopColor="#1E7FE0" stopOpacity={isDark ? 0.75 : 0.45} />
          <stop offset="100%" stopColor="#7FD3F7" stopOpacity={isDark ? 0.9 : 0.6} />
        </linearGradient>
      </defs>
      <g className={animate ? "air-drift" : undefined}>
        {PATHS.slice(0, bands).map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={`url(#ab-${id})`}
            strokeWidth={i === 0 ? 10 : 7 - i}
            strokeLinecap="round"
            opacity={1 - i * 0.16}
          />
        ))}
        {animate &&
          PATHS.slice(0, 2).map((d, i) => (
            <path
              key={`dash-${d}`}
              d={d}
              fill="none"
              stroke="#7FD3F7"
              strokeOpacity={isDark ? 0.7 : 0.5}
              strokeWidth={2}
              strokeLinecap="round"
              className="air-dash"
              style={{ animationDelay: `${i * -3}s` }}
            />
          ))}
      </g>
    </svg>
  );
}
