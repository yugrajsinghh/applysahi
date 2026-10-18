import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ApplySahi — Exam Photo & Signature Resizer',
    short_name: 'ApplySahi',
    description:
      'Prepare exam photographs and signatures by KB, pixels and format.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f5ff',
    theme_color: '#5637ed',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
