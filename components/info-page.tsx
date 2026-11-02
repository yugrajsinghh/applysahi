import type { ReactNode } from 'react';

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
          <a className="brand" href="/" aria-label="ApplySahi home">
            <span aria-hidden="true">↓</span>
            ApplySahi
          </a>
          <nav aria-label="Information pages">
            <a href="/#editor">Resize now</a>
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
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
        <a className="brand" href="/">
          ApplySahi
        </a>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <a href="/#editor">Open the editor →</a>
      </footer>
    </main>
  );
}
