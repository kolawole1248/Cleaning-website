import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cleaning prices in London",
  description:
    "Starting prices for regular domestic cleaning from £25 per cleaner-hour, one-off cleaning from £30 per cleaner-hour, deep cleaning, end-of-tenancy and office contracts. Final quotes confirmed before work starts.",
};

export default async function PricesPage() {
  const settings = await getSettings();
  const services = await prisma.service.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Prices</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Our starting prices below give you a clear idea of cost. The final
            quote depends on the job — size of the property, condition and
            anything extra you ask for — and is always confirmed in writing
            before we start.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.slug}
              className="card flex flex-col border-t-4 border-t-mint"
            >
              <h2 className="text-lg font-bold text-navy">{service.name}</h2>
              <p className="mt-3 text-2xl font-extrabold text-navy">
                {service.priceLabel}
              </p>
              {service.priceNote && (
                <p className="mt-1 text-sm font-semibold text-mint-dark">
                  {service.priceNote}
                </p>
              )}
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {service.summary}
              </p>
              <Link
                href={`/quote?service=${encodeURIComponent(service.slug)}`}
                className="btn-outline mt-5"
              >
                Get a quote
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-2xl bg-mint-soft px-5 py-4 text-sm text-navy">
          <strong>Please note:</strong> prices shown are starting figures and
          the final quote depends on the job. We review every enquiry and send
          your confirmed price before any work takes place.
        </p>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-extrabold text-navy">
            How you can pay
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="card">
              <h3 className="font-bold text-navy">Bank transfer</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Pay by BACS transfer after your quote is confirmed. Bank
                details are included with your quote.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-navy">Debit card (coming soon)</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Online card payments are coming soon. For now, pay securely by
                bank transfer — details are included with your quote.
              </p>
            </div>
            <div className="card">
              <h3 className="font-bold text-navy">After the quote</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Nothing is charged when you enquire — you only pay once you
                are happy with the price we send you.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-navy p-8 text-center text-white">
            <h2 className="text-2xl font-extrabold">
              Want an exact price for your property?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-white/85">
              Send a few details and we will come back to you with a fixed
              quote. {settings.responseTime}
            </p>
            <Link href="/quote" className="btn-mint mt-6">
              Get my quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
