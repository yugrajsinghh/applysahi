import type { Metadata } from 'next';
import { ExamPhotoStudio } from '@/components/exam-photo-studio';
import { ToolPageShell } from '@/components/tool-page-shell';
import { ToolSeoContent } from '@/components/tool-seo-content';

export const metadata: Metadata = {
  title: 'Exam Photo Maker with Name and Date',
  description:
    'Create an exam photo with candidate name and date, common dimensions, clean framing and a printable passport-photo sheet.',
  alternates: { canonical: '/tools/exam-photo-studio' },
};
export default function Page() {
  return (
    <ToolPageShell
      title="Exam photo studio with name and date"
      description="Frame an exam photograph, add the candidate name and photo date, and download an individual JPG or printable six-photo sheet."
      points={[
        'Common passport, SSC-style and square photo presets.',
        'Optional candidate name and photograph date strip.',
        'Private browser processing with no photo upload.',
      ]}
    >
      <ExamPhotoStudio />
      <ToolSeoContent
        name="the exam photo studio"
        shortAnswer="HateExam creates a neatly framed exam photograph with optional candidate name and photograph date. It can download one JPG or a printable six-photo sheet without uploading the selected photo."
        steps={[
          'Choose a clear front-facing photograph.',
          'Select the dimensions required by your form.',
          'Optionally enter the candidate name and photograph date.',
          'Adjust the vertical framing, check the preview and download.',
        ]}
        faqs={[
          {
            question: 'How do I add my name and date below an exam photo?',
            answer:
              'Choose your photo, enter the candidate name and photograph date, and HateExam places both in a white strip below the framed photograph.',
          },
          {
            question: 'Does this tool remove the photo background?',
            answer:
              'No. It frames and labels the photograph but does not automatically isolate a person or replace the original background.',
          },
          {
            question: 'Is my photograph uploaded?',
            answer:
              'No. The studio works inside your browser and the selected photograph stays on your device.',
          },
        ]}
        related={[
          {
            href: '/tools/photo-signature-resizer',
            label: 'Resize photo to exact KB',
          },
          { href: '/tools/exam-file-checker', label: 'Check an exam file' },
        ]}
      />
    </ToolPageShell>
  );
}
