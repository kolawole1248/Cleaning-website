import { createHash } from "node:crypto";
import { promises as fs } from "fs";
import path from "path";

/**
 * Customer photo storage.
 * - Hosted (Vercel): CLOUDINARY_* env vars are set and photos go straight to
 *   Cloudinary (their servers) — nothing is written to disk, which matters
 *   because Vercel's filesystem is read-only and resets on every deploy.
 * - Local development: falls back to public/uploads so no sign-up is needed.
 */

type CloudinaryConfig = { cloud: string; key: string; secret: string };

function cloudinaryConfig(): CloudinaryConfig | null {
  let cloud = process.env.CLOUDINARY_CLOUD_NAME || "";
  let key = process.env.CLOUDINARY_API_KEY || "";
  let secret = process.env.CLOUDINARY_API_SECRET || "";

  // Also accept the combined Cloudinary URL format:
  // CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
  const combined = process.env.CLOUDINARY_URL || "";
  const match = combined.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (match) {
    key = match[1];
    secret = match[2];
    cloud = match[3];
  }

  if (cloud && key && secret) return { cloud, key, secret };
  return null;
}

export function photoStorageMode(): "cloudinary" | "local" {
  return cloudinaryConfig() ? "cloudinary" : "local";
}

const FOLDER = "za-cleaning-enquiries";

async function uploadToCloudinary(
  config: CloudinaryConfig,
  file: File
): Promise<string> {
  const timestamp = Math.round(Date.now() / 1000);
  // Signature = SHA-1 of the sorted params + API secret (Cloudinary's rule)
  const toSign = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(toSign + config.secret)
    .digest("hex");

  const bytes = Buffer.from(await file.arrayBuffer());
  const form = new FormData();
  form.append(
    "file",
    new Blob([bytes], { type: file.type }),
    file.name || "photo.jpg"
  );
  form.append("api_key", config.key);
  form.append("timestamp", String(timestamp));
  form.append("folder", FOLDER);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloud}/image/upload`,
    { method: "POST", body: form }
  );
  const data = (await res.json().catch(() => ({}))) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.secure_url) {
    throw new Error(
      data.error?.message || `Cloudinary upload failed (HTTP ${res.status})`
    );
  }
  return data.secure_url;
}

/**
 * Stores one customer photo and returns its public URL.
 * Throws on failure — the caller decides whether that is fatal.
 */
export async function storePhoto(file: File): Promise<string> {
  const config = cloudinaryConfig();
  if (config) return uploadToCloudinary(config, file);

  // Local development fallback: write into public/uploads
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${safeName}`;
}
