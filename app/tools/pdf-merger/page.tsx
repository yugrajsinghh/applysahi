import type { Metadata } from 'next';
import { PdfMerger } from '@/components/pdf-merger';
import { ToolPageShell } from '@/components/tool-page-shell';
export const metadata: Metadata={title:'Free PDF Merger for Student Documents',description:'Combine marksheets, certificates and application PDFs locally in your browser.'};
export default function Page(){return <ToolPageShell title="PDF merger" description="Put marksheets, certificates or application documents into one PDF in the order you choose." points={['Merge up to ten PDFs at once.','Preserves every page in your chosen order.','No upload, account or watermark.']}><PdfMerger/></ToolPageShell>}
