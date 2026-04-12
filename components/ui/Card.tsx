import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-card border border-line bg-white shadow-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
