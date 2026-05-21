"use client";

import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  /** "primary" = purple gradient (default), "ghost" = muted outline (active-page state) */
  variant?: "primary" | "ghost";
  className?: string;
};

// Overloaded so it can render as <a> or <button> depending on whether `href` is passed
type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export default function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const shared = {
    className: `vm-btn vm-btn--${variant}${className ? ` ${className}` : ""}`,
  };

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a href={href} {...shared} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button {...shared} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}