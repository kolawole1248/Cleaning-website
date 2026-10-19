# ZA Cleaning Co — website handover guide

Your website is a **Next.js (TypeScript)** app with a built-in admin panel.
Everything you need to run and edit it is explained below.

---

## 1. Start the server (VS Code)

1. Open the project folder in **VS Code** (`File → Open Folder…` → `Desktop → Cleaning website`).
2. Open the terminal: **Ctrl + `** (or `Terminal → New Terminal`).
3. In the terminal run:

```bash
npm run dev
```

4. Wait for the line `✓ Ready ...` — the terminal then prints your site address as a
   `Local:` URL (it is usually `http://localhost:3000`, but Next.js may pick another
   port such as `http://localhost:60521` if 3000 is busy). **Copy the URL shown in your
   own terminal** and open it in your browser.

To stop the server: press **Ctrl + C** in the terminal.

> First time on a new computer: run `npm install` and `npm run setup` once before `npm run dev`.

---

## 2. Open the admin panel (where you edit prices)

1. With the server running, take the site URL from your terminal (e.g.
   `http://localhost:3000` or `http://localhost:60521`) and add `/admin/login`:

```
http://localhost:3000/admin/login
```

   (use the exact host:port your terminal printed, plus `/admin/login`)

2. Sign in with:

| Field | Value |
|---|---|
| Email | `admin@zacleans.co.uk` |
| Password | `ChangeMe123!` |

3. **Change your password straight away**: `Settings → Change your password`.

Only this login exists — visitors to your site never see a login page.

---

## 3. Edit services and prices

`Admin panel → Services & prices`

- Press **Edit** next to any service to change:
  - **Price shown on site** (e.g. `From £25 per cleaner-hour`)
  - **Price note** (e.g. `Minimum 2 hours`)
  - Description, what's included (one item per line), image, sort order
- Press **Save service** — the website updates immediately.
- Use **Hide** / **Publish** to take a service off or put it back.
- **+ Add a service** creates new ones; `Coming soon` services (post-construction,
  carpet & upholstery, window cleaning, washroom supplies) are already listed —
  press **Publish** when you confirm you offer them.

## 4. Read customer enquiries

`Admin panel → Enquiries`

- Every quote-form submission appears here **and** is emailed to your business email
  (once SMTP is set up — see section 6).
- Click a name to see full details, photos the customer uploaded, and to change
  status (`New → Reviewing → Quoted → Booked → Closed`) and add private notes.

### 4b. Send a priced quote and take card payment

On the enquiry page, use the **Send a quote** box:

1. Enter the **price** (e.g. `£180` or `240`) and optionally edit the message.
2. Press **Send quote by email**.
3. The customer receives a branded quote email with:
   - the price and your message
   - your **bank transfer details** and the payment reference
   - (the **Pay by debit card** button appears automatically once Stripe
     is switched on — see below; until then quotes are bank-transfer only)
4. The enquiry status changes to **Quoted** automatically.

**Stripe card payments are currently switched off** (no API key yet) — but
everything is built and ready: the code stays in `lib/stripe.ts`, the
**Stripe payment link** field stays in Settings, and quotes go out normally
with bank transfer details only. To switch card payments on later:

1. Create a Stripe account and copy your secret key from
   https://dashboard.stripe.com/apikeys
2. Add `STRIPE_SECRET_KEY="sk_live_..."` to `.env` (or just paste a payment
   link into `Admin → Settings → Stripe payment link`), then restart the server.
3. Quotes then include a **Pay by debit card** button for the exact amount;
   when a customer pays, the site marks the enquiry **Booked** and emails you
   a `💳 Payment received` alert.

## 5. Change contact details / payment details

`Admin panel → Settings`

- Phone, WhatsApp, email, Instagram, response promise
- Company details shown in the footer (UK limited-company requirement)
- Bank details and your **Stripe payment link**

---

## 6. Email notifications — new enquiries + sending quotes

**✅ DONE — email is configured and tested.** Enquiries are saved in the
admin panel **and** emailed to `zacleans26@gmail.com`; quotes are emailed to
customers too. The settings live in `.env`:

```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="zacleans26@gmail.com"
SMTP_PASS="the-gmail-app-password"
SMTP_FROM="ZA Cleaning Co Ltd <zacleans26@gmail.com>"
BUSINESS_EMAIL="zacleans26@gmail.com"
```

The pass is a Gmail **App Password** (https://myaccount.google.com/apppasswords,
2-step verification required). If you ever rotate it, update `SMTP_PASS` in
`.env` and restart the server. You can re-test any time with:

```
node scripts/test-email.mjs
```

(You should see `[email] ... sent` lines in the server terminal whenever an
enquiry or quote email goes out.)

---

## 7. Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the website (development) |
| `npm run build` | Production build check |
| `npm run setup` | Create/reset database tables + seed content |
| `npm run db:seed` | Add missing launch content (never overwrites your edits) |

## 8. Project structure

| Path | What it is |
|---|---|
| `app/(site)/` | The public website (home, services, prices, about, quote, privacy) |
| `app/admin/` | The admin panel (login + dashboard) |
| `components/` | Shared UI (header, footer, cards) |
| `prisma/` | Database schema + seed data |
| `lib/` | Auth, database, settings, email helpers |
| `public/za-logo.jpg` | Your logo |
| `.env` | Database path, session secret, email settings |

## 9. Before going live

- [ ] Change the admin password (Settings page)
- [ ] Change `SESSION_SECRET` in `.env` to a long random string
- [x] Site URL is hardcoded to `https://zacleaning.com` in `lib/site.ts` (sitemap, robots, canonicals and email links always use it — no `SITE_URL` env var needed)
- [ ] Add your real bank details in Settings (quotes include them)
- [x] SMTP email configured + tested (section 6)
- [ ] When you get a Stripe account: switch on card payments (section 4b)
- [x] Deployed to Vercel with the domain zacleaning.com — see section 10

## 10. Deploying to Vercel — what to enter

Yes — you must recreate **every** setting from `.env` in the Vercel dashboard
(`Project → Settings → Environment Variables`). `.env` is only read on your
computer. Add:

| Name | Value |
|---|---|
| `SESSION_SECRET` | a new long random string (not the dev one) |
| `TURSO_DATABASE_URL` | from `turso db show za-cleaning` (looks like `libsql://…`) |
| `TURSO_AUTH_TOKEN` | from `turso db tokens create za-cleaning` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Product Environment Credentials |
| `CLOUDINARY_API_KEY` | same page |
| `CLOUDINARY_API_SECRET` | same page |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `zacleans26@gmail.com` |
| `SMTP_PASS` | your Gmail app password |
| `SMTP_FROM` | `ZA Cleaning Co Ltd <zacleans26@gmail.com>` |
| `BUSINESS_EMAIL` | `zacleans26@gmail.com` |
| `STRIPE_SECRET_KEY` | only when you switch Stripe on later |

**You do NOT need a `SITE_URL` variable** — the domain (`https://zacleaning.com`)
is hardcoded in `lib/site.ts`, so sitemap/robots/canonical tags and the links
inside emails are always correct even if the Vercel environment changes.

Redeploy after changing environment variables.

**How the database works:** locally the site uses the SQLite file
(`prisma/dev.db`) — no setup needed. On Vercel, setting the two `TURSO_*`
variables switches it to your hosted Turso database automatically (the code
in `lib/db.ts` picks whichever is available). Photos behave the same way:
local `public/uploads` at home, Cloudinary on Vercel.

**First migration to Turso** (run once — asks you for nothing):

1. Put `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env`
2. Run `npm run db:migrate:turso` — creates the tables on Turso and copies
   every service, setting, enquiry and the admin login across. Safe to re-run.
