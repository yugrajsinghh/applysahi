import Link from 'next/link';

type Faq = { question: string; answer: string };

export function ToolSeoContent({
  name,
  shortAnswer,
  steps,
  faqs,
  related = [],
}: {
  name: string;
  shortAnswer: string;
  steps: string[];
  faqs: Faq[];
  related?: { href: string; label: string }[];
}) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use ${name}`,
      step: steps.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ];
  return <section className="tool-seo shell" aria-label={`${name} guide`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="quick-answer"><p className="eyebrow">QUICK ANSWER</p><h2>What does this tool do?</h2><p>{shortAnswer}</p></div>
    <div className="seo-guide-grid">
      <article><h2>How to use {name}</h2><ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol></article>
      <article><h2>Frequently asked questions</h2><div className="tool-faqs">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></article>
    </div>
    {related.length > 0 && <nav className="related-tools" aria-label="Related tools"><strong>Related free tools</strong>{related.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>}
    <p className="answer-source-note">HateExam is an independent student utility. Always follow the current instructions shown by the official application portal.</p>
  </section>;
}
