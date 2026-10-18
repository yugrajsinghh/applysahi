import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';

export const metadata: Metadata = {
  title: 'About ApplySahi',
  description:
    'How ApplySahi helps students prepare photos and signatures for Indian examination and recruitment forms.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <InfoPage eyebrow="ABOUT APPLYSAHI" title="Application files should be simple.">
      <p>
        ApplySahi is an independent tool that helps students prepare photographs,
        signatures and other supported images for Indian examination and
        recruitment forms. It combines a private browser-based editor with a
        searchable library of requirements drawn from cited official sources.
      </p>
      <h2>Why we built it</h2>
      <p>
        Application portals describe limits in KB, pixels and file formats.
        These are easy to confuse, especially near a deadline. ApplySahi puts the
        requirement and editor together, then gives the finished file a clear,
        exam-specific name.
      </p>
      <h2>What ApplySahi checks</h2>
      <p>
        The editor checks the selected output format, maximum file size and pixel
        dimensions. You must still check image clarity, document validity,
        photograph recency, face position and any live-capture rule shown by the
        official application portal.
      </p>
      <h2>Independent service</h2>
      <p>
        ApplySahi is not affiliated with, authorised by or endorsed by NTA, SSC,
        UPSC, IITs, banks, universities or any examination authority. Names and
        links identify the relevant examination and its official source. The
        current official notice and application portal always control.
      </p>
      <h2>Development transparency</h2>
      <p>
        ApplySahi is built and maintained by its developer using ordinary
        software-development tools, including AI-assisted coding tools. Product
        decisions and published requirement entries are reviewed by a person.
        Exam requirements are supported by the official sources linked on the
        site; they are not presented as reliable merely because an AI system
        produced them.
      </p>
      <h2>Contact</h2>
      <p>
        Questions, corrections and source updates can be sent to{' '}
        <a href="mailto:hello@applysahi.com">hello@applysahi.com</a>.
      </p>
    </InfoPage>
  );
}
