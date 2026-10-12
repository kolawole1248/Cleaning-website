"use client";

import { useActionState, useRef, useState } from "react";
import { submitEnquiry } from "./actions";

const PROPERTY_TYPES = [
  "House",
  "Flat / apartment",
  "Office",
  "Shop / commercial",
  "Other",
];
const BEDROOMS = ["Studio", "1", "2", "3", "4", "5 or more"];
const BATHROOMS = ["1", "2", "3", "4 or more"];
const FREQUENCIES = [
  "One-off clean",
  "Weekly",
  "Fortnightly",
  "Every 4 weeks",
  "Office contract — daily",
  "Office contract — weekly",
  "Not sure yet",
];

export default function QuoteForm({
  services,
  preselected,
}: {
  services: { slug: string; name: string }[];
  preselected?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [override, setOverride] = useState(false);

  if (state?.ok && !override) {
    return (
      <div className="card border-2 border-mint bg-mint-soft p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-2xl text-mint">
          ✓
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-navy">
          Thank you — your enquiry has been received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-700">
          We aim to respond within one working day. We will review your job,
          confirm availability and send your final quote before anything is
          booked in.
        </p>
        <p className="mx-auto mt-3 max-w-md rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Your quote will arrive by email — if it is not in your inbox, please
          check your <strong>Spam</strong> or <strong>Junk</strong> folder.
        </p>
        <button
          type="button"
          onClick={() => {
            formRef.current?.reset();
            setOverride(true);
          }}
          className="btn-outline mt-6"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="card space-y-5 p-6 md:p-8">
      {state && !state.ok && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {state.error}
        </p>
      )}

      {/* Honeypot — hidden from humans, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Your name *
          </label>
          <input id="name" name="name" required maxLength={100} className="input" placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone number *
          </label>
          <input id="phone" name="phone" type="tel" required maxLength={30} className="input" placeholder="07..." />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email *
          </label>
          <input id="email" name="email" type="email" required maxLength={200} className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="postcode" className="label">
            Postcode *
          </label>
          <input id="postcode" name="postcode" required maxLength={12} className="input" placeholder="CR0 2GH" />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="label">
          Service required *
        </label>
        <select id="service" name="service" required defaultValue={preselected ?? ""} className="input">
          <option value="" disabled>
            Choose a service…
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Other / not sure">Other / not sure</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="propertyType" className="label">
            Property type *
          </label>
          <select id="propertyType" name="propertyType" required defaultValue="" className="input">
            <option value="" disabled>
              Choose…
            </option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="frequency" className="label">
            Cleaning frequency *
          </label>
          <select id="frequency" name="frequency" required defaultValue="" className="input">
            <option value="" disabled>
              Choose…
            </option>
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bedrooms" className="label">
            Bedrooms *
          </label>
          <select id="bedrooms" name="bedrooms" required defaultValue="" className="input">
            <option value="" disabled>
              Choose…
            </option>
            {BEDROOMS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bathrooms" className="label">
            Bathrooms *
          </label>
          <select id="bathrooms" name="bathrooms" required defaultValue="" className="input">
            <option value="" disabled>
              Choose…
            </option>
            {BATHROOMS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredDate" className="label">
          Preferred date <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input id="preferredDate" name="preferredDate" type="date" className="input" />
      </div>

      <div>
        <label htmlFor="extras" className="label">
          Extra tasks <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="extras"
          name="extras"
          maxLength={1000}
          className="input"
          placeholder="e.g. ironing, inside oven, inside fridge"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Short description of the job *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          maxLength={3000}
          className="input"
          placeholder="Tell us about the property and what you need done…"
        />
      </div>

      <div>
        <label htmlFor="photos" className="label">
          Photos <span className="font-normal text-slate-500">
            (optional — up to 4 images, 5MB each)
          </span>
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="input file:mr-3 file:rounded-full file:border-0 file:bg-mint-soft file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-navy"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-navy focus:ring-mint"
        />
        I agree that ZA Cleaning Co Ltd may use my details to contact me about
        this enquiry, as described in the{" "}
        <a href="/privacy" className="font-semibold text-navy underline">
          privacy notice
        </a>
        . *
      </label>

      <button type="submit" disabled={pending} className="btn-mint w-full disabled:opacity-60">
        {pending ? "Sending…" : "Send my enquiry"}
      </button>
      <p className="text-center text-xs text-slate-500">
        * Required fields. We aim to respond within one working day.
      </p>
    </form>
  );
}
