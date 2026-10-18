'use client';

import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  ExternalLink,
  Ruler,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { examRequirements, type ExamPreset } from '@/lib/exam-requirements';
import { examSlug, priorityExamNames } from '@/lib/exam-seo';

type Props = {
  onUsePreset: (
    preset: ExamPreset,
    label: string,
    context: { exam: string; asset: string },
  ) => void;
};

export function ExamRequirements({ onUsePreset }: Props) {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('All');
  const [expanded, setExpanded] = useState<string | null>('NEET (UG)');
  const families = [
    'All',
    ...Array.from(new Set(examRequirements.map((item) => item.family))),
  ];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return examRequirements.filter(
      (item) =>
        (family === 'All' || item.family === family) &&
        (!needle ||
          `${item.name} ${item.authority} ${item.family}`
            .toLowerCase()
            .includes(needle)),
    );
  }, [family, query]);

  function dimensionsFor(requirement: string) {
    const range = requirement.match(
      /\d+\s*[×x]\s*\d+(?:\s+to\s+\d+\s*[×x]\s*\d+)?\s*px/i,
    );
    return range?.[0] ?? 'Not stated in the official source';
  }

  return (
    <section id="requirements" className="requirements-section">
      <div className="shell">
        <div className="requirements-heading">
          <div>
            <p className="eyebrow">
              <Sparkles size={14} /> OFFICIAL-SOURCE LIBRARY
            </p>
            <h2>Find your exam’s image rules.</h2>
            <p>
              Search {examRequirements.length} major Indian exams. Every result
              shows its cycle, evidence level and official source.
            </p>
          </div>
          <div className="research-chip">
            <BadgeCheck size={18} />
            <div>
              <strong>Last researched</strong>
              <span>10 September 2026</span>
            </div>
          </div>
        </div>
        <div className="requirements-tools">
          <div className="exam-search">
            <Search size={18} />
            <label className="sr-only" htmlFor="exam-search">
              Search exams
            </label>
            <Input
              id="exam-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try NEET, SSC, GATE, banking…"
            />
          </div>
          <div className="family-filters" aria-label="Filter exams by category">
            {families.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={family === item}
                onClick={() => setFamily(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="library-summary">
          <span>
            <strong>{filtered.length}</strong> exams shown
          </span>
          <span>
            <i className="status-dot exact" /> Exact bulletin
          </span>
          <span>
            <i className="status-dot guide" /> Authority guide
          </span>
          <span>
            <i className="status-dot check" /> Portal check needed
          </span>
        </div>
        <div className="exam-list">
          {filtered.map((item) => {
            const open = expanded === item.name;
            const tone =
              item.confidence === 'Exact bulletin'
                ? 'exact'
                : item.confidence === 'Authority guide'
                  ? 'guide'
                  : 'check';
            return (
              <article
                key={item.name}
                className={`exam-card ${open ? 'open' : ''}`}
              >
                <button
                  className="exam-card-trigger"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setExpanded(open ? null : item.name)}
                >
                  <span className={`authority-mark ${tone}`}>
                    {item.authority.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="exam-name">
                    <strong>{item.name}</strong>
                    <small>
                      {item.authority} · {item.family}
                    </small>
                  </span>
                  <span className={`confidence ${tone}`}>
                    {item.confidence}
                  </span>
                  <span className="cycle">{item.cycle}</span>
                  <span className="expand-symbol" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="exam-details">
                    <p className="exam-note">{item.note}</p>
                    <div className="asset-grid">
                      {item.assets.map((asset) => (
                        <div className="asset-card" key={asset.name}>
                          <div className="asset-copy">
                            <span>{asset.name}</span>
                            <p>{asset.requirement}</p>
                            {!asset.requirement.includes('PDF') && (
                              <>
                                <div
                                  className={`dimension-meta ${
                                    asset.dimensions ||
                                    dimensionsFor(asset.requirement) !==
                                      'Not stated in the official source'
                                      ? ''
                                      : 'missing'
                                  }`}
                                >
                                  <Ruler size={14} />
                                  <span>Dimensions</span>
                                  <strong>
                                    {asset.dimensions ??
                                      dimensionsFor(asset.requirement)}
                                  </strong>
                                </div>
                                {asset.dimensionNote && (
                                  <small className="dimension-note">
                                    {asset.dimensionNote}
                                  </small>
                                )}
                              </>
                            )}
                          </div>
                          {asset.preset && (
                            <Button
                              variant="outline"
                              onClick={() =>
                                onUsePreset(
                                  asset.preset!,
                                  `${item.name} — ${asset.name}`,
                                  { exam: item.name, asset: asset.name },
                                )
                              }
                            >
                              <SlidersHorizontal size={15} />{' '}
                              {asset.preset.width && asset.preset.height
                                ? `Use ${asset.preset.width}×${asset.preset.height}`
                                : `Use ${asset.preset.maximumKb} KB only`}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <a
                      className="official-link"
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open official source: {item.sourceLabel}
                      <ExternalLink size={14} />
                    </a>
                    {priorityExamNames.includes(
                      item.name as (typeof priorityExamNames)[number],
                    ) && (
                      <a className="exam-guide-link" href={`/exams/${examSlug(item.name)}`}>
                        Read the complete {item.name} size guide
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })}
          {filtered.length === 0 && (
            <div className="no-results">
              <Search size={28} />
              <strong>No matching exam yet</strong>
              <p>
                Try the exam authority or a broader category. Always use the
                active form’s instructions if it is not listed.
              </p>
            </div>
          )}
        </div>
        <p className="library-disclaimer">
          Requirements change between application cycles. “Exact bulletin” means
          the displayed cycle was read from an official source. “Authority
          guide” is a useful starting profile that still requires a
          current-notice check. ApplySahi sets maximum size and dimensions; it
          cannot verify face percentage, document validity or portal acceptance.
        </p>
      </div>
    </section>
  );
}
