import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const viewport = { once: true, margin: "0px 0px -60px 0px" } as const;

type RevealProps = {
  children: ReactNode;
  className?: string | undefined;
  delay?: number;
};

/** Fade + 24px rise when entering the viewport (once). */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its <RevealItem> children by 0.06s. */
export function RevealGroup({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
