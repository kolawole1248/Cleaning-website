import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist — head back to ZA Cleaning Co.",
};

export default function NotFound() {
  return (
    <>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="text-4xl font-extrabold">Page not found</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Sorry — the page you are looking for does not exist or may have
            moved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="card max-w-xl">
          <p className="text-sm leading-6 text-slate-600">
            You can head back to the homepage, browse our cleaning services or
            ask us for a quote — we aim to respond within one working day.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/" className="btn-navy">
              Back to homepage
            </Link>
            <Link href="/services" className="btn-outline">
              Our services
            </Link>
            <Link href="/quote" className="btn-mint">
              Get a quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
