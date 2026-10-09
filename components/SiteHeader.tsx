"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/prices", label: "Prices" },
  { href: "/about", label: "About us" },
  { href: "/quote", label: "Get a quote" },
];

export default function SiteHeader({
  phone,
  phoneDial,
}: {
  phone: string;
  phoneDial: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="ZA Cleaning Co — home" className="shrink-0">
          <Image
            src="/za-logo.jpg"
            alt="ZA Cleaning Co"
            width={224}
            height={96}
            className="h-16 w-auto md:h-[4.5rem]"
            priority
          />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-mint-soft text-navy"
                    : "text-navy hover:bg-mint-soft hover:text-navy-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${phoneDial}`}
            className="rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Call {phone}
          </a>
          <Link
            href="/quote"
            className="rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-navy-dark transition-colors hover:bg-mint-dark"
          >
            Get a quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg border border-slate-300 p-2 text-navy lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-semibold text-navy hover:bg-mint-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-3">
            <a
              href={`tel:${phoneDial}`}
              className="flex-1 rounded-full border-2 border-navy px-4 py-2.5 text-center text-sm font-semibold text-navy"
            >
              Call us
            </a>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-mint px-4 py-2.5 text-center text-sm font-bold text-navy-dark"
            >
              Get a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
