export type ImageDimensions = { width: number; height: number };

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}

function valid(width: number, height: number): ImageDimensions | null {
  return width > 0 && height > 0 ? { width, height } : null;
}

export function readImageDimensions(
  buffer: ArrayBuffer,
  type: string,
): ImageDimensions | null {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  if (type === 'image/png' && bytes.length >= 24) {
    if (ascii(bytes, 1, 3) !== 'PNG') return null;
    return valid(view.getUint32(16), view.getUint32(20));
  }

  if (type === 'image/jpeg' && bytes.length >= 4) {
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
    let offset = 2;
    const frameMarkers = new Set([
      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
      0xcf,
    ]);
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = bytes[offset + 1];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0xd8 || marker === 0x01) {
        offset += 2;
        continue;
      }
      const segmentLength = view.getUint16(offset + 2);
      if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length)
        return null;
      if (frameMarkers.has(marker)) {
        return valid(view.getUint16(offset + 7), view.getUint16(offset + 5));
      }
      offset += 2 + segmentLength;
    }
    return null;
  }

  if (
    type === 'image/webp' &&
    bytes.length >= 30 &&
    ascii(bytes, 0, 4) === 'RIFF' &&
    ascii(bytes, 8, 4) === 'WEBP'
  ) {
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const chunk = ascii(bytes, offset, 4);
      const size = view.getUint32(offset + 4, true);
      const data = offset + 8;
      if (chunk === 'VP8X' && data + 10 <= bytes.length) {
        const width =
          1 +
          bytes[data + 4] +
          (bytes[data + 5] << 8) +
          (bytes[data + 6] << 16);
        const height =
          1 +
          bytes[data + 7] +
          (bytes[data + 8] << 8) +
          (bytes[data + 9] << 16);
        return valid(width, height);
      }
      if (chunk === 'VP8 ' && data + 10 <= bytes.length) {
        return valid(
          view.getUint16(data + 6, true) & 0x3fff,
          view.getUint16(data + 8, true) & 0x3fff,
        );
      }
      if (
        chunk === 'VP8L' &&
        data + 5 <= bytes.length &&
        bytes[data] === 0x2f
      ) {
        const width = 1 + bytes[data + 1] + ((bytes[data + 2] & 0x3f) << 8);
        const height =
          1 +
          (bytes[data + 2] >> 6) +
          (bytes[data + 3] << 2) +
          ((bytes[data + 4] & 0x0f) << 10);
        return valid(width, height);
      }
      offset = data + size + (size % 2);
    }
  }

  return null;
}

export function safeWorkingDimensions(
  dimensions: ImageDimensions,
  maximumPixels = 6_000_000,
  maximumSide = 3200,
) {
  const pixelScale = Math.sqrt(
    maximumPixels / (dimensions.width * dimensions.height),
  );
  const sideScale = maximumSide / Math.max(dimensions.width, dimensions.height);
  const scale = Math.min(1, pixelScale, sideScale);
  return {
    width: Math.max(1, Math.round(dimensions.width * scale)),
    height: Math.max(1, Math.round(dimensions.height * scale)),
    resized: scale < 1,
  };
}
