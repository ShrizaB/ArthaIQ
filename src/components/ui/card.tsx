import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "default" | "sm" | "none";
}

export function Card({ children, className, padding = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-1 border border-rule rounded-2xl",
        padding === "default" && "p-6",
        padding === "sm" && "p-4",
        padding === "none" && "",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("aq-label mb-3.5", className)}>{children}</div>
  );
}

export function CardLabelRow({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-3.5", className)}>
      <div className="aq-label">{children}</div>
      {right}
    </div>
  );
}
