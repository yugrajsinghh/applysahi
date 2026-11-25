'use client';

import { useState } from 'react';
import { CheckCircle2, FileCheck2, ShieldAlert, Upload } from 'lucide-react';
import { examRequirements } from '@/lib/exam-requirements';

type CheckResult = { label: string; ok: boolean; detail: string };

function sizeRange(requirement: string) {
  const range = requirement.match(/(\d+)\s*[–-]\s*(\d+)\s*KB/i);
  if (range) return { minimum: Number(range[1]), maximum: Number(range[2]) };
  const maximum = requirement.match(/(?:under|maximum|max)\s*(\d+)\s*KB/i);
  return maximum ? { maximum: Number(maximum[1]) } : undefined;
}

function allowedFormats(requirement: string) {
  const formats = ['JPG', 'JPEG', 'PNG', 'PDF'].filter((format) =>
    requirement.toUpperCase().includes(format),
  );
  return [...new Set(formats.map((format) => (format === 'JPEG' ? 'JPG' : format)))];
}

function fileFormat(file: File) {
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type === 'image/png') return 'PNG';
  if (file.type === 'image/jpeg') return 'JPG';
  return file.name.split('.').pop()?.toUpperCase() ?? 'UNKNOWN';
}

export function ExamFileChecker() {
  const [examName, setExamName] = useState(examRequirements[0]?.name ?? '');
  const exam = examRequirements.find((item) => item.name === examName)!;
  const [assetName, setAssetName] = useState(exam?.assets[0]?.name ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
  const asset = exam?.assets.find((item) => item.name === assetName) ?? exam?.assets[0];

  const results: CheckResult[] = (() => {
    if (!file || !asset) return [];
    const checks: CheckResult[] = [];
    const kb = file.size / 1024;
    const range = sizeRange(asset.requirement);
    const formats = allowedFormats(asset.requirement);
    if (formats.length) {
      const actual = fileFormat(file);
      checks.push({
        label: 'File format',
        ok: formats.includes(actual),
        detail: `${actual} file · expected ${formats.join(' or ')}`,
      });
    }
    if (range) {
      const ok = kb <= range.maximum && (!range.minimum || kb >= range.minimum);
      checks.push({
        label: 'File size',
        ok,
        detail: `${kb.toFixed(1)} KB · expected ${range.minimum ? `${range.minimum}–` : 'up to '}${range.maximum} KB`,
      });
    }
    if (asset.preset?.width && asset.preset.height && dimensions) {
      checks.push({
        label: 'Dimensions',
        ok:
          dimensions.width === asset.preset.width &&
          dimensions.height === asset.preset.height,
        detail: `${dimensions.width}×${dimensions.height} px · expected ${asset.preset.width}×${asset.preset.height} px`,
      });
    }
    return checks;
  })();

  function chooseExam(name: string) {
    const next = examRequirements.find((item) => item.name === name)!;
    setExamName(name);
    setAssetName(next.assets[0]?.name ?? '');
    setFile(null);
    setDimensions(undefined);
  }

  function chooseFile(next: File | null) {
    setFile(next);
    setDimensions(undefined);
    if (!next || !next.type.startsWith('image/')) return;
    const url = URL.createObjectURL(next);
    const image = new Image();
    image.onload = () => {
      setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  const passed = results.length > 0 && results.every((result) => result.ok);

  return (
    <div className="readiness-checker">
      <div className="checker-fields">
        <label>
          <span>Exam</span>
          <select value={examName} onChange={(event) => chooseExam(event.target.value)}>
            {examRequirements.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Document type</span>
          <select value={asset?.name ?? ''} onChange={(event) => { setAssetName(event.target.value); setFile(null); setDimensions(undefined); }}>
            {exam.assets.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="checker-rule">
        <FileCheck2 size={22} />
        <div><strong>Published requirement</strong><p>{asset?.requirement}</p></div>
      </div>
      <label className="checker-upload">
        <Upload size={30} />
        <strong>{file ? file.name : 'Choose the file you plan to upload'}</strong>
        <span>Checked privately in your browser—nothing is uploaded</span>
        <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} />
      </label>
      {file && (
        <div className={`checker-result ${passed ? 'pass' : 'warning'}`}>
          <div className="checker-verdict">
            {passed ? <CheckCircle2 size={26} /> : <ShieldAlert size={26} />}
            <div>
              <strong>{passed ? 'File checks passed' : 'File needs attention'}</strong>
              <span>Always confirm the final acceptance inside the official application portal.</span>
            </div>
          </div>
          {results.length ? results.map((result) => (
            <div className="checker-row" key={result.label}>
              <span>{result.ok ? '✓' : '!'}</span><strong>{result.label}</strong><p>{result.detail}</p>
            </div>
          )) : <p>This official entry has no machine-checkable limits. Follow its written requirement and current portal.</p>}
        </div>
      )}
    </div>
  );
}
