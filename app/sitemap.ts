import type { MetadataRoute } from 'next';
import { examSlug, priorityExams } from '@/lib/exam-seo';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://applysahi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/about', '/privacy', '/terms', '/tools/photo-signature-resizer', '/tools/exam-size-finder', '/tools/image-to-pdf', '/tools/heic-to-jpg', '/tools/pdf-merger'];
  const pages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date('2026-09-11'),
    changeFrequency: path ? 'monthly' : 'weekly',
    priority: path.startsWith('/tools/') ? 0.9 : path ? 0.6 : 1,
  }));
  const examPages: MetadataRoute.Sitemap = priorityExams.map((exam) => ({
    url: `${siteUrl}/exams/${examSlug(exam.name)}`,
    lastModified: new Date('2026-10-18'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...pages, ...examPages];
}
