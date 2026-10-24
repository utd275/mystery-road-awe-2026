import type { ReactNode } from "react";

type BadgeVariant =
  | "reviewed"
  | "critical"
  | "flagged";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

export default function Badge({
  variant,
  children,
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}