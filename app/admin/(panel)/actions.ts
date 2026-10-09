"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { destroySession, getSession, verifyLogin } from "@/lib/auth";
import { DEFAULT_SETTINGS, getSettings } from "@/lib/data";
import { sendQuoteEmail } from "@/lib/email";
import { createQuoteCheckout, parsePriceToPence } from "@/lib/stripe";

function str(formData: FormData, key: string, max = 5000): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/* ---------- session ---------- */

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- services & prices ---------- */

export async function saveService(formData: FormData) {
  await requireSession();

  const id = str(formData, "id", 40);
  const name = str(formData, "name", 120);
  if (!name) redirect("/admin/services?error=Name+is+required");

  let slug = str(formData, "slug", 120);
  if (!slug) {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const data = {
    name,
    slug,
    summary: str(formData, "summary", 400),
    description: str(formData, "description", 3000),
    includes: str(formData, "includes", 5000),
    priceLabel: str(formData, "priceLabel", 120),
    priceNote: str(formData, "priceNote", 120),
    image: str(formData, "image", 500),
    status: str(formData, "status", 30) || "published",
    order: Number(str(formData, "order", 10)) || 0,
    featured: formData.get("featured") === "on",
  };

  try {
    if (id) {
      await prisma.service.update({ where: { id }, data });
    } else {
      await prisma.service.create({ data });
    }
  } catch {
    redirect("/admin/services?error=Slug+must+be+unique");
  }

  revalidatePath("/admin/services");
  redirect("/admin/services?saved=1");
}

export async function setServiceStatus(formData: FormData) {
  await requireSession();
  const id = str(formData, "id", 40);
  const status = str(formData, "status", 30);
  if (!id || !["published", "coming-soon", "hidden"].includes(status)) return;

  await prisma.service.update({ where: { id }, data: { status } });
  revalidatePath("/admin/services");
}

/* ---------- enquiries ---------- */

export async function updateEnquiry(formData: FormData) {
  await requireSession();
  const id = str(formData, "id", 40);
  const status = str(formData, "status", 30);
  const notes = str(formData, "notes", 5000);
  if (!id) return;

  await prisma.enquiry.update({
    where: { id },
    data: {
      status: status || "new",
      notes,
    },
  });
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(formData: FormData) {
  await requireSession();
  const id = str(formData, "id", 40);
  if (!id) return;

  await prisma.enquiry.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/enquiries");
}

/* Send a priced quote to the customer by email */
export async function sendQuote(formData: FormData) {
  await requireSession();

  const id = str(formData, "id", 40);
  const price = str(formData, "price", 40);
  const message = str(formData, "message", 2000);
  if (!id || !price) {
    redirect(`/admin/enquiries?id=${id}&quoteSent=missing`);
  }

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) redirect("/admin/enquiries");

  const settings = await getSettings();
  const ref = `ZA-${enquiry.id.slice(-6).toUpperCase()}`;
  const pence = parsePriceToPence(price);

  // Card payment link — DORMANT until Stripe is switched on later.
  // Without STRIPE_SECRET_KEY in .env, createQuoteCheckout() returns null
  // immediately (no request, no error) and we fall back to the payment link
  // in Settings. Both empty today → the quote is sent with bank details only.
  let payUrl = "";
  let stripeSessionId = "";
  if (pence) {
    payUrl =
      (await createQuoteCheckout({
        enquiryId: enquiry.id,
        amountPence: pence,
        description: `ZA Cleaning Co — ${enquiry.service} (quote ${ref})`,
        customerEmail: enquiry.email,
      })) || settings.stripeLink || "";
    const match = payUrl.match(/\/(cs_[A-Za-z0-9]+)/);
    stripeSessionId = match ? match[1] : "";
  } else {
    payUrl = settings.stripeLink || "";
  }

  const nextStatus = ["booked", "closed"].includes(enquiry.status)
    ? enquiry.status
    : "quoted";

  await prisma.enquiry.update({
    where: { id },
    data: {
      quotePrice: price,
      quoteMessage: message,
      quoteSentAt: new Date(),
      stripeSessionId,
      status: nextStatus,
    },
  });

  const bankLines: string[] = [];
  if (settings.sortCode && settings.accountNumber) {
    if (settings.bankName) bankLines.push(settings.bankName);
    if (settings.accountName) bankLines.push(`Account name: ${settings.accountName}`);
    bankLines.push(`Sort code: ${settings.sortCode}`);
    bankLines.push(`Account number: ${settings.accountNumber}`);
    bankLines.push(`Reference: ${ref}`);
  }

  const result = await sendQuoteEmail({
    to: enquiry.email,
    name: enquiry.name,
    ref,
    service: enquiry.service,
    price,
    message,
    payUrl,
    bankLines,
    responseTime: settings.responseTime,
  });

  revalidatePath("/admin/enquiries");
  redirect(
    `/admin/enquiries?id=${id}&quoteSent=${result.sent ? "1" : "0"}`
  );
}

/* ---------- settings ---------- */

export async function updateSettings(formData: FormData) {
  await requireSession();

  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    const value = formData.get(key);
    if (typeof value !== "string") continue;
    await prisma.setting.upsert({
      where: { key },
      update: { value: value.trim() },
      create: { key, value: value.trim() },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function changePassword(formData: FormData) {
  const session = await requireSession();

  const current = str(formData, "current", 200);
  const next = str(formData, "next", 200);
  const confirm = str(formData, "confirm", 200);

  if (!current || !next || !confirm) {
    redirect("/admin/settings?error=Fill+in+all+password+fields");
  }
  if (next !== confirm) {
    redirect("/admin/settings?error=New+passwords+do+not+match");
  }
  if (next.length < 8) {
    redirect("/admin/settings?error=New+password+must+be+at+least+8+characters");
  }

  const valid = await verifyLogin(session.email, current);
  if (!valid) {
    redirect("/admin/settings?error=Current+password+is+incorrect");
  }

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.adminUser.update({
    where: { email: session.email },
    data: { passwordHash },
  });

  redirect("/admin/settings?passwordChanged=1");
}
