/* Sends a test enquiry email and a test quote email using .env SMTP settings. */
import { readFileSync } from "node:fs";
import nodemailer from "nodemailer";

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z_]+)="([^"]*)"\s*$/);
  if (m) process.env[m[1]] = m[2];
}

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, BUSINESS_EMAIL } =
  process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("SMTP not configured in .env");
  process.exit(1);
}

const port = Number(SMTP_PORT || 587);
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

try {
  const info = await transporter.verify();
  console.log("SMTP verify OK:", JSON.stringify(info));
} catch (e) {
  console.error("SMTP verify FAILED:", e.message);
  process.exit(1);
}

const to = BUSINESS_EMAIL || SMTP_USER;

// 1. Test enquiry notification
try {
  const r = await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject: "TEST — ZA Cleaning website enquiry notification",
    text:
      "This is a test of the enquiry notification email from the ZA Cleaning website.\n\n" +
      "Name: Test Customer\nPhone: 07000 000000\nEmail: test@example.com\n" +
      "Postcode: CR0 1AA\nService: Regular domestic cleaning\n\n" +
      "If you can read this, SMTP is working. You can delete this email.",
  });
  console.log("Enquiry test email SENT:", r.response);
} catch (e) {
  console.error("Enquiry test email FAILED:", e.message);
  process.exit(1);
}

// 2. Test quote email (branded HTML, bank details, no Stripe button)
const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#14213d">
  <div style="background:#0b2c5e;padding:26px 30px;border-radius:14px 14px 0 0">
    <p style="margin:0;color:#93d3a8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">ZA Cleaning Co Ltd</p>
    <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px">Your cleaning quote ZA-TEST01</h1>
  </div>
  <div style="border:1px solid #e5eaf2;border-top:0;padding:26px 30px;border-radius:0 0 14px 14px">
    <p style="margin:0 0 14px">Hi Test Customer,</p>
    <p style="margin:0 0 18px">Thank you for your enquiry about <strong>Regular domestic cleaning</strong>. Here is your quote:</p>
    <div style="background:#e9f6ee;border-radius:12px;padding:18px 22px">
      <p style="margin:0;font-size:13px;color:#071d40;text-transform:uppercase;letter-spacing:.08em">Total price</p>
      <p style="margin:6px 0 0;font-size:30px;font-weight:800;color:#0b2c5e">£180</p>
    </div>
    <p style="margin:22px 0 6px;font-size:15px">To confirm your booking, please reply to this email or call us to arrange payment.</p>
    <p style="margin:18px 0 4px;font-size:13px;color:#5a6b85;text-transform:uppercase;letter-spacing:.08em">Pay by bank transfer</p>
    <p style="margin:0;font-size:15px;line-height:1.7">Test Bank<br>Sort code: 00-00-00<br>Account number: 00000000<br>Reference: ZA-TEST01</p>
    <hr style="border:0;border-top:1px solid #e5eaf2;margin:24px 0">
    <p style="margin:0;font-size:12px;color:#5a6b85">ZA Cleaning Co Ltd · Company no. 17501743 · England and Wales</p>
  </div>
</div>`;

try {
  const r = await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject: "TEST — Your ZA Cleaning quote ZA-TEST01 — £180",
    html,
  });
  console.log("Quote test email SENT:", r.response);
} catch (e) {
  console.error("Quote test email FAILED:", e.message);
  process.exit(1);
}

console.log("ALL TEST EMAILS SENT to", to);
