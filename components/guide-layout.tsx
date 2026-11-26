import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from 'lucide-react';

export function GuideLayout({
  title,
  description,
  updated,
  children,
  related,
}: {
  title: string;
  description: string;
  updated: string;
  children: ReactNode;
  related: { href: string; label: string }[];
}) {
  return (
    <main className="guide-page">
      <header className="tool-page-header shell">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            HE
          </span>
          <span className="brand-name">HateExam</span>
        </Link>
        <Link href="/guides" className="back-link">
          <ArrowLeft size={16} /> All guides
        </Link>
      </header>
      <article className="guide-article shell">
        <div className="guide-article-head">
          <p className="eyebrow">HATEEXAM PRACTICAL GUIDE</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="guide-meta">
            <span>
              <CheckCircle2 size={15} /> Checked {updated}
            </span>
            <span>
              <LockKeyhole size={15} /> Privacy-first methods
            </span>
          </div>
        </div>
        <div className="guide-body">{children}</div>
        <aside className="guide-related">
          <strong>Continue with</strong>
          {related.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </aside>
      </article>
    </main>
  );
}
