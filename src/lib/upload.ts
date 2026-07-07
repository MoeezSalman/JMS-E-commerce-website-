import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Defaults to ./public/uploads (served statically in dev). In production set
// UPLOAD_DIR to a persistent volume path; files are served via /uploads/[...].
const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "public", "uploads");

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

/** Persist an uploaded file under /public/uploads/<subdir> and return its public path. */
export async function saveUpload(file: File, subdir: string): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });
  const ext =
    path.extname(file.name) || EXT_BY_MIME[file.type] || ".bin";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${subdir}/${filename}`;
}
