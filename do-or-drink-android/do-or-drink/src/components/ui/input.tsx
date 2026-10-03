import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md bg-elevated px-4 text-base text-fg placeholder:text-subtle shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)]",
        className,
      )}
      {...props}
    />
  );
}
