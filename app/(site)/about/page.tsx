import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About us",
  description:
    "ZA Cleaning Co Ltd is a London cleaning company offering domestic and office cleaning with clear quotes before any work starts.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">About us</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="space-y-5 text-lg leading-8 text-slate-700">
          <p>
            ZA Cleaning Co Ltd is a cleaning company based in Croydon, serving
            homes and offices across {settings.serviceArea}.
          </p>
          <p>
            We provide regular domestic cleaning, one-off cleans, deep
            cleaning, end-of-tenancy cleaning and office cleaning — including
            weekly and daily contracts for businesses.
          </p>
          <p>
            Our approach is simple: tell us about the job, and we will send
            you a clear quote before any work starts. Once you are happy with
            the price, we confirm availability and get your clean booked in.
          </p>
          <p>
            We believe good communication matters — that is why you can reach
            us by phone, WhatsApp or email, and {settings.responseTime.toLowerCase()}
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-mint-soft p-8">
          <h2 className="text-xl font-extrabold text-navy">
            Company information
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold text-navy">Company name</dt>
              <dd className="text-slate-700">{settings.companyName}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Company number</dt>
              <dd className="text-slate-700">{settings.companyNumber}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Registered office</dt>
              <dd className="text-slate-700">{settings.registeredOffice}</dd>
            </div>
            <div>
              <dt className="font-bold text-navy">Place of registration</dt>
              <dd className="text-slate-700">{settings.registrationPlace}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/quote" className="btn-navy">
            Get a quote
          </Link>
          <Link href="/services" className="btn-outline">
            See our services
          </Link>
        </div>
      </section>
    </>
  );
}
