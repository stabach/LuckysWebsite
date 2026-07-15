import type { ReactNode } from "react";

export function ContentPage({
  eyebrow,
  title,
  intro,
  children
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="info-page">
      <header className="info-hero section-shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="content-page-body section-shell">{children}</div>
    </div>
  );
}

export function ContentSection({
  title,
  children,
  aside
}: {
  title: string;
  children: ReactNode;
  aside?: string;
}) {
  return (
    <section className="content-section">
      <div>
        <h2>{title}</h2>
        {aside ? <p className="content-section-aside">{aside}</p> : null}
      </div>
      <div className="content-section-copy">{children}</div>
    </section>
  );
}
