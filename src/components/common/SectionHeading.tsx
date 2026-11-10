import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
  as = "h2",
  action,
}: SectionHeadingProps) {
  const H = as;
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-12",
        align === "center"
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-3", dark ? "text-sky-300" : "text-[#1a6fc7]")}>{eyebrow}</p>
        )}
        <H
          className={cn(
            "text-3xl font-extrabold leading-tight sm:text-4xl",
            dark ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </H>
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              dark ? "text-white/80" : "text-slate-muted",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
