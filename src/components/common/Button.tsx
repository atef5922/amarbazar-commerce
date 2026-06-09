import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "light";
  children: ReactNode;
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 px-5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        variant === "primary" && "bg-primary text-white hover:bg-accent hover:shadow-primary/20",
        variant === "secondary" && "bg-secondary text-white hover:bg-[#4d42a2]",
        variant === "ghost" && "bg-transparent text-ink hover:text-primary",
        variant === "light" && "bg-white text-secondary hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
