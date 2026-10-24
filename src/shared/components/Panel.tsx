import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  children: ReactNode;
}

export default function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>

      {children}
    </section>
  );
}