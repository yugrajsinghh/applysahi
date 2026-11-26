import type { Metadata } from 'next';
import { PdfCompressor } from '@/components/pdf-compressor';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ToolSeoContent } from '@/components/tool-seo-content';

export const metadata: Metadata = {
  title: 'PDF Compressor to KB for Exam Forms',
  description:
    'Compress scanned marksheets, certificates and exam documents to a target KB privately in your browser.',
  alternates: { canonical: '/tools/pdf-compressor' },
};
export default function Page() {
  return (
    <ToolPageShell
      title="PDF compressor for exam documents"
      description="Reduce scanned forms, marksheets and certificates toward a target KB without uploading the PDF."
      points={[
        'Compress scanned PDFs toward a target from 100 KB to 10 MB.',
        'Supports documents of up to 30 pages.',
        'Shows the final file size before download.',
      ]}
    >
      <PdfCompressor />
      <ToolSeoContent
        name="the PDF compressor"
        shortAnswer="HateExam renders scanned PDF pages as compressed images and rebuilds them into a smaller PDF. This is useful for marksheets and certificates but removes selectable text."
        steps={[
          'Choose a scanned PDF of up to 30 pages.',
          'Enter the maximum target size required by your form.',
          'Compress the PDF and review the final size.',
          'Download and open the result to check readability before upload.',
        ]}
        faqs={[
          {
            question: 'How do I compress a PDF to 500 KB?',
            answer:
              'Choose the PDF, enter 500 KB and press Compress PDF. HateExam reduces page image resolution and quality, then reports whether the target was reached.',
          },
          {
            question: 'Will the text remain selectable?',
            answer:
              'No. Pages are rasterized during compression. Use this tool for scanned documents, not a text PDF that must remain searchable or accessible.',
          },
          {
            question: 'Is the PDF uploaded?',
            answer: 'No. Rendering and compression happen inside your browser.',
          },
        ]}
        related={[
          { href: '/tools/pdf-merger', label: 'Merge PDF files' },
          { href: '/tools/image-to-pdf', label: 'Convert JPG to PDF' },
        ]}
      />
    </ToolPageShell>
  );
}
