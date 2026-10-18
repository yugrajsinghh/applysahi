import type { MetadataRoute } from 'next';
import { examSlug, priorityExams } from '@/lib/exam-seo';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://applysahi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = ['', '/about', '/privacy', '/terms'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date('2026-09-11'),
    changeFrequency: path ? 'monthly' : 'weekly',
    priority: path ? 0.6 : 1,
  }));
  const examPages: MetadataRoute.Sitemap = priorityExams.map((exam) => ({
    url: `${siteUrl}/exams/${examSlug(exam.name)}`,
    lastModified: new Date('2026-10-18'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...pages, ...examPages];
}
