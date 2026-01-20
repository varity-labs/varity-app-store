"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "outline" | "gradient";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        // Variant styles matching marketing website
        variant === "default" && "border-transparent bg-brand-500/10 text-brand-400 hover:bg-brand-500/20",
        variant === "secondary" && "border-transparent bg-background-tertiary text-foreground-secondary hover:bg-background-quaternary",
        variant === "success" && "border-transparent bg-success/10 text-success hover:bg-success/20",
        variant === "warning" && "border-transparent bg-warning/10 text-warning hover:bg-warning/20",
        variant === "outline" && "border-border text-foreground-secondary",
        variant === "gradient" && "border-transparent bg-gradient-to-r from-brand-500/10 to-electric-400/10 text-brand-400",
        className
      )}
    >
      {children}
    </span>
  );
}
