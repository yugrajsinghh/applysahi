import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      'https://applysahi.com',
  ),
  title: {
    default: 'ApplySahi — Exam Photo & Signature Resizer',
    template: '%s | ApplySahi',
  },
  description:
    'Find official image requirements for 56 major Indian exams, then resize photos and signatures by KB and pixels privately in your browser.',
  applicationName: 'ApplySahi',
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
    title: 'ApplySahi — Exam Photo & Signature Resizer',
    description:
      'Resize exam photos and signatures by KB, pixels and format without uploading them.',
    siteName: 'ApplySahi',
  },
  twitter: {
    card: 'summary',
    title: 'ApplySahi — Exam Photo & Signature Resizer',
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
    'https://applysahi.com';
  const websiteStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ApplySahi',
      alternateName: ['ApplySahi Exam Resizer'],
      url: siteUrl,
    };
  const applicationStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'ApplySahi Exam Photo & Signature Resizer',
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
      </body>
    </html>
  );
}
