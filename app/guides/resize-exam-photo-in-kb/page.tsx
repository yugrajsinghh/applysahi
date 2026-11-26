import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideLayout } from '@/components/guide-layout';

export const metadata: Metadata = {
  title: 'How to Resize an Exam Photo in KB',
  description:
    'Resize an exam photo to 20 KB, 50 KB or 100 KB while keeping the required pixels and JPG format.',
  alternates: { canonical: '/guides/resize-exam-photo-in-kb' },
};

export default function Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to resize an exam photo in KB',
    step: [
      'Read the portal requirements',
      'Choose the image',
      'Enter KB and pixel limits',
      'Process and verify the result',
      'Download and upload',
    ].map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
    })),
  };
  return (
    <GuideLayout
      title="How to resize an exam photo in KB"
      description="A safe way to make a photo fit 20 KB, 50 KB or 100 KB limits without losing track of its pixel dimensions."
      updated="26 November 2026"
      related={[
        { href: '/tools/photo-signature-resizer', label: 'Open photo resizer' },
        {
          href: '/guides/photo-signature-size',
          label: 'Understand KB and pixels',
        },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <p className="guide-lead">
        To resize an exam photo, copy the maximum KB, width, height and format
        from the current application form. Enter all of them in the resizer,
        then verify the downloaded file before uploading it.
      </p>
      <h2>1. Read all four requirements</h2>
      <p>
        Do not look only at the KB limit. The portal may also require exact
        pixels, JPG format, a recent photograph, a plain background or a minimum
        file size.
      </p>
      <h2>2. Use the exact KB limit</h2>
      <p>
        If the form says 20–50 KB, use 50 KB as the maximum. If it says “below
        100 KB,” use 100 KB. A smaller file is not automatically better when the
        form also gives a minimum.
      </p>
      <h2>3. Keep the required dimensions</h2>
      <p>
        Enter width and height only when the portal specifies them. HateExam
        keeps exact dimensions and changes image quality to meet the KB target.
        It will not silently shrink fixed dimensions.
      </p>
      <h2>4. Crop blank space carefully</h2>
      <p>
        Removing unnecessary space around a signature can reduce file size. For
        photographs, keep the full face and shoulders visible and follow the
        portal’s background instructions.
      </p>
      <h2>5. Verify the downloaded file</h2>
      <p>
        Check the final KB, pixels and format shown by the tool. Open the file
        once to make sure the face or writing is clear, then upload it to the
        official portal.
      </p>
      <div className="guide-callout">
        <strong>Try it now</strong>
        <p>
          <Link href="/tools/photo-signature-resizer">
            Open the private exam photo and signature resizer
          </Link>
          . Your selected image stays on your device.
        </p>
      </div>
    </GuideLayout>
  );
}
