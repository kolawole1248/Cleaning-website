"use server";

import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { sendEnquiryEmail } from "@/lib/email";

export type EnquiryFormState = {
  ok: boolean;
  error?: string;
  id?: string;
} | null;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per photo

function str(formData: FormData, key: string, max = 500): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitEnquiry(
  _prev: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  // Honeypot — bots fill this hidden field; pretend success and stop.
  if (str(formData, "company", 200)) return { ok: true };

  const name = str(formData, "name", 100);
  const phone = str(formData, "phone", 30);
  const email = str(formData, "email", 200);
  const postcode = str(formData, "postcode", 12);
  const service = str(formData, "service", 100);
  const propertyType = str(formData, "propertyType", 50);
  const bedrooms = str(formData, "bedrooms", 20);
  const bathrooms = str(formData, "bathrooms", 20);
  const frequency = str(formData, "frequency", 50);
  const preferredDate = str(formData, "preferredDate", 30);
  const extras = str(formData, "extras", 1000);
  const description = str(formData, "description", 3000);
  const consent = formData.get("consent");

  if (!name || !phone || !email || !postcode || !service || !propertyType) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!bedrooms || !bathrooms || !frequency || !description) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (!consent) {
    return {
      ok: false,
      error: "Please agree so we can contact you about your enquiry.",
    };
  }

  // Save uploaded photos securely (type + size checked, random names)
  const photoPaths: string[] = [];
  const files = formData.getAll("photos");
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (photoPaths.length >= MAX_FILES) {
      return {
        ok: false,
        error: `You can upload a maximum of ${MAX_FILES} photos.`,
      };
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return {
        ok: false,
        error: "Photos must be JPG, PNG or WebP images.",
      };
    }
    if (file.size > MAX_SIZE) {
      return {
        ok: false,
        error: "Each photo must be smaller than 5MB.",
      };
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.mkdir(dir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(dir, safeName), buffer);
      photoPaths.push(`/uploads/${safeName}`);
    } catch (error) {
      // Never lose the enquiry over a photo — e.g. read-only filesystem
      // when hosted serverless. The enquiry is saved without that photo.
      console.error("[enquiry] photo save failed:", error);
    }
  }

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email,
        postcode,
        service,
        propertyType,
        bedrooms,
        bathrooms,
        frequency,
        preferredDate,
        extras,
        description,
        photos: JSON.stringify(photoPaths),
      },
    });

    // Email the business — non-fatal if SMTP is not configured yet
    await sendEnquiryEmail({
      id: enquiry.id,
      name,
      phone,
      email,
      postcode,
      service,
      propertyType,
      bedrooms,
      bathrooms,
      frequency,
      preferredDate,
      extras,
      description,
    });

    return { ok: true, id: enquiry.id };
  } catch (error) {
    console.error("[enquiry] failed to save:", error);
    return {
      ok: false,
      error:
        "Sorry, something went wrong sending your enquiry. Please call or WhatsApp us instead.",
    };
  }
}
