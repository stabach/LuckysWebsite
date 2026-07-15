import type { ReactNode } from "react";
import Link from "next/link";

export function FoundationShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <header className="foundation-header">
        <div className="foundation-header-inner section-shell">
          <Link className="foundation-wordmark" href="/" aria-label="Lucky’s Loot home">
            <span aria-hidden="true">✦</span> Lucky’s Loot
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/find-your-fit">Find Your Fit</Link>
            <Link href="/events">Events</Link>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="foundation-footer">
        <div className="section-shell">
          <p>Collector supplies with Houston-area pickup.</p>
          <p>© {new Date().getFullYear()} Lucky’s Loot</p>
        </div>
      </footer>
    </div>
  );
}
