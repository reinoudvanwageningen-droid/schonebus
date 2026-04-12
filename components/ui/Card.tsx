import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-card border border-line bg-paper shadow-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
