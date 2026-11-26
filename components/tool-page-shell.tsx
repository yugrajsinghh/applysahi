import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, LockKeyhole } from 'lucide-react';

export function ToolPageShell({
  title,
  description,
  children,
  points,
}: {
  title: string;
  description: string;
  children: ReactNode;
  points: string[];
}) {
  return (
    <main className="tool-page">
      <header className="tool-page-header shell">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            HE
          </span>
          <span className="brand-name">HateExam</span>
        </Link>
        <Link href="/#tools" className="back-link">
          <ArrowLeft size={16} /> All tools
        </Link>
      </header>
      <section className="tool-hero shell">
        <div>
          <p className="eyebrow">FREE STUDENT TOOL · VERSION 8</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="tool-assurance">
          <LockKeyhole size={21} />
          <strong>Private by design</strong>
          <span>Your files stay on your device.</span>
        </div>
      </section>
      <section className="tool-workspace shell">{children}</section>
      <section className="tool-points shell">
        <h2>What this tool does</h2>
        <div>
          {points.map((point) => (
            <article key={point}>
              <Check size={20} />
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
