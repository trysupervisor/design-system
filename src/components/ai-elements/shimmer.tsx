// Modified for Supervisor compatibility. License: Apache 2.0.
"use client";

import { cn } from "cn";
import { useAnimate } from "motion/react";
import type { CSSProperties, ElementType } from "react";
import { memo, useEffect, useMemo } from "react";

export interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const animation = animate(scope.current, { backgroundPosition: ["100% center", "0% center"] }, {
      duration,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    });
    return () => animation.stop();
  }, [animate, duration, scope, Component]);

  const dynamicSpread = useMemo(
    () => (children?.length ?? 0) * spread,
    [children, spread]
  );

  return (
    <Component
      ref={scope}
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-background),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className
      )}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundPosition: "100% center",
          backgroundImage:
            "var(--bg), linear-gradient(var(--color-muted-foreground), var(--color-muted-foreground))",
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
};

export const Shimmer = memo(ShimmerComponent);
