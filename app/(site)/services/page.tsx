import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings, whatsappLink } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cleaning services in London",
  description:
    "Regular domestic cleaning, one-off cleaning, deep cleaning, end-of-tenancy cleaning and office cleaning contracts across London. See exactly what is included.",
};

export default async function ServicesPage() {
  const settings = await getSettings();
  const services = await prisma.service.findMany({
    where: { status: { in: ["published", "coming-soon"] } },
    orderBy: { order: "asc" },
  });
  const published = services.filter((s) => s.status === "published");
  const comingSoon = services.filter((s) => s.status === "coming-soon");

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Our cleaning services</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Everything we offer for homes and offices across London — with a
            clear list of what&apos;s included in each clean.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {published.map((service, index) => {
          const includes = service.includes
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

          return (
            <section
              key={service.slug}
              id={service.slug}
              className="scroll-mt-24 border-b border-slate-200 py-14 last:border-b-0"
            >
              <div
                className={`grid items-center gap-8 md:grid-cols-2 ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative h-64 overflow-hidden rounded-3xl bg-mint-soft md:h-80">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      ✨
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-navy md:text-3xl">
                    {service.name}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>

                  {includes.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <span
                            aria-hidden
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint text-xs font-bold text-navy-dark"
                          >
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-mint-soft px-4 py-2 text-sm font-bold text-navy">
                      {service.priceLabel}
                      {service.priceNote ? ` · ${service.priceNote}` : ""}
                    </span>
                    <Link
                      href={`/quote?service=${encodeURIComponent(service.slug)}`}
                      className="btn-navy"
                    >
                      Get a quote
                    </Link>
                    <a
                      href={whatsappLink(
                        settings,
                        `Hello ZA Cleaning, I would like a quote for ${service.name.toLowerCase()} please.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-navy underline decoration-mint decoration-2 underline-offset-4"
                    >
                      Or message us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {comingSoon.length > 0 && (
        <section className="bg-mint-soft">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="text-2xl font-extrabold text-navy">
              Coming soon
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              We are confirming the details of these services before they go
              live. Message us if you need one — we will let you know as soon
              as it is available.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {comingSoon.map((service) => (
                <li
                  key={service.slug}
                  className="rounded-full border border-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-navy"
                >
                  {service.name}
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink(
                settings,
                "Hello ZA Cleaning, do you offer the following service? "
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block btn-outline bg-white"
            >
              Ask us on WhatsApp
            </a>
          </div>
        </section>
      )}
    </>
  );
}
