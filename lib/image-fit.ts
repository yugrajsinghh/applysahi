export type ImageSettings = {
  type: string;
  maximumKb: number;
  width?: number;
  height?: number;
  rotation: number;
  crop: { top: number; right: number; bottom: number; left: number };
};

export function outputGeometry(
  width: number,
  height: number,
  settings: ImageSettings,
) {
  const { crop, rotation } = settings;
  if (![0, 90, 180, 270].includes(rotation))
    throw new Error('Choose a quarter-turn rotation.');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(settings.type))
    throw new Error('Choose JPG, PNG or WebP.');
  if (
    !Number.isFinite(settings.maximumKb) ||
    settings.maximumKb < 1 ||
    settings.maximumKb > 5120
  )
    throw new Error('Enter a maximum size from 1 to 5120 KB.');
  if (
    Object.values(crop).some((v) => !Number.isFinite(v) || v < 0 || v > 90) ||
    crop.left + crop.right >= 95 ||
    crop.top + crop.bottom >= 95
  )
    throw new Error('Keep at least 5% of the image in each direction.');
  const rotatedWidth = rotation % 180 ? height : width;
  const rotatedHeight = rotation % 180 ? width : height;
  const sourceWidth = rotatedWidth * (1 - (crop.left + crop.right) / 100);
  const sourceHeight = rotatedHeight * (1 - (crop.top + crop.bottom) / 100);
  if (Boolean(settings.width) !== Boolean(settings.height))
    throw new Error('Enter both width and height, or leave both blank.');
  for (const value of [settings.width, settings.height])
    if (
      value !== undefined &&
      (!Number.isInteger(value) || value < 1 || value > 4096)
    )
      throw new Error(
        'Dimensions must be whole numbers from 1 to 4096 pixels.',
      );
  return {
    rotatedWidth,
    rotatedHeight,
    sourceWidth,
    sourceHeight,
    x: (rotatedWidth * crop.left) / 100,
    y: (rotatedHeight * crop.top) / 100,
    width: settings.width ?? Math.max(1, Math.round(sourceWidth)),
    height: settings.height ?? Math.max(1, Math.round(sourceHeight)),
  };
}

export function drawFrame(bitmap: ImageBitmap, settings: ImageSettings) {
  const g = outputGeometry(bitmap.width, bitmap.height, settings);
  const rotated = document.createElement('canvas');
  rotated.width = g.rotatedWidth;
  rotated.height = g.rotatedHeight;
  const ctx = rotated.getContext('2d');
  if (!ctx) throw new Error('Your browser could not open an image editor.');
  ctx.translate(rotated.width / 2, rotated.height / 2);
  ctx.rotate((settings.rotation * Math.PI) / 180);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  const canvas = document.createElement('canvas');
  canvas.width = g.width;
  canvas.height = g.height;
  const target = canvas.getContext('2d');
  if (!target) throw new Error('Your browser could not open an image editor.');
  target.fillStyle = '#ffffff';
  target.fillRect(0, 0, canvas.width, canvas.height);
  target.imageSmoothingEnabled = true;
  target.imageSmoothingQuality = 'high';
  // Contain the crop without distorting faces or handwriting. Extra space stays white.
  const ratio = Math.min(g.width / g.sourceWidth, g.height / g.sourceHeight);
  const w = g.sourceWidth * ratio,
    h = g.sourceHeight * ratio;
  target.drawImage(
    rotated,
    g.x,
    g.y,
    g.sourceWidth,
    g.sourceHeight,
    (g.width - w) / 2,
    (g.height - h) / 2,
    w,
    h,
  );
  rotated.width = 0;
  rotated.height = 0;
  return canvas;
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('Could not export this image.'));
        else if (blob.type !== type)
          reject(
            new Error(
              'This browser cannot export that format. Try JPG or PNG.',
            ),
          );
        else resolve(blob);
      },
      type,
      quality,
    ),
  );
}

export async function fitImage(bitmap: ImageBitmap, settings: ImageSettings) {
  const source = drawFrame(bitmap, settings);
  const targetBytes = Math.floor(settings.maximumKb * 1000);
  let smallest: { blob: Blob; width: number; height: number } | undefined;
  try {
    for (let pass = 0; pass < (settings.width ? 1 : 9); pass++) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(source.width * 0.8 ** pass));
      canvas.height = Math.max(1, Math.round(source.height * 0.8 ** pass));
      const context = canvas.getContext('2d');
      if (!context)
        throw new Error('Your browser could not process this image.');
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      let best: Blob | undefined;
      let low = 0.15,
        high = 0.95;
      const record = (blob: Blob) => {
        if (!smallest || blob.size < smallest.blob.size)
          smallest = { blob, width: canvas.width, height: canvas.height };
        if (blob.size <= targetBytes && (!best || blob.size > best.size))
          best = blob;
      };
      record(await encode(canvas, settings.type, high));
      if (!best && settings.type !== 'image/png') {
        record(await encode(canvas, settings.type, low));
        for (let attempt = 0; attempt < 8; attempt++) {
          const quality = (low + high) / 2;
          const blob = await encode(canvas, settings.type, quality);
          record(blob);
          if (blob.size > targetBytes) high = quality;
          else low = quality;
        }
      }
      const width = canvas.width,
        height = canvas.height;
      canvas.width = 0;
      canvas.height = 0;
      if (best) return { blob: best, width, height, fits: true };
    }
    if (!smallest) throw new Error('Could not export this image.');
    return { ...smallest, fits: false };
  } finally {
    source.width = 0;
    source.height = 0;
  }
}
