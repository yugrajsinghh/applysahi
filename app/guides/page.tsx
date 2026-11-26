import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  FileImage,
  FileText,
  Ruler,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exam Photo, Signature and PDF Guides',
  description:
    'Simple guides for resizing exam photos and signatures in KB, checking dimensions, and making application PDFs.',
  alternates: { canonical: '/guides' },
};

const guides = [
  {
    href: '/guides/resize-exam-photo-in-kb',
    title: 'How to resize an exam photo in KB',
    copy: 'Reduce a photo to 20 KB, 50 KB or 100 KB without ignoring the required pixels.',
    icon: FileImage,
  },
  {
    href: '/guides/photo-signature-size',
    title: 'Photo size vs signature size',
    copy: 'Understand KB, pixels, format and how to read an exam portal’s upload instructions.',
    icon: Ruler,
  },
  {
    href: '/guides/jpg-to-pdf-for-exam-form',
    title: 'How to make a JPG PDF for an exam form',
    copy: 'Turn marksheet or certificate photos into a clean, correctly ordered PDF.',
    icon: FileText,
  },
];

export default function GuidesPage() {
  return (
    <main className="guide-page">
      <header className="tool-page-header shell">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            HE
          </span>
          <span className="brand-name">HateExam</span>
        </Link>
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Home
        </Link>
      </header>
      <section className="guide-index shell">
        <p className="eyebrow">CLEAR ANSWERS, NO JARGON</p>
        <h1>Exam file guides</h1>
        <p className="guide-index-intro">
          Practical answers for the photo, signature and PDF errors students
          meet while filling online forms.
        </p>
        <div className="guide-card-grid">
          {guides.map(({ href, title, copy, icon: Icon }) => (
            <Link key={href} href={href}>
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{copy}</p>
              <span>
                Read guide <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
        <div className="guide-cta">
          <div>
            <strong>Ready to prepare your file?</strong>
            <span>Use the free tools without creating an account.</span>
          </div>
          <Link href="/#tools">
            Open all tools <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
