import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();
  const services = await prisma.service.findMany({
    where: { status: "published" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt="Bright, freshly cleaned London home interior"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-transparent to-navy/70" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-block rounded-full bg-mint px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-dark">
            Serving homes &amp; offices across London
          </span>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            A spotless home or office,{" "}
            <span className="text-mint">without the hassle</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            ZA Cleaning Co Ltd provides regular, one-off, deep and
            end-of-tenancy cleaning for homes, plus daily and weekly cleaning
            contracts for offices — all across London.
          </p>

          <div className="mt-8 flex flex-wrap items-start gap-3">
            <Link href="/quote" className="btn-mint">
              Get a free quote
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Contact us
            </a>
          </div>

          <p className="mt-6 text-sm font-semibold text-mint">
            {settings.responseTime}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-navy">Our services</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Every job is quoted before we start, so you always know what you
              are paying. Pick a service to see what is included.
            </p>
          </div>
          <Link href="/services" className="btn-outline">
            View all services
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-mint-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-extrabold text-navy">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Send your enquiry",
                body: "Fill in the quote form or message us on WhatsApp with a few details about the property.",
              },
              {
                step: "2",
                title: "Get your quote",
                body: "We review the job, confirm availability and send your final price before any work begins.",
              },
              {
                step: "3",
                title: "We clean",
                body: "Once you are happy, we carry out the clean. Pay by bank transfer after the quote is confirmed.",
              },
            ].map((item) => (
              <div key={item.step} className="card">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-lg font-bold text-mint">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office cleaning band */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-navy p-8 text-white md:grid-cols-2 md:p-12">
          <div>
            <h2 className="text-3xl font-extrabold">
              Office cleaning on a{" "}
              <span className="text-mint">weekly or daily contract</span>
            </h2>
            <p className="mt-4 leading-7 text-white/85">
              Keep your workplace presentable every day of the week. We build a
              contract around your hours, your team and your budget — with one
              point of contact for everything.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quote?service=office-cleaning" className="btn-mint">
                Request a contract quote
              </Link>
              <Link
                href="/services#office-cleaning"
                className="inline-flex items-center rounded-full border-2 border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
              >
                What&apos;s included
              </Link>
            </div>
          </div>
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-72">
            <Image
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="Clean modern London office space"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Quotes before work starts",
              body: "No surprises. You approve the final price before we begin.",
            },
            {
              title: "Homes and offices",
              body: "One company for your house clean and your office contract.",
            },
            {
              title: "Built around you",
              body: "One-off, weekly, fortnightly or daily — you choose the schedule.",
            },
            {
              title: "Simple to reach",
              body: `Call, WhatsApp or email — ${settings.responseTime.toLowerCase()}`,
            },
          ].map((item) => (
            <div key={item.title}>
              <span className="inline-block h-2.5 w-10 rounded-full bg-mint" />
              <h3 className="mt-4 font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mint">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-navy-dark">
            Ready for a cleaner space?
          </h2>
          <p className="max-w-xl text-navy-dark/80">
            Tell us about your property and we will get back to you with a
            clear price. {settings.responseTime}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-dark"
            >
              Get a quote
            </Link>
            <a
              href="#contact"
              className="rounded-full border-2 border-navy px-7 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
