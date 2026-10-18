import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using ApplySahi examination image preparation tools.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <InfoPage eyebrow="TERMS OF USE" title="Use ApplySahi as a preparation tool." updated="18 October 2026">
      <p>
        These terms apply when you use applysahi.com. ApplySahi provides an image
        preparation tool and a reference library for examination and recruitment
        applications. By using the service, you agree to check the active form
        and current official instructions before submitting any file.
      </p>
      <h2>Independent service</h2>
      <p>
        ApplySahi is not an examination authority and is not affiliated with or
        endorsed by NTA, SSC, UPSC, IITs, banks, universities or other listed
        organisations. Examination names are used only to identify relevant
        requirements and sources.
      </p>
      <h2>No acceptance guarantee</h2>
      <p>
        A file that meets selected KB, format and pixel settings can still be
        rejected for reasons ApplySahi cannot inspect, including face position,
        photograph age, background, handwriting, document content, minimum-size
        rules or live capture. ApplySahi does not submit applications or promise
        acceptance, eligibility, admission, employment or results.
      </p>
      <h2>Requirement information</h2>
      <p>
        We aim to cite official sources and identify the relevant cycle, but
        authorities can change notices and portal rules without warning. The
        current authority notice and live application portal take priority over
        information displayed here.
      </p>
      <h2>Your responsibilities</h2>
      <p>
        You are responsible for reviewing the finished file, maintaining
        backups, protecting application credentials and submitting before the
        deadline. Do not use ApplySahi to forge, impersonate, misrepresent,
        obscure or unlawfully alter a document or another person’s image.
      </p>
      <h2>Service and intellectual property</h2>
      <p>
        You may use the service for lawful personal and application-related
        purposes. The ApplySahi name, interface, original text and software are
        protected by applicable law. Official notices and third-party marks
        remain the property of their respective owners.
      </p>
      <h2>Availability and limitation</h2>
      <p>
        The service is provided on an “as available” basis and may change or be
        interrupted. To the extent permitted by applicable law, ApplySahi is not
        responsible for indirect loss, missed deadlines, application rejection,
        lost files or decisions made by an examination authority. Nothing here
        excludes a right or liability that applicable law does not allow us to
        exclude.
      </p>
      <h2>Changes and contact</h2>
      <p>
        We may update these terms as the product or law changes. Continued use
        after an update means the revised terms apply. Questions can be sent to{' '}
        <a href="mailto:hello@applysahi.com">hello@applysahi.com</a>.
      </p>
    </InfoPage>
  );
}
