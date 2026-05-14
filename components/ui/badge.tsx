import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "cyan" | "magenta" | "violet" | "slate" | "green";
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  const tones = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    magenta: "border-pink-300/30 bg-pink-300/10 text-pink-100",
    violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
    green: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    slate: "border-white/10 bg-white/5 text-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
