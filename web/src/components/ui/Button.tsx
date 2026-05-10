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

  const markup = (
    <>
      <style>{`
        .vm-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 17px;
          border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
          cursor: pointer; text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
          position: relative; overflow: hidden;
          white-space: nowrap;
        }

        /* Shine overlay */
        .vm-btn--primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%);
          pointer-events: none;
        }

        /* Primary — gradient fill */
        .vm-btn--primary {
          background: linear-gradient(135deg, #6c5ce7 0%, #8b7cf6 100%);
          color: #fff;
          box-shadow: 0 0 0 1px rgba(108,92,231,0.5), 0 3px 14px rgba(108,92,231,0.4);
        }
        .vm-btn--primary:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 0 0 1px rgba(108,92,231,0.6), 0 6px 22px rgba(108,92,231,0.52);
        }
        .vm-btn--primary:active { transform: translateY(0); }

        /* Ghost — muted outline (used on active/current-page state) */
        .vm-btn--ghost {
          background: rgba(108,92,231,0.14);
          color: #a89cef;
          box-shadow: 0 0 0 0.5px rgba(108,92,231,0.4);
        }
        .vm-btn--ghost:hover {
          box-shadow: 0 0 0 0.5px rgba(108,92,231,0.6);
        }
      `}</style>
      {children}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a href={href} {...shared} {...anchorRest}>
        {markup}
      </a>
    );
  }

  return (
    <button {...shared} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {markup}
    </button>
  );
}