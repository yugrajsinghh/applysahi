'use client';

import { useRef, useState } from 'react';
import { Download, FileDown, LockKeyhole, Upload } from 'lucide-react';

type Result = { url: string; size: number; pages: number; fits: boolean };

export function PdfCompressor() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('500');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function choose(next: File | null) {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setError('');
    setFile(next);
  }

  async function compress() {
    if (!file) return;
    const targetKb = Number(target);
    if (!Number.isFinite(targetKb) || targetKb < 100 || targetKb > 10240) {
      setError('Choose a target from 100 KB to 10,240 KB.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const pdfjs = await import('pdfjs-dist');
      await import('pdfjs-dist/build/pdf.worker.mjs');
      const source = await pdfjs.getDocument({ data: await file.arrayBuffer() })
        .promise;
      const pageCount = source.numPages;
      if (pageCount > 30)
        throw new Error('For browser safety, compress up to 30 pages at once.');
      const { PDFDocument } = await import('pdf-lib');
      const output = await PDFDocument.create();
      const targetPerPage = Math.max(
        12_000,
        (targetKb * 1000 - 8000) / pageCount,
      );
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
        const page = await source.getPage(pageNumber);
        const base = page.getViewport({ scale: 1 });
        let scale = Math.min(1.45, 1600 / Math.max(base.width, base.height));
        let blob: Blob | null = null;
        let viewport = page.getViewport({ scale });
        for (let attempt = 0; attempt < 5; attempt++) {
          viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(viewport.width));
          canvas.height = Math.max(1, Math.round(viewport.height));
          const context = canvas.getContext('2d', { alpha: false });
          if (!context)
            throw new Error('Your browser could not render this PDF.');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: context, viewport, canvas })
            .promise;
          blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(
              resolve,
              'image/jpeg',
              Math.max(0.34, 0.78 - attempt * 0.1),
            ),
          );
          canvas.width = 0;
          canvas.height = 0;
          if (blob && blob.size <= targetPerPage) break;
          scale *= 0.78;
        }
        if (!blob) throw new Error('A PDF page could not be compressed.');
        const image = await output.embedJpg(await blob.arrayBuffer());
        const pdfPage = output.addPage([base.width, base.height]);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: base.width,
          height: base.height,
        });
        page.cleanup();
      }
      const bytes = await output.save({ useObjectStreams: true });
      await source.cleanup();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        pages: pageCount,
        fits: blob.size <= targetKb * 1000,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'This PDF could not be compressed.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="simple-tool pdf-compressor">
      <input
        ref={input}
        hidden
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => choose(event.target.files?.[0] ?? null)}
      />
      <button
        className="drop-card"
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
      >
        {file ? <FileDown size={34} /> : <Upload size={34} />}
        <strong>{file ? file.name : 'Choose a scanned PDF'}</strong>
        <span>
          {file
            ? `${(file.size / 1024).toFixed(0)} KB original`
            : 'Up to 30 pages · processed on your device'}
        </span>
      </button>
      <label className="compress-target">
        <span>Maximum target size</span>
        <div className="unit-input">
          <input
            inputMode="numeric"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          />
          <b>KB</b>
        </div>
      </label>
      <button
        className="tool-action"
        disabled={!file || busy}
        onClick={() => void compress()}
      >
        {busy ? (
          'Compressing pages…'
        ) : (
          <>
            <FileDown size={18} /> Compress PDF
          </>
        )}
      </button>
      {error && (
        <p className="tool-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div
          className={`conversion-result ${result.fits ? 'success' : 'warning'}`}
        >
          <div>
            <strong>
              {result.fits ? 'Target reached' : 'Smallest safe result created'}
            </strong>
            <span>
              {(result.size / 1024).toFixed(0)} KB · {result.pages} pages
            </span>
          </div>
          <a
            href={result.url}
            download="HATEEXAM_COMPRESSED_READY.pdf"
            onClick={() =>
              window.dispatchEvent(new Event('hateexam:file-completed'))
            }
          >
            <Download size={18} /> Download PDF
          </a>
        </div>
      )}
      <p className="privacy-inline">
        <LockKeyhole size={15} /> Compression rasterizes each page. Best for
        scanned forms, marksheets and certificates—not PDFs that need selectable
        text.
      </p>
    </div>
  );
}
