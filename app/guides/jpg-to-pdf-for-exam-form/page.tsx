import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideLayout } from '@/components/guide-layout';

export const metadata: Metadata = {
  title: 'How to Convert JPG to PDF for an Exam Form',
  description:
    'Combine JPG document photos into one ordered PDF for exam and application forms without uploading the files.',
  alternates: { canonical: '/guides/jpg-to-pdf-for-exam-form' },
};
export default function Page() {
  return (
    <GuideLayout
      title="How to convert JPG to PDF for an exam form"
      description="Combine marksheet, certificate or ID photos into one PDF in the correct order, without uploading them to a server."
      updated="26 November 2026"
      related={[
        { href: '/tools/image-to-pdf', label: 'Open JPG to PDF converter' },
        { href: '/tools/pdf-merger', label: 'Merge existing PDFs' },
      ]}
    >
      <p className="guide-lead">
        Use clear, upright images, put them in the order requested by the form
        and create one PDF. Check every page before uploading.
      </p>
      <h2>1. Prepare readable images</h2>
      <p>
        Photograph documents in bright, even light. Keep all four corners
        visible, avoid shadows and rotate each image upright.
      </p>
      <h2>2. Arrange the pages</h2>
      <p>
        Add the images in the order the portal requests—for example, front of
        marksheet before back. A correct PDF with pages in the wrong order may
        still be rejected.
      </p>
      <h2>3. Create the PDF privately</h2>
      <p>
        HateExam builds the PDF in your browser. The document images are not
        sent to our server, which is safer for marksheets and identity
        documents.
      </p>
      <h2>4. Check size and readability</h2>
      <p>
        Open the downloaded PDF and zoom into names, numbers and stamps. If the
        portal has a maximum PDF size, check the final file before upload.
      </p>
      <h2>JPG to PDF or PDF merger?</h2>
      <p>
        Use JPG to PDF when your source files are images. Use PDF merger when
        every source file is already a PDF.
      </p>
      <div className="guide-callout">
        <strong>Make the document</strong>
        <p>
          <Link href="/tools/image-to-pdf">
            Open the free JPG to PDF converter
          </Link>{' '}
          and arrange up to 12 images.
        </p>
      </div>
    </GuideLayout>
  );
}
