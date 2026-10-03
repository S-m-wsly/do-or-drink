import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,box-shadow,border-color] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-fg shadow-[0_0_0_1px_rgb(255_255_255/0.06)] hover:bg-primary-hover",
        outline:
          "bg-transparent text-fg shadow-[0_0_0_1px_var(--color-border-strong)] hover:bg-elevated",
        drink:
          "bg-elevated text-fg shadow-[0_0_0_1px_var(--color-primary)] hover:bg-surface",
        ghost: "bg-transparent text-muted hover:text-fg hover:bg-elevated",
      },
      size: {
        default: "h-12 rounded-md px-5 text-base",
        lg: "h-14 rounded-lg px-6 text-lg",
        xl: "h-16 w-full rounded-xl px-6 text-xl font-semibold tracking-tight",
        icon: "size-11 rounded-md",
        sm: "h-10 rounded-sm px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
