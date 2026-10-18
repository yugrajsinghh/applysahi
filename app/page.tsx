'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Download,
  ImagePlus,
  LockKeyhole,
  RotateCw,
  X,
  AlertCircle,
  BookOpenCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { drawFrame, fitImage, type ImageSettings } from '@/lib/image-fit';
import {
  readImageDimensions,
  safeWorkingDimensions,
} from '@/lib/image-metadata';
import { ExamRequirements } from '@/components/exam-requirements';
import type { ExamPreset } from '@/lib/exam-requirements';
import { getExamBySlug } from '@/lib/exam-seo';

type Result = {
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
  fits: boolean;
  maximumKb: number;
  type: string;
};
type DownloadContext = { exam: string; asset: string };
const emptyCrop = { top: 0, right: 0, bottom: 0, left: 0 };
const formats = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};
const MAX_UPLOAD_MB = 25;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
const HEADER_READ_BYTES = 1024 * 1024;
function sizeLabel(size: number) {
  return `${(Math.ceil(size / 10) / 100).toFixed(2)} KB`;
}

function filePart(value: string) {
  return value
    .toUpperCase()
    .replace(/\b20\d{2}\b/g, '')
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function examFilePart(exam: string) {
  if (/^NEET\b/i.test(exam)) return 'NEET';
  return filePart(exam);
}

function assetFilePart(asset: string) {
  if (/photo/i.test(asset)) return 'PHOTO';
  if (/signature/i.test(asset)) return 'SIGNATURE';
  if (/certificate|document|marksheet|pdf/i.test(asset)) return 'DOCS';
  return filePart(asset);
}

function readyFilename(
  type: string,
  context: DownloadContext | null,
  originalName: string,
) {
  const extension =
    type === 'image/jpeg' ? 'JPG' : type.split('/')[1].toUpperCase();
  if (context) {
    return `${examFilePart(context.exam)}_${assetFilePart(context.asset)}_READY.${extension}`;
  }
  const original = filePart(originalName.replace(/\.[^/.]+$/, '')) || 'IMAGE';
  return `${original}_APPLYSAHI_READY.${extension}`;
}

export default function Home() {
  const input = useRef<HTMLInputElement>(null);
  const bitmap = useRef<ImageBitmap | null>(null);
  const generation = useRef(0);
  const preview = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [outputType, setOutputType] = useState('image/jpeg');
  const [target, setTarget] = useState('200');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState(emptyCrop);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(0);
  const [presetLabel, setPresetLabel] = useState('');
  const [downloadContext, setDownloadContext] =
    useState<DownloadContext | null>(null);
  const [optimizationNote, setOptimizationNote] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedExam = getExamBySlug(params.get('exam') ?? '');
    if (!selectedExam) return;
    const assetIndex = Number(params.get('asset') ?? 0);
    const selectedAsset = selectedExam.assets[assetIndex] ?? selectedExam.assets[0];
    if (!selectedAsset?.preset) return;
    const preset = selectedAsset.preset;
    queueMicrotask(() => {
      setOutputType(preset.format === 'PNG' ? 'image/png' : 'image/jpeg');
      setTarget(String(preset.maximumKb));
      setWidth(preset.width ? String(preset.width) : '');
      setHeight(preset.height ? String(preset.height) : '');
      setPresetLabel(`${selectedExam.name} — ${selectedAsset.name}`);
      setDownloadContext({ exam: selectedExam.name, asset: selectedAsset.name });
    });
  }, []);

  function invalidate() {
    generation.current++;
    setResult(null);
    setError('');
    setBusy(false);
  }
  function settings(): ImageSettings {
    return {
      type: outputType,
      maximumKb: Number(target),
      width: width === '' ? undefined : Number(width),
      height: height === '' ? undefined : Number(height),
      rotation,
      crop,
    };
  }
  useEffect(
    () => () => {
      bitmap.current?.close();
      generation.current++;
    },
    [],
  );
  useEffect(
    () => () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    },
    [originalUrl],
  );
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  useEffect(() => {
    if (!bitmap.current || !preview.current) return;
    try {
      const frame = drawFrame(bitmap.current, settings());
      const canvas = preview.current;
      const scale = Math.min(1, 900 / Math.max(frame.width, frame.height));
      canvas.width = Math.max(1, Math.round(frame.width * scale));
      canvas.height = Math.max(1, Math.round(frame.height * scale));
      canvas
        .getContext('2d')
        ?.drawImage(frame, 0, 0, canvas.width, canvas.height);
      frame.width = 0;
      frame.height = 0;
      setPreviewError('');
    } catch (e) {
      setPreviewError(e instanceof Error ? e.message : 'Check your settings.');
    }
  }, [ready, outputType, target, width, height, rotation, crop, result]);

  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: unknown,
            options?: { signal?: AbortSignal },
          ) => unknown;
        };
      }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(
      context.registerTool(
        {
          name: 'configure_image_target',
          title: 'Configure image target',
          description:
            'Set image format and maximum size. The user selects their own image.',
          inputSchema: {
            type: 'object',
            properties: {
              outputFormat: { type: 'string', enum: ['JPG', 'PNG', 'WEBP'] },
              maximumKb: { type: 'number', minimum: 1, maximum: 5120 },
            },
            required: ['outputFormat', 'maximumKb'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute(value: { outputFormat: string; maximumKb: number }) {
            const types: Record<string, string> = {
              JPG: 'image/jpeg',
              PNG: 'image/png',
              WEBP: 'image/webp',
            };
            if (
              !types[value.outputFormat] ||
              !Number.isFinite(value.maximumKb) ||
              value.maximumKb < 1 ||
              value.maximumKb > 5120
            )
              throw new Error('Choose a supported format and 1–5120 KB.');
            invalidate();
            setOutputType(types[value.outputFormat]);
            setTarget(String(value.maximumKb));
            return { configured: true, ...value };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  async function accept(next?: File) {
    if (!next) return;
    invalidate();
    bitmap.current?.close();
    bitmap.current = null;
    setFile(null);
    setOriginalUrl('');
    setOptimizationNote('');
    if (!Object.keys(formats).includes(next.type)) {
      setError(
        'Choose a JPG, PNG or WebP image. PDF and HEIC are not supported yet.',
      );
      return;
    }
    if (next.size > MAX_UPLOAD_BYTES) {
      setError(`Choose an image up to ${MAX_UPLOAD_MB} MB.`);
      return;
    }
    const run = generation.current;
    setBusy(true);
    try {
      const header = await next.slice(0, HEADER_READ_BYTES).arrayBuffer();
      const sourceDimensions = readImageDimensions(header, next.type);
      const working = sourceDimensions
        ? safeWorkingDimensions(sourceDimensions)
        : null;
      const decoded = await createImageBitmap(
        next,
        working?.resized
          ? {
              resizeWidth: working.width,
              resizeHeight: working.height,
              resizeQuality: 'high',
            }
          : undefined,
      );
      if (run !== generation.current) {
        decoded.close();
        return;
      }
      if (decoded.width * decoded.height > 6_000_000) {
        decoded.close();
        throw new Error(
          'This image is too large for safe browser editing. Export a smaller JPG and try again.',
        );
      }
      const thumbnail = document.createElement('canvas');
      const thumbnailScale = Math.min(
        1,
        1200 / Math.max(decoded.width, decoded.height),
      );
      thumbnail.width = Math.max(1, Math.round(decoded.width * thumbnailScale));
      thumbnail.height = Math.max(
        1,
        Math.round(decoded.height * thumbnailScale),
      );
      thumbnail
        .getContext('2d')
        ?.drawImage(decoded, 0, 0, thumbnail.width, thumbnail.height);
      const thumbnailBlob = await new Promise<Blob | null>((resolve) =>
        thumbnail.toBlob(resolve, 'image/jpeg', 0.82),
      );
      thumbnail.width = 0;
      thumbnail.height = 0;
      if (!thumbnailBlob) {
        decoded.close();
        throw new Error('Could not prepare the image preview.');
      }
      if (run !== generation.current) {
        decoded.close();
        return;
      }
      bitmap.current = decoded;
      setFile(next);
      setOriginalUrl(URL.createObjectURL(thumbnailBlob));
      if (working?.resized && sourceDimensions) {
        setOptimizationNote(
          `Large photo optimized from ${sourceDimensions.width} × ${sourceDimensions.height} to ${decoded.width} × ${decoded.height} px for stable editing.`,
        );
      }
      setRotation(0);
      setCrop(emptyCrop);
      setReady((v) => v + 1);
    } catch (e) {
      if (run === generation.current)
        setError(
          e instanceof Error
            ? e.message
            : 'This image could not be opened. Try exporting it as JPG.',
        );
    } finally {
      if (run === generation.current) setBusy(false);
    }
  }

  async function convert() {
    if (!bitmap.current || !file) return;
    invalidate();
    const run = generation.current;
    setBusy(true);
    const selected = settings();
    try {
      const converted = await fitImage(bitmap.current, selected);
      if (run !== generation.current) return;
      setResult({
        url: URL.createObjectURL(converted.blob),
        name: readyFilename(selected.type, downloadContext, file.name),
        size: converted.blob.size,
        width: converted.width,
        height: converted.height,
        fits: converted.fits,
        maximumKb: selected.maximumKb,
        type: selected.type,
      });
    } catch (e) {
      if (run === generation.current)
        setError(
          e instanceof Error ? e.message : 'Could not process this image.',
        );
    } finally {
      if (run === generation.current) setBusy(false);
    }
  }

  function useExamPreset(
    preset: ExamPreset,
    label: string,
    context: DownloadContext,
  ) {
    invalidate();
    setOutputType(preset.format === 'PNG' ? 'image/png' : 'image/jpeg');
    setTarget(String(preset.maximumKb));
    setWidth(preset.width ? String(preset.width) : '');
    setHeight(preset.height ? String(preset.height) : '');
    setPresetLabel(label);
    setDownloadContext(context);
    document
      .querySelector('#editor')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main>
      <a className="skip-link" href="#editor">
        Skip to photo tool
      </a>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" aria-label="ApplySahi home">
            <span>
              <ArrowDown size={21} />
            </span>
            ApplySahi
          </a>
          <nav aria-label="Main navigation">
            <a href="#editor">Resize now</a>
            <a href="#requirements">Exam sizes</a>
            <a href="#guide">How to use</a>
            <span className="free-label">Free · No sign-up</span>
          </nav>
        </div>
      </header>
      <section className="shell intro">
        <div className="intro-copy">
          <p className="eyebrow">
            <Zap size={14} /> FAST, PRIVATE & EXAM-READY
          </p>
          <h1>
            Right size <span>matters.</span>
          </h1>
          <p>
            Resize your photo or signature for your exam. Free and private.
          </p>
          <div className="hero-actions">
            <a className="secondary-link exam-link" href="#requirements">
              Find my exam size <ArrowDown size={17} />
            </a>
            <a className="primary-link" href="#editor">
              Resize my image <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <div className="hero-proof">
          <div>
            <strong>56</strong>
            <span>major exams researched</span>
          </div>
          <div>
            <strong>0</strong>
            <span>images uploaded</span>
          </div>
          <div>
            <strong>₹0</strong>
            <span>to use</span>
          </div>
        </div>
      </section>
      <section
        id="editor"
        className="shell editor"
        aria-label="Photo and signature editor"
      >
        <div className="workspace-heading">
          <h2>Prepare your image</h2>
          <span>
            <LockKeyhole size={14} /> Files stay on your device
          </span>
        </div>
        <div className="editor-grid">
          <div className="controls">
            {presetLabel && (
              <div className="preset-banner">
                <BookOpenCheck size={18} />
                <div>
                  <strong>{presetLabel}</strong>
                  <span>
                    Official-source settings applied. Check the cycle and final
                    portal before submitting.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPresetLabel('');
                    setDownloadContext(null);
                  }}
                  aria-label="Dismiss selected exam"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <h3>
              <span className="step">1</span> Choose your photo or signature
            </h3>
            <input
              ref={input}
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label="Choose image"
              onChange={(e) => {
                void accept(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <div
              className={`drop-area ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                void accept(e.dataTransfer.files[0]);
              }}
            >
              {file ? (
                <div className="file-row">
                  <img src={originalUrl} alt="Selected image thumbnail" />
                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {sizeLabel(file.size)} · {bitmap.current?.width} ×{' '}
                      {bitmap.current?.height} px
                    </small>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove image"
                    disabled={busy}
                    onClick={() => {
                      invalidate();
                      bitmap.current?.close();
                      bitmap.current = null;
                      setFile(null);
                      setOriginalUrl('');
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <>
                  <ImagePlus size={28} />
                  <Button
                    onClick={() => input.current?.click()}
                    disabled={busy}
                  >
                    {busy ? 'Opening image…' : 'Choose image'}
                    {!busy && <ArrowRight size={16} />}
                  </Button>
                  <small>
                    {busy
                      ? 'Large photos may take a few seconds. Keep this page open.'
                      : `or drop it here · JPG, PNG, WebP · up to ${MAX_UPLOAD_MB} MB`}
                  </small>
                </>
              )}
            </div>
            {error && (
              <p role="alert" className="error-message">
                <AlertCircle size={18} />
                {error}
              </p>
            )}
            {optimizationNote && (
              <p className="optimization-note">
                <Check size={17} /> {optimizationNote}
              </p>
            )}
            <fieldset disabled={busy}>
              <h3>
                <span className="step">2</span> Enter your form’s requirements
              </h3>
              <div className="presets" aria-label="Common maximum file sizes">
                {[20, 50, 100, 200].map((kb) => (
                  <Button
                    key={kb}
                    variant="outline"
                    aria-pressed={target === String(kb)}
                    onClick={() => {
                      invalidate();
                      setPresetLabel('');
                      setTarget(String(kb));
                    }}
                  >
                    {kb} KB
                  </Button>
                ))}
              </div>
              <div className="field-grid">
                <label htmlFor="maximum">
                  Maximum file size (KB)
                  <Input
                    id="maximum"
                    type="number"
                    min="1"
                    max="5120"
                    step="1"
                    value={target}
                    onChange={(e) => {
                      invalidate();
                      setPresetLabel('');
                      setTarget(e.target.value);
                    }}
                  />
                </label>
                <div>
                  <label id="format-label">File format</label>
                  <Select
                    value={outputType}
                    onValueChange={(v) => {
                      if (v) {
                        invalidate();
                        setPresetLabel('');
                        setOutputType(v);
                      }
                    }}
                  >
                    <SelectTrigger
                      aria-labelledby="format-label"
                      className="format-trigger"
                    >
                      <SelectValue>
                        {formats[outputType as keyof typeof formats]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(formats).map(([value, name]) => (
                        <SelectItem key={value} value={value}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="field-grid">
                <label htmlFor="width">
                  Width (pixels)
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="4096"
                    placeholder="Keep original"
                    value={width}
                    onChange={(e) => {
                      invalidate();
                      setPresetLabel('');
                      setWidth(e.target.value);
                    }}
                  />
                </label>
                <label htmlFor="height">
                  Height (pixels)
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    max="4096"
                    placeholder="Keep original"
                    value={height}
                    onChange={(e) => {
                      invalidate();
                      setPresetLabel('');
                      setHeight(e.target.value);
                    }}
                  />
                </label>
              </div>
              <p className="helper">
                Dimensions optional: enter both or leave both blank. Exact
                dimensions keep the full crop, adding white space if needed. 1
                KB = 1,000 bytes.
              </p>
              {file && (
                <details className="crop-panel">
                  <summary>Crop edges & rotate</summary>
                  <p className="helper">
                    Trim blank space around your signature. Check the preview as
                    you adjust.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      invalidate();
                      setRotation((rotation + 90) % 360);
                    }}
                  >
                    <RotateCw size={16} /> Rotate 90°
                  </Button>
                  <div className="crop-sliders">
                    {(['top', 'right', 'bottom', 'left'] as const).map(
                      (edge) => (
                        <div key={edge}>
                          <label id={`crop-${edge}`}>
                            {edge[0].toUpperCase() + edge.slice(1)} crop{' '}
                            <span>{crop[edge]}%</span>
                          </label>
                          <Slider
                            aria-labelledby={`crop-${edge}`}
                            min={0}
                            max={90}
                            step={1}
                            value={[crop[edge]]}
                            onValueChange={(v) => {
                              const value = Array.isArray(v) ? v[0] : v;
                              invalidate();
                              setCrop((c) => ({ ...c, [edge]: value }));
                            }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      invalidate();
                      setCrop(emptyCrop);
                      setRotation(0);
                    }}
                  >
                    Reset crop & rotation
                  </Button>
                </details>
              )}
            </fieldset>
            <Button
              className="fit-button"
              onClick={convert}
              disabled={!file || busy || Boolean(previewError)}
            >
              {busy ? 'Processing your image…' : 'Resize & check image'}
              {!busy && <ArrowRight size={18} />}
            </Button>
            <p className="helper">
              No watermark. No account. Check the official form for its current
              requirements.
            </p>
          </div>
          <aside
            className="preview-panel"
            aria-label="Image preview and result"
          >
            <div className="preview-title">
              <h3>
                <span className="step">3</span> Preview & download
              </h3>
              <span>{result ? 'EXPORTED IMAGE' : 'CROP PREVIEW'}</span>
            </div>
            <div className="preview-stage">
              {!file ? (
                <div className="empty-preview">
                  <ImagePlus size={42} />
                  <strong>Your preview appears here</strong>
                  <p>
                    You’ll see the image, its size and its dimensions before
                    downloading.
                  </p>
                </div>
              ) : result ? (
                <img
                  src={result.url}
                  alt="Exported image; check clarity before downloading"
                />
              ) : (
                <canvas
                  ref={preview}
                  aria-label="Preview of your crop and dimensions"
                  role="img"
                  style={{ visibility: previewError ? 'hidden' : 'visible' }}
                />
              )}
            </div>
            {previewError && file && (
              <p role="alert" className="error-message">
                {previewError}
              </p>
            )}
            <div aria-live="polite" aria-atomic="true">
              {result ? (
                <div className={`result ${result.fits ? 'success' : 'unmet'}`}>
                  <h4>
                    {result.fits ? (
                      <Check size={19} />
                    ) : (
                      <AlertCircle size={19} />
                    )}{' '}
                    {result.fits
                      ? 'Your size target is met'
                      : 'This result is above your limit'}
                  </h4>
                  <dl>
                    <div>
                      <dt>File size</dt>
                      <dd>
                        {sizeLabel(result.size)} / {result.maximumKb} KB
                      </dd>
                    </div>
                    <div>
                      <dt>Dimensions</dt>
                      <dd>
                        {result.width} × {result.height} px
                      </dd>
                    </div>
                    <div>
                      <dt>Format</dt>
                      <dd>{formats[result.type as keyof typeof formats]}</dd>
                    </div>
                  </dl>
                  <p>
                    {result.fits
                      ? 'Check that the face or signature is clear. These checks do not guarantee a portal will accept the image.'
                      : 'Try JPG, crop more blank space, or change the requirements only if your form allows it. Exact dimensions are never reduced automatically.'}
                  </p>
                  <div className="result-filename">
                    <span>Your download will be saved as</span>
                    <strong>{result.name}</strong>
                  </div>
                  <Button
                    className="download-button"
                    nativeButton={false}
                    render={<a href={result.url} download={result.name} />}
                  >
                    <Download size={18} />
                    {result.fits
                      ? 'Download image'
                      : 'Download above-limit image'}
                  </Button>
                </div>
              ) : (
                <div className="preview-note">
                  <strong>What we check</strong>
                  <p>
                    Maximum file size, output format and image dimensions. You
                    check readability and your form’s other rules.
                  </p>
                  <small>
                    Without fixed dimensions, compression may reduce pixel size.
                    JPG exports use a white background.
                  </small>
                </div>
              )}
            </div>
            {file && result && (
              <details className="original-comparison">
                <summary>Compare with original</summary>
                <img src={originalUrl} alt="Original image for comparison" />
              </details>
            )}
          </aside>
        </div>
      </section>
      <ExamRequirements onUsePreset={useExamPreset} />
      <section id="guide" className="shell guide">
        <div>
          <p className="eyebrow">A LITTLE HELP</p>
          <h2>
            File size and photo size
            <br />
            are different things.
          </h2>
          <p>
            KB measures how much data is in your image. Pixels measure its width
            and height. A form can require both, so check both before
            submitting.
          </p>
        </div>
        <div className="questions">
          <details open>
            <summary>How do I make a signature under 20 KB?</summary>
            <p>
              Choose your signature, select 20 KB and JPG, then crop unnecessary
              blank space. Add exact dimensions only if your form specifies
              them. Resize, check the writing is readable and download.
            </p>
          </details>
          <details>
            <summary>Why does PNG sometimes miss my target?</summary>
            <p>
              PNG does not respond to a photo-quality slider like JPG does. Try
              JPG for photos and signatures on white paper. If dimensions are
              fixed, ApplySahi reports a missed size target instead of silently
              making the image smaller.
            </p>
          </details>
          <details>
            <summary>
              Will this guarantee that my application is accepted?
            </summary>
            <p>
              No. ApplySahi checks the requirements you enter. Your form may also
              require a particular background, face position, recent photograph,
              minimum file size or live capture. Check the official
              instructions.
            </p>
          </details>
          <details>
            <summary>Can I use PDFs or iPhone HEIC photos?</summary>
            <p>
              This version supports JPG, PNG and WebP images. Export HEIC as JPG
              first. PDF tools are planned but are not available in this editor.
            </p>
          </details>
        </div>
      </section>
      <section id="privacy" className="privacy-strip">
        <div className="shell">
          <LockKeyhole size={22} />
          <div>
            <h2>Your files stay with you.</h2>
            <p>
              The image editor processes files in this browser. It does not
              upload or save your image to our servers. Downloads remain on your
              device; clear them yourself when using a shared computer.
            </p>
          </div>
        </div>
      </section>
      <footer className="shell footer">
        <a className="brand" href="/">
          ApplySahi
        </a>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <a href="#editor">Back to editor ↑</a>
      </footer>
      <div className="brand-stamp-row">
        <span className="brand-stamp" aria-label="YRSC brand stamp">YRSC</span>
      </div>
    </main>
  );
}
