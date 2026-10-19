import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "xp"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

// --ledge — цвет «подложки» под кнопкой.
const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white [--ledge:var(--primary-shade)]",
  secondary:
    "bg-surface text-primary border-2 border-border [--ledge:var(--surface-shade)]",
  success: "bg-success text-white [--ledge:var(--success-shade)]",
  danger: "bg-error text-white [--ledge:var(--error-shade)]",
  xp: "bg-xp text-ink [--ledge:var(--xp-shade)]",
  ghost: "bg-transparent text-ink-muted shadow-none! hover:bg-primary-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-base",
  lg: "h-14 w-full px-6 text-lg",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-2xl font-extrabold uppercase tracking-wide",
    "shadow-[0_4px_0_var(--ledge)] transition-[transform,box-shadow,filter] duration-100",
    "hover:brightness-105 active:translate-y-1 active:shadow-none",
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:pointer-events-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-ink disabled:[--ledge:var(--surface-shade)]",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest} />
  );
}
