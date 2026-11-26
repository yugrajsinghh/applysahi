'use client';

/* oxlint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react';
import {
  Download,
  ImagePlus,
  LockKeyhole,
  Printer,
  RefreshCw,
} from 'lucide-react';

const presets = {
  passport: { label: 'Passport 3.5 × 4.5', width: 413, height: 531 },
  ssc: { label: 'SSC-style 200 × 230', width: 200, height: 230 },
  square: { label: 'Square 400 × 400', width: 400, height: 400 },
} as const;

type PresetKey = keyof typeof presets;

function downloadCanvas(
  canvas: HTMLCanvasElement,
  name: string,
  quality = 0.9,
) {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      window.dispatchEvent(new Event('hateexam:file-completed'));
    },
    'image/jpeg',
    quality,
  );
}

export function ExamPhotoStudio() {
  const input = useRef<HTMLInputElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<PresetKey>('passport');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [position, setPosition] = useState(50);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => bitmap.current?.close(), []);

  function renderPhoto(target: HTMLCanvasElement, sheet = false) {
    if (!bitmap.current) throw new Error('Choose a photograph first.');
    const spec = presets[preset];
    const strip =
      name.trim() || date ? Math.max(54, Math.round(spec.height * 0.14)) : 0;
    const photoHeight = spec.height - strip;
    const source = bitmap.current;
    const sourceRatio = source.width / source.height;
    const targetRatio = spec.width / photoHeight;
    let sw = source.width;
    let sh = source.height;
    if (sourceRatio > targetRatio) sw = sh * targetRatio;
    else sh = sw / targetRatio;
    const sx = (source.width - sw) / 2;
    const availableY = source.height - sh;
    const sy = availableY * (position / 100);

    if (!sheet) {
      target.width = spec.width;
      target.height = spec.height;
      const ctx = target.getContext('2d');
      if (!ctx)
        throw new Error('Your browser could not prepare this photograph.');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.drawImage(source, sx, sy, sw, sh, 0, 0, spec.width, photoHeight);
      if (strip) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, photoHeight, spec.width, strip);
        ctx.strokeStyle = '#d1d5db';
        ctx.beginPath();
        ctx.moveTo(0, photoHeight + 0.5);
        ctx.lineTo(spec.width, photoHeight + 0.5);
        ctx.stroke();
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.font = `700 ${Math.max(16, Math.round(spec.width * 0.045))}px Arial`;
        if (name.trim() && date) {
          ctx.fillText(
            name.trim().toUpperCase(),
            spec.width / 2,
            photoHeight + strip * 0.44,
          );
          ctx.font = `500 ${Math.max(14, Math.round(spec.width * 0.038))}px Arial`;
          ctx.fillText(date, spec.width / 2, photoHeight + strip * 0.78);
        } else {
          ctx.fillText(
            (name.trim() || date).toUpperCase(),
            spec.width / 2,
            photoHeight + strip * 0.62,
          );
        }
      }
      return;
    }

    const photo = document.createElement('canvas');
    renderPhoto(photo, false);
    const cellWidth = 413;
    const cellHeight = 531;
    const margin = 48;
    const gap = 30;
    target.width = margin * 2 + cellWidth * 3 + gap * 2;
    target.height = margin * 2 + cellHeight * 2 + gap;
    const ctx = target.getContext('2d');
    if (!ctx)
      throw new Error('Your browser could not prepare the photo sheet.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, target.width, target.height);
    for (let row = 0; row < 2; row++)
      for (let column = 0; column < 3; column++) {
        const x = margin + column * (cellWidth + gap);
        const y = margin + row * (cellHeight + gap);
        ctx.drawImage(photo, x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    photo.width = 0;
    photo.height = 0;
  }

  // The canvas preview is redrawn whenever a studio control changes.
  useEffect(() => {
    if (!preview.current || !bitmap.current) return;
    renderPhoto(preview.current);
  }, [preset, name, date, position, file]);

  async function choose(next: File | null) {
    if (!next) return;
    setBusy(true);
    setError('');
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type))
        throw new Error('Choose a JPG, PNG or WebP photograph.');
      const nextBitmap = await createImageBitmap(next);
      bitmap.current?.close();
      bitmap.current = nextBitmap;
      setFile(next);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'This photograph could not be opened.',
      );
    } finally {
      setBusy(false);
    }
  }

  function downloadPhoto() {
    const canvas = document.createElement('canvas');
    renderPhoto(canvas);
    downloadCanvas(canvas, 'HATEEXAM_PHOTO_STUDIO_READY.jpg');
  }

  function downloadSheet() {
    const canvas = document.createElement('canvas');
    renderPhoto(canvas, true);
    downloadCanvas(canvas, 'HATEEXAM_6_PHOTO_SHEET.jpg', 0.94);
  }

  return (
    <div className="photo-studio simple-tool">
      <input
        ref={input}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => void choose(event.target.files?.[0] ?? null)}
      />
      <div className="studio-grid">
        <div className="studio-controls">
          <button
            className="drop-card studio-drop"
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
          >
            <ImagePlus size={31} />
            <strong>
              {file ? file.name : 'Choose a clear front-facing photo'}
            </strong>
            <span>JPG, PNG or WebP · stays on your device</span>
          </button>
          <label>
            <span>Photo preset</span>
            <select
              value={preset}
              onChange={(event) => setPreset(event.target.value as PresetKey)}
            >
              {Object.entries(presets).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Candidate name (optional)</span>
            <input
              value={name}
              maxLength={40}
              placeholder="Your name"
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            <span>Photo date (optional)</span>
            <input
              value={date}
              maxLength={20}
              placeholder="DD/MM/YYYY"
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            <span>Move photo vertically</span>
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
            />
          </label>
          <button
            className="tool-secondary"
            type="button"
            onClick={() => {
              setName('');
              setDate('');
              setPosition(50);
            }}
          >
            <RefreshCw size={16} /> Reset studio settings
          </button>
        </div>
        <div className="studio-preview">
          <canvas ref={preview} />
          {!file && (
            <div>
              <ImagePlus size={30} />
              <strong>Your exam photo preview</strong>
              <span>Choose a photo to begin</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <p className="tool-error" role="alert">
          {error}
        </p>
      )}
      <div className="studio-actions">
        <button
          className="tool-action"
          disabled={!file}
          onClick={downloadPhoto}
        >
          <Download size={18} /> Download photo
        </button>
        <button
          className="tool-action red"
          disabled={!file}
          onClick={downloadSheet}
        >
          <Printer size={18} /> Download 6-photo sheet
        </button>
      </div>
      <p className="privacy-inline">
        <LockKeyhole size={15} /> This tool frames and labels your photo; it
        does not automatically remove or replace its background.
      </p>
    </div>
  );
}
