const content = `# HateExam

HateExam is an independent, free collection of browser-based tools for preparing exam and application files. User-selected files are processed on the user's device and are not uploaded to HateExam.

## Primary tools
- Exam photo and signature resizer: https://hateexam.com/tools/photo-signature-resizer
- Exam requirement finder: https://hateexam.com/tools/exam-size-finder
- Exam file readiness checker: https://hateexam.com/tools/exam-file-checker
- Image compressor to target KB: https://hateexam.com/tools/image-compressor
- Exam photo studio with name and date: https://hateexam.com/tools/exam-photo-studio
- PDF compressor for scanned exam documents: https://hateexam.com/tools/pdf-compressor
- PNG and WebP to JPG converter: https://hateexam.com/tools/png-to-jpg
- HEIC to JPG converter: https://hateexam.com/tools/heic-to-jpg
- JPG and images to PDF converter: https://hateexam.com/tools/image-to-pdf
- PDF merger: https://hateexam.com/tools/pdf-merger

## Exam guides
The exam guide directory is https://hateexam.com/exams. Each guide cites an official source and states its evidence level. Requirements can change, so users must verify the current official notification and application portal.

## Identity
HateExam is not affiliated with NTA, SSC, UPSC, IBPS, SBI or any examination authority. The canonical site is https://hateexam.com.
`;

export function GET() {
  return new Response(content, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}
