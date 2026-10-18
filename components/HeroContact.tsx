"use client";

import { useState } from "react";

export default function HeroContact({
  phone,
  phoneDial,
  email,
}: {
  phone: string;
  phoneDial: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="hero-contact-panel"
        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
      >
        Contact us
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          id="hero-contact-panel"
          className="absolute left-0 top-full z-20 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-white p-5 text-navy shadow-xl"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reach us directly
          </p>
          <a
            href={`tel:${phoneDial}`}
            className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-mint-soft px-4 py-3 font-bold text-navy transition-colors hover:bg-mint"
          >
            <span>{phone}</span>
            <span className="text-xs font-semibold">Call</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-mint-soft px-4 py-3 font-semibold text-navy transition-colors hover:bg-mint"
          >
            <span className="break-all">{email}</span>
            <span className="text-xs font-semibold">Email</span>
          </a>
          <p className="mt-3 text-xs text-slate-500">
            We aim to respond within one working day.
          </p>
        </div>
      )}
    </div>
  );
}
