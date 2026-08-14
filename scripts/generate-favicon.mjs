/**
 * Writes src/app/favicon.ico and public/favicon.ico (16 + 32 PNG frames).
 * Chrome's address bar requests /favicon.ico; a generated /icon PNG is not enough.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEAL = { r: 0x0e, g: 0x74, b: 0x90, a: 0xff };
const WHITE = { r: 0xff, g: 0xff, b: 0xff, a: 0xff };
const CLEAR = { r: 0, g: 0, b: 0, a: 0 };

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

function pngRgba(width, pixels) {
  const height = width;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const p = pixels[y * width + x];
      const o = row + 1 + x * 4;
      raw[o] = p.r;
      raw[o + 1] = p.g;
      raw[o + 2] = p.b;
      raw[o + 3] = p.a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
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

function inRoundRect(x, y, size, radius) {
  const r = radius;
  if (x >= r && x < size - r && y >= 0 && y < size) return true;
  if (y >= r && y < size - r && x >= 0 && x < size) return true;
  if (dist(x, y, r, r) <= r) return true;
  if (dist(x, y, size - 1 - r, r) <= r) return true;
  if (dist(x, y, r, size - 1 - r) <= r) return true;
  if (dist(x, y, size - 1 - r, size - 1 - r) <= r) return true;
  return false;
}

function paintMark(size) {
  const s = (n) => (n / 28) * size;
  const pixels = Array.from({ length: size * size }, () => CLEAR);
  const radius = s(6);
  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    pixels[y * size + x] = color;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inRoundRect(x + 0.5, y + 0.5, size, radius)) set(x, y, TEAL);
    }
  }

  const fillCircle = (cx, cy, r, color) => {
    const minX = Math.floor(cx - r);
    const maxX = Math.ceil(cx + r);
    const minY = Math.floor(cy - r);
    const maxY = Math.ceil(cy + r);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (dist(x + 0.5, y + 0.5, cx, cy) <= r) set(x, y, color);
      }
    }
  };

  const fillRect = (x0, y0, w, h, color) => {
    for (let y = Math.floor(y0); y < Math.ceil(y0 + h); y++) {
      for (let x = Math.floor(x0); x < Math.ceil(x0 + w); x++) set(x, y, color);
    }
  };

  fillCircle(s(10), s(11), s(2.25), WHITE);
  fillCircle(s(18), s(11), s(2.25), WHITE);
  fillRect(s(9), s(16), s(10), s(2), WHITE);
  fillRect(s(12), s(4), s(4), s(3), WHITE);
  fillCircle(s(14), s(3), s(1), WHITE);

  return pixels;
}

function icoFromPngs(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  const bodies = [];
  for (const { size, png } of pngs) {
    const entry = Buffer.alloc(16);
    entry[0] = size === 256 ? 0 : size;
    entry[1] = size === 256 ? 0 : size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    bodies.push(png);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...bodies]);
}

const pngs = [16, 32, 48].map((size) => ({
  size,
  png: pngRgba(size, paintMark(size)),
}));
const ico = icoFromPngs(pngs);

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const targets = [join(root, 'src', 'app', 'favicon.ico'), join(root, 'public', 'favicon.ico')];
for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, ico);
  console.log(`wrote ${target} (${ico.length} bytes)`);
}
