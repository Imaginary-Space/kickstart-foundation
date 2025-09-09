import { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto relative">
      {/* Background orbs for glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="extra-orb-1" />
        <div className="extra-orb-2" />
      </div>
      {children}
    </div>
  );
}