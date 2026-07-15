import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  ghost: "button button-ghost"
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonStyles[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button className={cn(buttonStyles[variant], className)} type={type} {...props} />;
}
