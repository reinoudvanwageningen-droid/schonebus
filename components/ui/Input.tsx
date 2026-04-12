import type { InputHTMLAttributes } from "react";

export const fieldClassName =
  "w-full rounded-[14px] border border-line bg-paper px-4 text-base text-ink outline-none transition-colors duration-200 placeholder:text-mist/70 focus:border-electric";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  prefix?: string;
}

export function Input({
  label,
  error,
  id,
  prefix,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <span
        className={[
          "flex h-12 items-center rounded-[14px] border border-line bg-paper transition-colors duration-200 focus-within:border-electric",
          error ? "border-red-400" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {prefix ? (
          <span className="pl-4 pr-2 text-base font-medium text-mist">{prefix}</span>
        ) : null}
        <input
          id={id}
          className={[
            "h-full w-full rounded-[14px] bg-transparent px-4 text-base text-ink outline-none placeholder:text-mist/70",
            prefix ? "pl-0" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      </span>
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
