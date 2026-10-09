import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How ZA Cleaning Co Ltd collects, uses and protects your personal information when you enquire about cleaning services.",
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Privacy notice</h1>
          <p className="mt-3 text-white/80">Last updated: October 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-8 px-4 py-14 text-slate-700">
        <section>
          <h2 className="text-xl font-extrabold text-navy">
            1. Who we are
          </h2>
          <p className="mt-2 leading-7">
            {settings.companyName} (&quot;we&quot;, &quot;us&quot;) is the data
            controller for your personal information. Our registered office is{" "}
            {settings.registeredOffice}, company number{" "}
            {settings.companyNumber}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">
            2. What we collect
          </h2>
          <p className="mt-2 leading-7">When you send an enquiry or quote request, we collect:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 leading-7">
            <li>Your name, phone number and email address</li>
            <li>Your postcode and property details (type, bedrooms, bathrooms)</li>
            <li>The service you are interested in and how often you want it</li>
            <li>Any extra tasks, preferred dates and description you provide</li>
            <li>Photos you choose to upload showing the property</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">
            3. Why we use it
          </h2>
          <p className="mt-2 leading-7">
            We use this information to respond to your enquiry, prepare and send
            your quote, arrange and carry out cleaning work you book, and keep a
            record of communications with you. Our lawful basis is taking steps
            at your request before entering a contract, and our legitimate
            interest in running our business.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">
            4. Who we share it with
          </h2>
          <p className="mt-2 leading-7">
            We do not sell your data. We only share it with service providers
            strictly needed to run the business — for example our email provider
            for enquiry notifications and, if you choose to pay by card, our
            payment provider (Stripe). We may share information where the law
            requires it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">
            5. How long we keep it
          </h2>
          <p className="mt-2 leading-7">
            Enquiries that do not become bookings are kept for up to 24 months.
            Records connected to work we carry out are kept as long as needed
            for accounting and legal obligations, then deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">6. Your rights</h2>
          <p className="mt-2 leading-7">Under UK data protection law you can:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 leading-7">
            <li>Ask for a copy of the data we hold about you</li>
            <li>Ask us to correct anything inaccurate</li>
            <li>Ask us to delete your data</li>
            <li>Object to or restrict how we use it</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2 leading-7">
            To exercise any of these, contact us at{" "}
            <a className="font-semibold text-navy underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
            . You can also complain to the Information Commissioner&apos;s Office
            (ICO) at ico.org.uk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">7. Cookies</h2>
          <p className="mt-2 leading-7">
            This website only uses essential cookies needed for the site to work
            and for the admin area to stay secure. We do not use advertising or
            tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">8. Security</h2>
          <p className="mt-2 leading-7">
            Your enquiry is sent over an encrypted connection (HTTPS), stored
            securely and only accessible to our team. Photos you upload are used
            only to understand your job.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-navy">9. Contact us</h2>
          <p className="mt-2 leading-7">
            Questions about this notice? Email{" "}
            <a className="font-semibold text-navy underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
            , call{" "}
            <a className="font-semibold text-navy underline" href={`tel:${settings.phoneDial}`}>
              {settings.phone}
            </a>{" "}
            or WhatsApp us.
          </p>
        </section>

        <Link href="/quote" className="btn-navy inline-flex">
          Back to getting a quote
        </Link>
      </article>
    </>
  );
}
