import type { Metadata } from 'next';
import { InfoPage } from '@/components/info-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ApplySahi handles images, technical information and browser storage.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="PRIVACY POLICY" title="Your files stay on your device." updated="18 October 2026">
      <p>
        This policy explains how ApplySahi handles information when you use
        applysahi.com. The current image editor processes selected photographs
        and signatures inside your browser. It does not upload those files to an
        ApplySahi server or retain a server copy after you leave the page.
      </p>
      <h2>Files and downloads</h2>
      <p>
        Your browser reads the selected image and creates the converted file on
        your device. Downloads are stored wherever your browser normally saves
        files. Delete them yourself when using a shared computer or phone.
      </p>
      <h2>Accounts and information you provide</h2>
      <p>
        ApplySahi currently requires no account and does not request your name,
        application number, identity document or payment information. If you
        email us, we receive your email address and the information you choose to
        include. Do not email examination documents or identity photographs.
      </p>
      <h2>Hosting and technical logs</h2>
      <p>
        Our hosting, domain and security providers may process ordinary request
        data such as IP address, browser type, requested page, timestamp and
        security events to deliver, protect and diagnose the service. Their
        retention and security practices also apply to data processed on their
        systems.
      </p>
      <h2>Cookies, analytics and advertising</h2>
      <p>
        ApplySahi currently uses no advertising cookies, behavioural advertising
        or third-party analytics. Essential browser or hosting functions may use
        limited storage needed to operate or secure the site. We will update this
        policy and, where required, request consent before introducing analytics
        or advertising technologies.
      </p>
      <h2>Sharing and retention</h2>
      <p>
        We do not sell personal data. We may disclose limited information when
        required by law, to protect the service, or to providers that host and
        secure the website. Locally processed image files are not available to
        us. Email correspondence is retained only as long as reasonably needed
        to answer the request, keep necessary records or meet legal obligations.
      </p>
      <h2>Children and students</h2>
      <p>
        The service is designed to avoid collecting student identity data. A
        parent or guardian should assist a child where appropriate. Students
        should never send us passwords, application credentials, Aadhaar numbers
        or complete identity documents.
      </p>
      <h2>Your choices and requests</h2>
      <p>
        You can stop using the service, clear browser data and delete downloaded
        files at any time. For questions, correction requests or privacy
        concerns, contact{' '}
        <a href="mailto:privacy@applysahi.com">privacy@applysahi.com</a>. We may
        need enough information to understand and respond to the request.
      </p>
      <h2>External official websites</h2>
      <p>
        Requirement pages link to examination authorities and documents. Their
        privacy practices and content are controlled by those organisations.
      </p>
      <h2>Changes to this policy</h2>
      <p>
        We will revise the date above when this policy materially changes. A
        future account system, cloud file processing, analytics or advertising
        feature will require a corresponding update before launch.
      </p>
    </InfoPage>
  );
}
