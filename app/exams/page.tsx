import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { examSlug, priorityExams } from '@/lib/exam-seo';

export const metadata: Metadata = {
  title: 'Official Exam Photo and Signature Sizes',
  description:
    'Browse photo, signature, document, KB, pixel and file-format requirements for 56 major Indian examinations.',
  alternates: { canonical: '/exams' },
};

export default function ExamsPage() {
  const families = Map.groupBy(priorityExams, (exam) => exam.family);

  return (
    <main className="exam-page">
      <header className="exam-page-header shell">
        <Link className="brand" href="/" aria-label="HateExam home">
          <span aria-hidden="true">↓</span> HateExam
        </Link>
        <Link className="primary-link" href="/#editor">
          Resize now <ArrowRight size={17} />
        </Link>
      </header>
      <article className="exam-article shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><span>Exam sizes</span>
        </nav>
        <p className="eyebrow">OFFICIAL-SOURCE REQUIREMENT GUIDES</p>
        <h1>Exam photo and signature sizes</h1>
        <p className="exam-lead">
          Browse all {priorityExams.length} researched exam guides. Always check
          the current official notice before submitting an application.
        </p>
        {[...families.entries()].map(([family, exams]) => (
          <section key={family}>
            <h2>{family}</h2>
            <div className="related-exams">
              {exams.map((exam) => (
                <Link key={exam.name} href={`/exams/${examSlug(exam.name)}`}>
                  {exam.name}
                  <span>{exam.cycle} requirements →</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </article>
      <footer className="shell footer">
        <Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
      </footer>
    </main>
  );
}
