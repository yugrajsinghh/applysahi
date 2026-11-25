'use client';

import { useRef, useState } from 'react';
import { Download, ImageDown, Upload } from 'lucide-react';
import { fitImage } from '@/lib/image-fit';

type Result = { url: string; size: number; width: number; height: number; fits: boolean };

export function ImageCompressor() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('100');
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function chooseFile(next: File | null) {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setError('');
    setFile(next);
  }

  async function compress() {
    if (!file) return;
    const maximumKb = Number(target);
    if (!Number.isFinite(maximumKb) || maximumKb < 5 || maximumKb > 5120) {
      setError('Choose a target between 5 KB and 5120 KB.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const bitmap = await createImageBitmap(file);
      const output = await fitImage(bitmap, {
        type: format,
        maximumKb,
        rotation: 0,
        crop: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      bitmap.close();
      if (result) URL.revokeObjectURL(result.url);
      setResult({ ...output, url: URL.createObjectURL(output.blob), size: output.blob.size });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'This image could not be compressed.');
    } finally {
      setBusy(false);
    }
  }

  const extension = format === 'image/png' ? 'png' : 'jpg';
  return (
    <div className="simple-tool compressor-tool">
      <input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} />
      <button className="drop-card" type="button" onClick={() => input.current?.click()}>
        {file ? <ImageDown size={34} /> : <Upload size={34} />}
        <strong>{file ? file.name : 'Choose a JPG, PNG or WebP image'}</strong>
        <span>{file ? `${(file.size / 1024).toFixed(1)} KB original` : 'Up to 25 MB · processed on your device'}</span>
      </button>
      <div className="converter-options">
        <label><span>Maximum file size</span><div className="unit-input"><input inputMode="numeric" value={target} onChange={(event) => setTarget(event.target.value)} /><b>KB</b></div></label>
        <label><span>Download format</span><select value={format} onChange={(event) => setFormat(event.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
      </div>
      <button className="tool-action" disabled={!file || busy} onClick={() => void compress()}>{busy ? 'Compressing…' : <><ImageDown size={18} /> Compress image</>}</button>
      {error && <p className="tool-error" role="alert">{error}</p>}
      {result && <div className={`conversion-result ${result.fits ? 'success' : 'warning'}`}><div><strong>{result.fits ? 'Ready to download' : 'Closest safe result'}</strong><span>{(result.size / 1024).toFixed(1)} KB · {result.width}×{result.height} px</span></div><a href={result.url} download={`HATEEXAM_COMPRESSED.${extension}`} onClick={() => window.dispatchEvent(new Event('hateexam:file-completed'))}><Download size={18} /> Download {extension.toUpperCase()}</a></div>}
    </div>
  );
}
