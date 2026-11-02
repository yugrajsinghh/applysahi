import type { Metadata } from 'next';
import { ImageToPdf } from '@/components/image-to-pdf';
import { ToolPageShell } from '@/components/tool-page-shell';
export const metadata: Metadata={title:'Images to PDF Converter for Students',description:'Combine JPG, PNG and WebP document photos into one private PDF in your browser.'};
export default function Page(){return <ToolPageShell title="Images to PDF" description="Combine document photos, certificates and assignments into one clean PDF without uploading them." points={['Each selected image becomes one PDF page.','Choose A4 pages or fit each page to its image.','Files are processed locally and download immediately.']}><ImageToPdf/></ToolPageShell>}
