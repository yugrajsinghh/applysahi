import { FileImage, Images, Search, Combine, Smartphone } from 'lucide-react';

export const siteTools = [
  { slug: 'photo-signature-resizer', name: 'Photo & signature resizer', short: 'Resize, crop and compress exam images.', icon: FileImage, color: 'green' },
  { slug: 'exam-size-finder', name: 'Exam size finder', short: 'Find verified photo and signature rules.', icon: Search, color: 'blue' },
  { slug: 'image-to-pdf', name: 'Images to PDF', short: 'Turn document photos into one PDF.', icon: Images, color: 'green' },
  { slug: 'heic-to-jpg', name: 'HEIC to JPG', short: 'Make iPhone photos upload-ready.', icon: Smartphone, color: 'blue' },
  { slug: 'pdf-merger', name: 'PDF merger', short: 'Combine marksheets and documents.', icon: Combine, color: 'red' },
] as const;
