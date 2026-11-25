import type { Metadata } from 'next';
import { ImageFormatConverter } from '@/components/image-format-converter';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ToolSeoContent } from '@/components/tool-seo-content';

export const metadata: Metadata = {
  title: 'PNG to JPG Converter Online Free',
  description: 'Convert PNG or WebP images to JPG online for free. Choose the quality and background colour with private, browser-only processing.',
  alternates: { canonical: '/tools/png-to-jpg' },
};

export default function Page() {
  return <ToolPageShell title="PNG and WebP to JPG converter" description="Convert a PNG or WebP image into a standard JPG accepted by most exam and application portals." points={['Preserves the original pixel dimensions.','Lets you choose the JPG quality and transparency background.','Runs entirely on your device with no upload.']}>
    <ImageFormatConverter />
    <ToolSeoContent name="the PNG to JPG converter" shortAnswer="This free converter changes PNG and WebP images into standard JPG files. Transparent areas are filled with the background colour you choose, and the original width and height are preserved." steps={['Choose a PNG or WebP image.','Select JPG quality and a background colour for transparent areas.','Press Convert and download JPG.','Check the JPG before uploading it to your form.']} faqs={[{question:'How do I convert PNG to JPG?',answer:'Choose your PNG, select a background and quality, then press Convert and download JPG. The conversion happens in your browser.'},{question:'What happens to a transparent PNG background?',answer:'JPG does not support transparency, so HateExam fills transparent areas with your selected colour. White is the safest choice for most forms.'},{question:'Does converting to JPG change the image dimensions?',answer:'No. This converter preserves the original width and height in pixels.'}]} related={[{href:'/tools/image-compressor',label:'Compress image to KB'},{href:'/tools/heic-to-jpg',label:'HEIC to JPG converter'}]} />
  </ToolPageShell>;
}
