import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getSettings, whatsappLink } from "@/lib/data";
import QuoteForm from "./QuoteForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get a quote — house & office cleaning in London",
  description:
    "Request a free quote for domestic, deep, end-of-tenancy or office cleaning in London. Call 07377 372889, WhatsApp us, or send the enquiry form — we respond within one working day.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const settings = await getSettings();
  const { service } = await searchParams;

  const services = await prisma.service.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });

  // Preselect when arriving from a "Get a quote" link on a service card
  const preselected = services.find((s) => s.slug === service)?.name;

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Get a quote</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Tell us about your property and what you need. We review every
            enquiry and send your final price before any work starts.{" "}
            {settings.responseTime}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1.5fr_1fr]">
        <QuoteForm services={services} preselected={preselected} />

        <aside className="space-y-5">
          <div className="card">
            <h2 className="text-lg font-bold text-navy">Prefer to talk?</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${settings.phoneDial}`}
                  className="flex items-center gap-3 font-semibold text-navy hover:text-navy-light"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft text-lg">
                    📞
                  </span>
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(
                    settings,
                    "Hello ZA Cleaning, I would like a quote please."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-semibold text-navy hover:text-navy-light"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft text-lg">
                    💬
                  </span>
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 font-semibold text-navy hover:text-navy-light"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft text-lg">
                    ✉️
                  </span>
                  {settings.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-semibold text-navy hover:text-navy-light"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-soft">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-navy"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </span>
                  @{settings.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-navy">What happens next?</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
              <li>We review your job details.</li>
              <li>We confirm availability.</li>
              <li>We send your final quote in writing.</li>
              <li>Only then do you book — and pay after the quote.</li>
            </ol>
            <p className="mt-4 rounded-lg bg-mint-soft px-4 py-3 text-sm font-semibold text-navy">
              {settings.responseTime}
            </p>
          </div>

          <div className="relative h-52 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80"
              alt="Professional cleaning supplies ready for a job"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </aside>
      </section>
    </>
  );
}
