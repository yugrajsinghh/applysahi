import type { Metadata } from 'next';
import { ExamFileChecker } from '@/components/exam-file-checker';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ToolSeoContent } from '@/components/tool-seo-content';

export const metadata: Metadata = {
  title: 'Exam Photo and Signature File Checker',
  description: 'Check an exam photo, signature or document for file type, KB and pixel requirements before uploading it.',
  alternates: { canonical: '/tools/exam-file-checker' },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Exam upload readiness checker"
      description="Check whether your exam photo, signature or document matches the published file rules before opening the application portal."
      points={[
        'Select from the verified HateExam requirements library.',
        'Checks file type, KB and exact pixels where published.',
        'Runs privately in your browser without uploading your file.',
      ]}
    >
      <ExamFileChecker />
      <ToolSeoContent name="the exam file checker" shortAnswer="HateExam checks a selected photo, signature or document against the published format, KB and pixel rules for your chosen exam. It reports what passes and what needs attention before you open the official portal." steps={['Select your exam and document type.','Choose the file you plan to upload.','Review the format, KB and dimension results.','Fix any warning with the linked HateExam tool, then verify the file in the official portal.']} faqs={[{question:'Can this guarantee an exam portal will accept my file?',answer:'No. It checks machine-readable file rules, but only the official portal can make the final acceptance decision. Visual requirements such as face position must still be checked by you.'},{question:'Does the checker upload my document?',answer:'No. The selected file is inspected inside your browser and is not sent to HateExam.'},{question:'Why does an exam show no automatic checks?',answer:'Some official notices do not publish reusable KB or pixel limits. In that case, follow the current portal instructions rather than guessing.'}]} related={[{href:'/tools/photo-signature-resizer',label:'Resize photo or signature'},{href:'/tools/image-compressor',label:'Compress image to KB'}]} />
    </ToolPageShell>
  );
}
