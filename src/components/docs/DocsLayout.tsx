import { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {children}
    </div>
  );
}