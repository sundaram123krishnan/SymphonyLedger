import { ReactNode } from "react";

export function TypographyH2({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={`scroll-m-20 border-b text-black dark:text-white pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
      {children}
    </h2>
  );
}
