import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { examSlug, getExamBySlug, priorityExams } from '@/lib/exam-seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return priorityExams.map((exam) => ({ slug: examSlug(exam.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) return {};
  const title = `${exam.name} Photo & Signature Size ${exam.cycle}`;
  const description = `Check ${exam.name} ${exam.cycle} photo, signature, document, KB, pixel and format requirements from the cited official source, then resize privately.`;
  return {
    title,
    description,
    alternates: { canonical: `/exams/${slug}` },
    openGraph: { title, description, type: 'article', url: `/exams/${slug}` },
  };
}

export default async function ExamPage({ params }: PageProps) {
  const { slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) notFound();
  const related = priorityExams.filter((item) => item.name !== exam.name && item.family === exam.family).slice(0, 4);
  const articleJsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${exam.name} photo and signature requirements ${exam.cycle}`,
    dateModified: '2026-10-18',
    author: { '@type': 'Organization', name: 'ApplySahi' },
    publisher: { '@type': 'Organization', name: 'ApplySahi' },
    mainEntityOfPage: `/exams/${slug}`,
  };

  return (
    <main className="exam-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <header className="exam-page-header shell">
        <Link className="brand" href="/" aria-label="ApplySahi home"><span aria-hidden="true">↓</span> ApplySahi</Link>
        <Link className="primary-link" href={`/?exam=${slug}#editor`}>Resize now <ArrowRight size={17} /></Link>
      </header>
      <article className="exam-article shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href="/#requirements">Exam sizes</Link><span>/</span><span>{exam.name}</span>
        </nav>
        <p className="eyebrow">{exam.authority} · {exam.family} · {exam.cycle}</p>
        <h1>{exam.name} photo and signature size</h1>
        <p className="exam-lead">Prepare your {exam.name} images using the requirements below. The file editor runs in your browser, so your selected image stays on your device.</p>
        <div className={`source-status ${exam.confidence === 'Portal check needed' ? 'check' : ''}`}>
          <ShieldCheck size={20} /><div><strong>{exam.confidence}</strong><span>Last reviewed 18 October 2026 · cycle {exam.cycle}</span></div>
        </div>
        <section>
          <h2>{exam.name} image requirements</h2>
          <p>{exam.note}</p>
          <div className="seo-asset-grid">
            {exam.assets.map((asset, index) => (
              <article key={asset.name}>
                <h3>{asset.name}</h3><p>{asset.requirement}</p>
                {asset.dimensions && <p><strong>Dimensions:</strong> {asset.dimensions}</p>}
                {asset.dimensionNote && <small>{asset.dimensionNote}</small>}
                {asset.preset && <Link href={`/?exam=${slug}&asset=${index}#editor`}>Use {asset.preset.maximumKb} KB{asset.preset.width ? ` · ${asset.preset.width}×${asset.preset.height} px` : ''} preset <ArrowRight size={15} /></Link>}
              </article>
            ))}
          </div>
        </section>
        <section className="exam-steps">
          <h2>How to prepare the file</h2>
          <ol><li>Choose the matching photo or signature preset.</li><li>Select your image. It is processed locally in your browser.</li><li>Check the preview, dimensions and final KB size.</li><li>Download the clearly named file and verify it in the official portal.</li></ol>
          <Link className="primary-link" href={`/?exam=${slug}#editor`}>Open the free resizer <ArrowRight size={17} /></Link>
        </section>
        <section className="official-source-box">
          <h2>Official source</h2><p>Requirements can change between application cycles. The active application and current official notice always take priority.</p>
          <a href={exam.sourceUrl} target="_blank" rel="noreferrer">{exam.sourceLabel} <ExternalLink size={15} /></a>
        </section>
        {related.length > 0 && <section><h2>Related exam sizes</h2><div className="related-exams">{related.map((item) => <Link key={item.name} href={`/exams/${examSlug(item.name)}`}>{item.name}<span>{item.cycle} requirements →</span></Link>)}</div></section>}
      </article>
      <footer className="shell footer"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></footer>
    </main>
  );
}
