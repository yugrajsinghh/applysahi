import type { ReactNode } from 'react';
import Link from 'next/link';

export function InfoPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="info-page">
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/" aria-label="ApplySahi home">
            <span aria-hidden="true">↓</span>
            ApplySahi
          </Link>
          <nav aria-label="Information pages">
            <Link href="/#editor">Resize now</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </header>
      <article className="shell info-article">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {updated && <p className="info-updated">Last updated: {updated}</p>}
        <div className="info-content">{children}</div>
      </article>
      <footer className="shell footer info-footer">
        <Link className="brand" href="/">
          ApplySahi
        </Link>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <Link href="/#editor">Open the editor →</Link>
      </footer>
    </main>
  );
}
