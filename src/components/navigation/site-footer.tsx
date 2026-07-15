import { Instagram, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { LuckyLogo } from "@/components/brand/lucky-logo";
import { footerNavigation } from "@/data/navigation";

export function SiteFooter() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand-block">
          <Link className="footer-logo-link" href="/" aria-label="Lucky’s Loot home">
            <LuckyLogo sizes="88px" />
            <span>Lucky’s Loot</span>
          </Link>
          <p>
            Display and protection supplies for collectors who care how the collection looks.
          </p>
          <span className="footer-location"><MapPin size={16} aria-hidden="true" /> Richmond / Houston area</span>
          <div className="footer-contact-links">
            {supportEmail ? (
              <a href={`mailto:${supportEmail}`}><Mail size={16} aria-hidden="true" /> {supportEmail}</a>
            ) : (
              <Link href="/contact"><Mail size={16} aria-hidden="true" /> Contact Lucky’s Loot</Link>
            )}
            <span title="Instagram profile URL pending verification">
              <Instagram size={16} aria-hidden="true" /> Instagram
            </span>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerNavigation.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="section-shell footer-bottom">
        <p>© {new Date().getFullYear()} Lucky’s Loot. All rights reserved.</p>
        <p>Secure online checkout with Houston-area and event pickup options.</p>
      </div>
    </footer>
  );
}
