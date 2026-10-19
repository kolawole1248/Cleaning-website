import { SITE_URL } from "@/lib/site";

/**
 * Minimal Stripe REST helper — no SDK dependency.
 * Set STRIPE_SECRET_KEY in .env to enable card payments on quotes.
 * Without the key everything still works: quotes are sent with
 * bank transfer details (and your Stripe payment link if set in Settings).
 */

const API = "https://api.stripe.com/v1";

function stripeKey() {
  return process.env.STRIPE_SECRET_KEY || "";
}

function siteUrl() {
  return SITE_URL;
}

/** Stripe takes a whole number of pence, e.g. 18000 for £180.00 */
export function parsePriceToPence(input: string): number | null {
  const cleaned = input.replace(/[£,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const value = Math.round(parseFloat(cleaned) * 100);
  if (value < 50) return null; // Stripe minimum is 50p
  return value;
}

/**
 * Creates a Stripe Checkout session for a quote and returns its payment URL.
 * Returns null when Stripe is not configured or the request fails.
 */
export async function createQuoteCheckout(opts: {
  enquiryId: string;
  amountPence: number;
  description: string;
  customerEmail: string;
}): Promise<string | null> {
  const key = stripeKey();
  if (!key) return null;

  const body = new URLSearchParams({
    mode: "payment",
    success_url: `${siteUrl()}/quote/thank-you?id=${opts.enquiryId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/quote?cancelled=1`,
    customer_email: opts.customerEmail,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "gbp",
    "line_items[0][price_data][unit_amount]": String(opts.amountPence),
    "line_items[0][price_data][product_data][name]": opts.description,
    "metadata[enquiry_id]": opts.enquiryId,
    "payment_intent_data[metadata][enquiry_id]": opts.enquiryId,
  });

  try {
    const res = await fetch(`${API}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[stripe] checkout session failed:", await res.text());
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return data.url || null;
  } catch (error) {
    console.error("[stripe] request error:", error);
    return null;
  }
}

/** Returns "paid" | "unpaid" | "no_payment_required" | null */
export async function getCheckoutStatus(
  sessionId: string
): Promise<string | null> {
  const key = stripeKey();
  if (!key || !sessionId) return null;
  try {
    const res = await fetch(
      `${API}/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { payment_status?: string };
    return data.payment_status || null;
  } catch (error) {
    console.error("[stripe] status check error:", error);
    return null;
  }
}
