import nodemailer from "nodemailer";

type EnquiryMail = {
  id: string;
  name: string;
  phone: string;
  email: string;
  postcode: string;
  service: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  frequency: string;
  preferredDate: string;
  extras: string;
  description: string;
};

/**
 * Sends the enquiry to the business email address.
 * Requires SMTP settings in .env — if they are missing the enquiry is
 * still saved in the admin panel inbox, so nothing is ever lost.
 */
export async function sendEnquiryEmail(enquiry: EnquiryMail) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, BUSINESS_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("[email] SMTP not configured — enquiry saved to admin inbox only");
    return { sent: false, reason: "smtp-not-configured" as const };
  }

  try {
    const port = Number(SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const lines = [
      `Name: ${enquiry.name}`,
      `Phone: ${enquiry.phone}`,
      `Email: ${enquiry.email}`,
      `Postcode: ${enquiry.postcode}`,
      `Service: ${enquiry.service}`,
      `Property: ${enquiry.propertyType}`,
      `Bedrooms: ${enquiry.bedrooms}`,
      `Bathrooms: ${enquiry.bathrooms}`,
      `Frequency: ${enquiry.frequency}`,
      `Preferred date: ${enquiry.preferredDate || "not specified"}`,
      `Extra tasks: ${enquiry.extras || "none"}`,
      ``,
      `Description:`,
      enquiry.description,
      ``,
      `View in admin panel: ${
        (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")
      }/admin/enquiries?id=${enquiry.id}`,
    ].join("\n");

    await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: BUSINESS_EMAIL || "zacleans26@gmail.com",
      subject: `New website enquiry — ${enquiry.name} (${enquiry.service})`,
      text: lines,
    });

    console.log(`[email] enquiry notification sent to ${BUSINESS_EMAIL || SMTP_USER}`);
    return { sent: true as const };
  } catch (error) {
    console.error("[email] failed to send:", error);
    return { sent: false, reason: "error" as const };
  }
}

function mailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type QuoteMail = {
  to: string;
  name: string;
  ref: string;
  service: string;
  price: string;
  message: string;
  payUrl: string;
  bankLines: string[];
  responseTime: string;
};

/**
 * Emails the customer their quote, with a "Pay by card" button (when a
 * Stripe/payment-link URL exists) and the bank transfer details.
 * Returns { sent:false } if SMTP is not configured — the quote is still
 * saved in the admin panel either way.
 */
export async function sendQuoteEmail(quote: QuoteMail) {
  const transport = mailer();
  if (!transport) {
    console.log("[email] SMTP not configured — quote saved to admin only");
    return { sent: false, reason: "smtp-not-configured" as const };
  }

  const bankHtml = quote.bankLines.length
    ? `<p style="margin:18px 0 4px;font-size:13px;color:#5a6b85;text-transform:uppercase;letter-spacing:.08em">Pay by bank transfer</p>
       <p style="margin:0;font-size:15px;line-height:1.7">${quote.bankLines
         .map(esc)
         .join("<br>")}</p>`
    : "";

  const payHtml = quote.payUrl
    ? `<p style="margin:22px 0 6px">
         <a href="${esc(quote.payUrl)}"
            style="display:inline-block;background:#0b2c5e;color:#ffffff;font-weight:700;padding:14px 30px;border-radius:999px;text-decoration:none">
           Pay by debit card
         </a>
       </p>
       <p style="margin:0;font-size:13px;color:#5a6b85">Secure card payment powered by Stripe.</p>`
    : `<p style="margin:22px 0 6px;font-size:15px">To confirm your booking, please reply to this email or call us to arrange payment.</p>`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#14213d">
    <div style="background:#0b2c5e;padding:26px 30px;border-radius:14px 14px 0 0">
      <p style="margin:0;color:#93d3a8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">ZA Cleaning Co Ltd</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px">Your cleaning quote ${esc(quote.ref)}</h1>
    </div>
    <div style="border:1px solid #e5eaf2;border-top:0;padding:26px 30px;border-radius:0 0 14px 14px">
      <p style="margin:0 0 14px">Hi ${esc(quote.name)},</p>
      <p style="margin:0 0 18px">Thank you for your enquiry about <strong>${esc(quote.service)}</strong>. Here is your quote:</p>
      <div style="background:#e9f6ee;border-radius:12px;padding:18px 22px">
        <p style="margin:0;font-size:13px;color:#071d40;text-transform:uppercase;letter-spacing:.08em">Total price</p>
        <p style="margin:6px 0 0;font-size:30px;font-weight:800;color:#0b2c5e">${esc(quote.price)}</p>
      </div>
      ${
        quote.message
          ? `<p style="margin:18px 0 0;white-space:pre-wrap">${esc(quote.message)}</p>`
          : ""
      }
      ${payHtml}
      ${bankHtml}
      <hr style="border:0;border-top:1px solid #e5eaf2;margin:24px 0">
      <p style="margin:0 0 6px;font-size:14px">Questions? Just reply to this email, call or WhatsApp us.</p>
      <p style="margin:0;font-size:14px;font-weight:700;color:#0b2c5e">${esc(quote.responseTime)}</p>
      <p style="margin:22px 0 0;font-size:12px;color:#5a6b85">ZA Cleaning Co Ltd · Company no. 17501743 · England and Wales<br>Flat 268 Pinnacle Apartment, Saffron Square, Croydon, England CR0 2GH</p>
    </div>
  </div>`;

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: quote.to,
      subject: `Your ZA Cleaning quote ${quote.ref} — ${quote.price}`,
      html,
    });
    console.log(`[email] quote ${quote.ref} sent to ${quote.to}`);
    return { sent: true as const };
  } catch (error) {
    console.error("[email] quote email failed:", error);
    return { sent: false, reason: "error" as const };
  }
}

/** Tells the business owner a customer paid their quote. */
export async function sendPaymentReceivedEmail(opts: {
  name: string;
  ref: string;
  price: string;
  enquiryId: string;
}) {
  const transport = mailer();
  const { BUSINESS_EMAIL } = process.env;
  if (!transport) return { sent: false, reason: "smtp-not-configured" as const };

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: BUSINESS_EMAIL || "zacleans26@gmail.com",
      subject: `💳 Payment received — ${opts.ref} — ${opts.price}`,
      text: [
        `${opts.name} has paid their quote.`,
        `Quote: ${opts.ref}`,
        `Amount: ${opts.price}`,
        ``,
        `View in admin panel: /admin/enquiries?id=${opts.enquiryId}`,
      ].join("\n"),
    });
    return { sent: true as const };
  } catch (error) {
    console.error("[email] payment email failed:", error);
    return { sent: false, reason: "error" as const };
  }
}
