import type { ReactNode } from 'react';
import { ArrowLeft, Check, LockKeyhole } from 'lucide-react';

export function ToolPageShell({ title, description, children, points }: { title: string; description: string; children: ReactNode; points: string[] }) {
  return <main className="tool-page">
    <header className="tool-page-header shell">
      <a href="/" className="brand"><span>↓</span>HateExam</a>
      <a href="/#tools" className="back-link"><ArrowLeft size={16}/> All tools</a>
    </header>
    <section className="tool-hero shell">
      <div><p className="eyebrow">FREE STUDENT TOOL · VERSION 7</p><h1>{title}</h1><p>{description}</p></div>
      <div className="tool-assurance"><LockKeyhole size={21}/><strong>Private by design</strong><span>Your files stay on your device.</span></div>
    </section>
    <section className="tool-workspace shell">{children}</section>
    <section className="tool-points shell"><h2>What this tool does</h2><div>{points.map(point => <article key={point}><Check size={20}/><p>{point}</p></article>)}</div></section>
  </main>;
}
