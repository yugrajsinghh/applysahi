import type { Metadata } from 'next';
import { HeicConverter } from '@/components/heic-converter';
import { ToolPageShell } from '@/components/tool-page-shell';
export const metadata: Metadata={title:'HEIC to JPG Converter for Exam Forms',description:'Convert an iPhone HEIC or HEIF photo into a widely accepted JPG privately in your browser.',alternates:{canonical:'/tools/heic-to-jpg'}};
export default function Page(){return <ToolPageShell title="HEIC to JPG" description="Turn an iPhone photo into a standard JPG before resizing it for an application form." points={['Converts HEIC and HEIF photos to JPG.','Keeps files on your device.','Creates a clearly named ready-to-use download.']}><HeicConverter/></ToolPageShell>}
