'use client';

import { useRef, useState } from 'react';
import { Download, FileImage, LockKeyhole, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageMode = 'a4' | 'fit';

const MAX_FILES = 12;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const A4_PORTRAIT: [number, number] = [595.28, 841.89];

function cleanPdfName(value: string) {
  const cleaned = value
    .trim()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9-_ ]/gi, '')
    .replace(/\s+/g, '_');
  return `${cleaned || 'HATEEXAM_DOCUMENT'}_READY.pdf`;
}

async function imageAsJpeg(file: File) {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, 2400 / longest);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('Your browser could not prepare this image.');
  }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9),
  );
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error('This image could not be converted.');
  return { bytes: await blob.arrayBuffer(), width, height };
}

export function ImageToPdf() {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>('a4');
  const [filename, setFilename] = useState('HATEEXAM_DOCUMENT');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function addFiles(selected: FileList | null) {
    if (!selected) return;
    setError('');
    const valid = Array.from(selected).filter((file) => {
      return (
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
        file.size <= MAX_FILE_BYTES
      );
    });
    const next = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(next);
    if (valid.length !== selected.length) {
      setError('Some files were skipped. Use JPG, PNG or WebP under 15 MB each.');
    } else if (files.length + valid.length > MAX_FILES) {
      setError(`You can combine up to ${MAX_FILES} images at once.`);
    }
  }

  async function makePdf() {
    if (!files.length) return;
    setBusy(true);
    setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDocument = await PDFDocument.create();
      pdfDocument.setCreator('HateExam Version 7');
      pdfDocument.setProducer('HateExam browser PDF tool');

      for (const file of files) {
        const converted = await imageAsJpeg(file);
        const image = await pdfDocument.embedJpg(converted.bytes);
        const landscape = converted.width > converted.height;
        const a4Size: [number, number] = landscape
          ? [A4_PORTRAIT[1], A4_PORTRAIT[0]]
          : A4_PORTRAIT;
        const fitWidth = Math.min(1440, converted.width * 0.75);
        const fitHeight = Math.min(1440, converted.height * 0.75);
        const pageSize: [number, number] =
          pageMode === 'a4' ? a4Size : [fitWidth, fitHeight];
        const page = pdfDocument.addPage(pageSize);
        const margin = pageMode === 'a4' ? 28 : 0;
        const availableWidth = pageSize[0] - margin * 2;
        const availableHeight = pageSize[1] - margin * 2;
        const imageScale = Math.min(
          availableWidth / converted.width,
          availableHeight / converted.height,
        );
        const drawWidth = converted.width * imageScale;
        const drawHeight = converted.height * imageScale;
        page.drawImage(image, {
          x: (pageSize[0] - drawWidth) / 2,
          y: (pageSize[1] - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const bytes = await pdfDocument.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = cleanPdfName(filename);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      window.dispatchEvent(new Event('hateexam:file-completed'));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'The PDF could not be created. Try fewer or smaller images.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="image-to-pdf" className="pdf-tool-section">
      <div className="shell pdf-tool">
        <div className="pdf-tool-intro">
          <p className="eyebrow">NEW IN VERSION 7</p>
          <h2>Images to PDF</h2>
          <p>
            Combine application documents, certificates or photographs into one
            PDF. Nothing is uploaded and no account is required.
          </p>
          <span className="pdf-privacy-note">
            <LockKeyhole size={15} /> Created privately in your browser
          </span>
        </div>
        <div className="pdf-builder">
          <input
            ref={input}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = '';
            }}
          />
          <div className="pdf-builder-heading">
            <div>
              <strong>{files.length || 'No'} image{files.length === 1 ? '' : 's'} selected</strong>
              <small>Pages follow your selection order · maximum {MAX_FILES}</small>
            </div>
            <Button variant="outline" onClick={() => input.current?.click()} disabled={busy}>
              <Plus size={17} /> Add images
            </Button>
          </div>

          {files.length ? (
            <ol className="pdf-file-list">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.lastModified}-${index}`}>
                  <FileImage size={18} />
                  <span>
                    <strong>{index + 1}. {file.name}</strong>
                    <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => setFiles(files.filter((_, item) => item !== index))}
                    disabled={busy}
                  >
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <button className="pdf-empty" type="button" onClick={() => input.current?.click()}>
              <FileImage size={28} />
              <strong>Choose JPG, PNG or WebP images</strong>
              <small>Each image becomes one PDF page</small>
            </button>
          )}

          <div className="pdf-options">
            <label>
              PDF filename
              <input value={filename} onChange={(event) => setFilename(event.target.value)} maxLength={60} />
            </label>
            <fieldset>
              <legend>Page size</legend>
              <label>
                <input type="radio" name="page-size" checked={pageMode === 'a4'} onChange={() => setPageMode('a4')} />
                A4
              </label>
              <label>
                <input type="radio" name="page-size" checked={pageMode === 'fit'} onChange={() => setPageMode('fit')} />
                Fit image
              </label>
            </fieldset>
          </div>
          {error && <p className="pdf-error" role="alert">{error}</p>}
          <Button className="pdf-download" onClick={() => void makePdf()} disabled={!files.length || busy}>
            <Download size={18} /> {busy ? 'Creating PDF…' : 'Create and download PDF'}
          </Button>
          <small className="pdf-disclaimer">Check page order and readability before uploading the PDF to an official portal.</small>
        </div>
      </div>
    </section>
  );
}
