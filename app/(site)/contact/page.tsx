import type { Metadata } from "next";
import Link from "next/link";
import { getSettings, whatsappLink } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Contact ZA Cleaning Co Ltd by phone, WhatsApp or email. We aim to respond within one working day, covering homes and offices across London.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const methods = [
    {
      title: "Phone",
      value: settings.phone,
      href: `tel:${settings.phoneDial}`,
      note: "Tap to call — also our WhatsApp number",
    },
    {
      title: "WhatsApp",
      value: "Chat on WhatsApp",
      href: whatsappLink(
        settings,
        "Hello ZA Cleaning, I would like a quote please."
      ),
      note: "Quick messages and photos of your job",
    },
    {
      title: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: "For documents and detailed enquiries",
    },
    {
      title: "Instagram",
      value: `@${settings.instagram}`,
      href: `https://instagram.com/${settings.instagram}`,
      note: "See our latest work",
    },
  ];

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Contact us</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">
            Reach us any way you like — {settings.responseTime.toLowerCase()}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {methods.map((method) => {
            const external = method.href.startsWith("http");
            return (
              <a
                key={method.title}
                href={method.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="rounded-3xl border border-slate-200 bg-mint-soft p-8 transition-colors hover:border-navy"
              >
                <p className="font-bold text-navy">{method.title}</p>
                <p className="mt-2 break-words text-xl font-extrabold text-navy underline decoration-mint decoration-4 underline-offset-4">
                  {method.value}
                </p>
                <p className="mt-2 text-sm text-slate-600">{method.note}</p>
              </a>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-extrabold text-navy">
            Areas we cover
          </h2>
          <p className="mt-3 text-lg leading-8 text-slate-700">
            We clean homes and offices across {settings.serviceArea}. If you
            are not sure whether we cover your area, just send us your postcode
            — we will let you know straight away.
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
            <div className="sm:col-span-2">
              <dt className="font-bold text-navy">Registered office</dt>
              <dd className="text-slate-700">{settings.registeredOffice}</dd>
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
