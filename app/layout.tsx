import type { Metadata } from 'next';
import { examRequirements } from '@/lib/exam-requirements';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      'https://hateexam.com',
  ),
  title: {
    default: 'HateExam — Exam Photo & Signature Resizer',
    template: '%s | HateExam',
  },
  description:
    `Find official image requirements for ${examRequirements.length} verified Indian exams, then resize photos and signatures by KB and pixels privately in your browser.`,
  applicationName: 'HateExam',
  keywords: [
    'exam photo resizer',
    'signature resizer',
    'image compressor to KB',
    'NEET photo size',
    'JEE photo size',
  ],
  alternates: { canonical: '/' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    title: 'HateExam — Exam Photo & Signature Resizer',
    description:
      'Resize exam photos and signatures by KB, pixels and format without uploading them.',
    siteName: 'HateExam',
  },
  twitter: {
    card: 'summary',
    title: 'HateExam — Exam Photo & Signature Resizer',
    description:
      'Resize exam photos and signatures by KB, pixels and format without uploading them.',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    'https://hateexam.com';
  const websiteStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'HateExam',
      alternateName: ['HateExam Exam Resizer'],
      url: siteUrl,
    };
  const applicationStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'HateExam Exam Photo & Signature Resizer',
      url: siteUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any modern web browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      description:
        'Resize exam photos and signatures by KB, pixels and format in your browser.',
      featureList: [
        'Browser-only image processing',
        'Exam-specific presets',
        'JPG, PNG and WebP export',
      ],
    };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(applicationStructuredData),
          }}
        />
        {children}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({
            token: '778046c549444205b4b78791bcb9c963',
          })}
        />
      </body>
    </html>
  );
}
