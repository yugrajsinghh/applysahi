import test from 'node:test';
import assert from 'node:assert/strict';
import { outputGeometry, fitImage } from '../lib/image-fit.ts';
import {
  readImageDimensions,
  safeWorkingDimensions,
} from '../lib/image-metadata.ts';
const settings = {
  type: 'image/jpeg',
  maximumKb: 20,
  rotation: 0,
  crop: { top: 0, right: 0, bottom: 0, left: 0 },
};

test('rotation changes the coordinate space before percentage cropping', () => {
  const g = outputGeometry(800, 400, {
    ...settings,
    rotation: 90,
    crop: { top: 25, right: 0, bottom: 25, left: 0 },
  });
  assert.equal(g.width, 400);
  assert.equal(g.height, 400);
  assert.equal(g.y, 200);
});
test('exact dimensions are preserved for a differently shaped crop', () => {
  const g = outputGeometry(800, 400, { ...settings, width: 140, height: 60 });
  assert.equal(g.width, 140);
  assert.equal(g.height, 60);
  assert.equal(g.sourceWidth, 800);
});
test('invalid targets, incomplete dimensions and empty crops are rejected', () => {
  for (const patch of [
    { maximumKb: NaN },
    { maximumKb: 0 },
    { width: 200 },
    { width: 0, height: 10 },
    { width: 1.5, height: 10 },
    { width: 5000, height: 10 },
    { crop: { top: 50, bottom: 50, left: 0, right: 0 } },
  ])
    assert.throws(() => outputGeometry(100, 100, { ...settings, ...patch }));
});
function mockEncoder({ fallback = false } = {}) {
  globalThis.document = {
    createElement() {
      return {
        width: 0,
        height: 0,
        getContext() {
          return { translate() {}, rotate() {}, drawImage() {}, fillRect() {} };
        },
        toBlob(callback, type, quality) {
          const size = Math.ceil(
            this.width * this.height * (type === 'image/png' ? 1 : quality),
          );
          callback(
            new Blob([new Uint8Array(size)], {
              type: fallback ? 'image/png' : type,
            }),
          );
        },
      };
    },
  };
}
test('compression chooses an under-limit candidate, even when an oversized candidate is closer', async () => {
  mockEncoder();
  const out = await fitImage(
    { width: 200, height: 200 },
    { ...settings, maximumKb: 20, width: 200, height: 200 },
  );
  assert.equal(out.fits, true);
  assert.ok(out.blob.size <= 20000);
  assert.ok(out.blob.size > 19000);
});
test('fixed dimensions never shrink to hide a failed target', async () => {
  mockEncoder();
  const out = await fitImage(
    { width: 200, height: 200 },
    { ...settings, type: 'image/png', maximumKb: 1, width: 200, height: 200 },
  );
  assert.equal(out.fits, false);
  assert.equal(out.width, 200);
  assert.equal(out.height, 200);
  assert.ok(out.blob.size > 1000);
});
test('automatic dimensions can shrink to meet the target', async () => {
  mockEncoder();
  const out = await fitImage(
    { width: 200, height: 200 },
    { ...settings, maximumKb: 1 },
  );
  assert.equal(out.fits, true);
  assert.ok(out.width < 200);
  assert.ok(out.blob.size <= 1000);
});
test('an unavailable export format produces an error instead of a mislabeled download', async () => {
  mockEncoder({ fallback: true });
  await assert.rejects(
    fitImage({ width: 20, height: 20 }, settings),
    /cannot export/,
  );
});

test('reads PNG dimensions before decoding the image', () => {
  const bytes = new Uint8Array(24);
  bytes.set([0x89, 0x50, 0x4e, 0x47], 0);
  const view = new DataView(bytes.buffer);
  view.setUint32(16, 6000);
  view.setUint32(20, 4000);
  assert.deepEqual(readImageDimensions(bytes.buffer, 'image/png'), {
    width: 6000,
    height: 4000,
  });
});

test('large images receive a proportional, memory-safe working size', () => {
  const output = safeWorkingDimensions({ width: 6000, height: 4000 });
  assert.equal(output.resized, true);
  assert.equal(output.width / output.height, 1.5);
  assert.ok(output.width * output.height <= 6_000_000);
  assert.ok(Math.max(output.width, output.height) <= 3200);
});
