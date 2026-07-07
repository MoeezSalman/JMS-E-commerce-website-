import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

// Local fallback dir (used only when Vercel Blob isn't configured).
const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

/**
 * Persist an uploaded file and return its public URL.
 * - Production: uploads to Vercel Blob (when BLOB_READ_WRITE_TOKEN is set).
 * - Local dev: writes to /public/uploads and returns a /uploads/... path.
 */
export async function saveUpload(file: File, subdir: string): Promise<string> {
  const ext = path.extname(file.name) || EXT_BY_MIME[file.type] || ".bin";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;

  // Use Vercel Blob when configured — either a read-write token, or the
  // OIDC model (BLOB_STORE_ID + VERCEL_OIDC_TOKEN) that connected stores use.
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const blob = await put(`${subdir}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return blob.url;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${subdir}/${filename}`;
}
