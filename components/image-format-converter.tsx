'use client';

import { useRef, useState } from 'react';
import { Download, RefreshCw, Upload } from 'lucide-react';

export function ImageFormatConverter() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('92');
  const [background, setBackground] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not prepare this image.');
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', Number(quality) / 100));
      canvas.width = 0;
      canvas.height = 0;
      if (!blob) throw new Error('This image could not be converted.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.[^.]+$/, '')}_HATEEXAM.jpg`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      window.dispatchEvent(new Event('hateexam:file-completed'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'This image could not be converted.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="simple-tool converter-tool">
    <input ref={input} hidden type="file" accept="image/png,image/webp" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError(''); }} />
    <button className="drop-card" type="button" onClick={() => input.current?.click()}><Upload size={34}/><strong>{file ? file.name : 'Choose a PNG or WebP image'}</strong><span>{file ? `${(file.size / 1024).toFixed(1)} KB` : 'Transparency is placed on your chosen background'}</span></button>
    <div className="converter-options">
      <label><span>JPG quality</span><div className="unit-input"><input type="number" min="40" max="100" value={quality} onChange={(event) => setQuality(event.target.value)} /><b>%</b></div></label>
      <label><span>Background</span><div className="color-input"><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /><b>{background.toUpperCase()}</b></div></label>
    </div>
    <button className="tool-action" disabled={!file || busy} onClick={() => void convert()}>{busy ? 'Converting…' : <><RefreshCw size={18}/> Convert and download JPG</>}</button>
    {error && <p className="tool-error" role="alert">{error}</p>}
    {file && !error && <p className="privacy-inline"><Download size={15}/> Output keeps the original pixel dimensions.</p>}
  </div>;
}
