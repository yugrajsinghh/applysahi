import { FileImage, Images, Search, Combine, Smartphone, FileCheck2, ImageDown, RefreshCw } from 'lucide-react';

export const siteTools = [
  { slug: 'photo-signature-resizer', name: 'Photo & signature resizer', short: 'Resize, crop and compress exam images.', icon: FileImage, color: 'green' },
  { slug: 'exam-size-finder', name: 'Exam size finder', short: 'Find verified photo and signature rules.', icon: Search, color: 'blue' },
  { slug: 'exam-file-checker', name: 'Exam file checker', short: 'Check KB, format and pixels before upload.', icon: FileCheck2, color: 'red' },
  { slug: 'image-compressor', name: 'Image compressor', short: 'Compress JPG, PNG or WebP to a target KB.', icon: ImageDown, color: 'green' },
  { slug: 'png-to-jpg', name: 'PNG to JPG converter', short: 'Convert PNG or WebP into standard JPG.', icon: RefreshCw, color: 'blue' },
  { slug: 'image-to-pdf', name: 'Images to PDF', short: 'Turn document photos into one PDF.', icon: Images, color: 'green' },
  { slug: 'heic-to-jpg', name: 'HEIC to JPG', short: 'Make iPhone photos upload-ready.', icon: Smartphone, color: 'blue' },
  { slug: 'pdf-merger', name: 'PDF merger', short: 'Combine marksheets and documents.', icon: Combine, color: 'red' },
] as const;
