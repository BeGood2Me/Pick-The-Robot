/**
 * Writes public brand images with descriptive SEO filenames:
 * BMP favicon.ico at site root, SVG/PNGs under public/images/brand/.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEAL = { r: 0x0e, g: 0x74, b: 0x90, a: 0xff };
const WHITE = { r: 0xff, g: 0xff, b: 0xff, a: 0xff };

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function pngRgba(size, pixels) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x++) {
      const p = pixels[y * size + x];
      const o = row + 1 + x * 4;
      raw[o] = p.r;
      raw[o + 1] = p.g;
      raw[o + 2] = p.b;
      raw[o + 3] = p.a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function dist(x, y, cx, cy) {
  return Math.hypot(x - cx, y - cy);
}

function paintMark(size) {
  const s = (n) => (n / 28) * size;
  const pixels = Array.from({ length: size * size }, () => ({ ...TEAL }));
  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    pixels[y * size + x] = color;
  };
  const fillCircle = (cx, cy, r, color) => {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        if (dist(x + 0.5, y + 0.5, cx, cy) <= r) set(x, y, color);
      }
    }
  };
  const fillRect = (x0, y0, w, h, color) => {
    for (let y = Math.floor(y0); y < Math.ceil(y0 + h); y++) {
      for (let x = Math.floor(x0); x < Math.ceil(x0 + w); x++) set(x, y, color);
    }
  };

  fillCircle(s(10), s(11), Math.max(1.2, s(2.25)), WHITE);
  fillCircle(s(18), s(11), Math.max(1.2, s(2.25)), WHITE);
  fillRect(s(9), s(16), s(10), Math.max(1.5, s(2)), WHITE);
  fillRect(s(12), s(4), s(4), s(3), WHITE);

  return pixels;
}

/** Classic ICO BMP (BGRA + AND mask). Chrome on Windows often rejects PNG-in-ICO in the address bar. */
function dib32(size, pixels) {
  const xorStride = size * 4;
  const xor = Buffer.alloc(xorStride * size);
  for (let y = 0; y < size; y++) {
    const srcY = size - 1 - y;
    for (let x = 0; x < size; x++) {
      const p = pixels[srcY * size + x];
      const o = y * xorStride + x * 4;
      xor[o] = p.b;
      xor[o + 1] = p.g;
      xor[o + 2] = p.r;
      xor[o + 3] = p.a;
    }
  }
  const andStride = Math.ceil(size / 32) * 4;
  const and = Buffer.alloc(andStride * size);
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(xor.length + and.length, 20);
  return Buffer.concat([header, xor, and]);
}

function icoFromDibs(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  const bodies = [];
  for (const { size, dib } of images) {
    const entry = Buffer.alloc(16);
    entry[0] = size;
    entry[1] = size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(dib.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    bodies.push(dib);
    offset += dib.length;
  }
  return Buffer.concat([header, ...entries, ...bodies]);
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="32" height="32">
  <rect width="28" height="28" rx="6" fill="#0e7490"/>
  <circle cx="10" cy="11" r="2.25" fill="#fff"/>
  <circle cx="18" cy="11" r="2.25" fill="#fff"/>
  <path d="M9 17h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <rect x="12" y="4" width="4" height="3" rx="1" fill="#fff"/>
</svg>
`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const brandDir = join(pub, 'images', 'brand');
mkdirSync(brandDir, { recursive: true });

const BRAND_FILES = {
  svg: 'picktherobot-robot-mark.svg',
  png32: 'picktherobot-robot-mark-32x32.png',
  png48: 'picktherobot-robot-mark-48x48.png',
  apple180: 'picktherobot-apple-touch-icon-180x180.png',
};

const px16 = paintMark(16);
const px32 = paintMark(32);
const px48 = paintMark(48);
const px180 = paintMark(180);

const ico = icoFromDibs([
  { size: 16, dib: dib32(16, px16) },
  { size: 32, dib: dib32(32, px32) },
  { size: 48, dib: dib32(48, px48) },
]);

const png48 = pngRgba(48, px48);
const png180 = pngRgba(180, px180);

writeFileSync(join(pub, 'favicon.ico'), ico);
writeFileSync(join(brandDir, BRAND_FILES.svg), svg);
writeFileSync(join(brandDir, BRAND_FILES.png32), pngRgba(32, px32));
writeFileSync(join(brandDir, BRAND_FILES.png48), png48);
writeFileSync(join(brandDir, BRAND_FILES.apple180), png180);
console.log(`wrote public/favicon.ico (${ico.length} bytes, BMP ICO)`);
console.log(`wrote public/images/brand/${BRAND_FILES.svg}, ${BRAND_FILES.png32}, ${BRAND_FILES.png48}, ${BRAND_FILES.apple180}`);
