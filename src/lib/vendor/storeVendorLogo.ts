import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { extensionForVendorLogoMime, type VendorLogoMimeType } from '@/lib/vendor/logoUpload';

export async function storeVendorLogo(
  vendorSlug: string,
  buffer: Buffer,
  mime: VendorLogoMimeType,
): Promise<string> {
  const ext = extensionForVendorLogoMime(mime);
  if (!ext) {
    throw new Error('unsupported_mime');
  }

  const objectName = `vendor-logos/${vendorSlug}-${Date.now()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(objectName, buffer, {
      access: 'public',
      contentType: mime,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'vendor-logos');
  await mkdir(uploadDir, { recursive: true });
  const fileName = `${vendorSlug}-${Date.now()}.${ext}`;
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/vendor-logos/${fileName}`;
}
