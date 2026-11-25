import type { Metadata } from 'next';
import { ImageCompressor } from '@/components/image-compressor';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ToolSeoContent } from '@/components/tool-seo-content';

export const metadata: Metadata = {
  title: 'Compress Image to 20KB, 50KB or 100KB Online',
  description: 'Compress a JPG, PNG or WebP image to a target size in KB online for free. Private browser processing with no upload or sign-up.',
  alternates: { canonical: '/tools/image-compressor' },
};

export default function Page() {
  return <ToolPageShell title="Compress image to a target size in KB" description="Reduce a JPG, PNG or WebP to 20 KB, 50 KB, 100 KB or another limit without uploading it." points={['Choose any target from 5 KB to 5 MB.','Keeps the sharpest result that fits the selected limit.','Shows the final KB and pixel dimensions before download.']}>
    <ImageCompressor />
    <ToolSeoContent name="the image compressor" shortAnswer="HateExam compresses JPG, PNG and WebP images to a maximum file size you choose. It tests image quality and, when needed, carefully reduces dimensions until the file fits the KB limit." steps={['Choose your JPG, PNG or WebP image.','Enter the maximum size required by your form, such as 20 KB or 50 KB.','Choose an output format and press Compress image.','Check the final KB and dimensions, then download the result.']} faqs={[{question:'How do I compress an image to 50 KB?',answer:'Choose the image, enter 50 in the maximum-size box and select JPG for the most efficient photo compression. Download only after the result reports 50 KB or less.'},{question:'Will my image be uploaded?',answer:'No. Compression runs inside your browser and the selected image stays on your device.'},{question:'Why can PNG be larger than JPG?',answer:'PNG uses lossless compression and is best for graphics. JPG is usually much smaller for photographs and signatures on a plain background.'}]} related={[{href:'/tools/photo-signature-resizer',label:'Photo and signature resizer'},{href:'/tools/exam-file-checker',label:'Exam file checker'}]} />
  </ToolPageShell>;
}
