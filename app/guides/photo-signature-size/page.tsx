import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideLayout } from '@/components/guide-layout';

export const metadata: Metadata = {
  title: 'Exam Photo and Signature Size: KB vs Pixels',
  description:
    'Understand exam photo and signature requirements: KB, pixels, JPG format, aspect ratio and common upload errors.',
  alternates: { canonical: '/guides/photo-signature-size' },
};
export default function Page() {
  return (
    <GuideLayout
      title="Exam photo and signature size: KB vs pixels"
      description="KB and pixels measure different things. Most upload errors happen when only one of them is checked."
      updated="26 November 2026"
      related={[
        { href: '/tools/exam-size-finder', label: 'Find an exam requirement' },
        { href: '/tools/exam-file-checker', label: 'Check an existing file' },
      ]}
    >
      <p className="guide-lead">
        KB is the amount of storage used by a file. Pixels are its width and
        height. An image can be below 50 KB and still have the wrong dimensions,
        so always check both.
      </p>
      <h2>What does KB mean?</h2>
      <p>
        KB describes file size. A form that asks for 20–50 KB may reject a 12 KB
        file as well as a 70 KB file. Compression changes the amount of image
        data stored.
      </p>
      <h2>What do pixels mean?</h2>
      <p>
        Pixels describe dimensions, such as 200 × 230 px. Resizing pixels
        changes the shape or resolution of the image. Compression alone does not
        guarantee the correct dimensions.
      </p>
      <h2>Why are photo and signature rules different?</h2>
      <p>
        A photograph needs enough detail for identification. A signature is
        usually a wide, short image and often has a smaller KB limit. Never
        reuse photo dimensions for a signature.
      </p>
      <h2>Which format should I choose?</h2>
      <p>
        Use exactly the format named by the portal. JPG is common for
        photographs and signatures because it compresses well. PNG is useful
        only when accepted; PDF is normally reserved for documents.
      </p>
      <h2>Final upload checklist</h2>
      <ul>
        <li>Correct file type: JPG, PNG or PDF</li>
        <li>File size within both minimum and maximum limits</li>
        <li>Exact pixels when specified</li>
        <li>Clear face or readable signature</li>
        <li>Current official instructions checked</li>
      </ul>
      <div className="guide-callout">
        <strong>Do not guess</strong>
        <p>
          Use the <Link href="/tools/exam-size-finder">exam size finder</Link>{' '}
          as a starting point, then confirm the current cycle on the official
          portal.
        </p>
      </div>
    </GuideLayout>
  );
}
