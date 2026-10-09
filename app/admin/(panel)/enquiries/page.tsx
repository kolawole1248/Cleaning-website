import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import StatusBadge from "@/components/StatusBadge";
import { deleteEnquiry, sendQuote, updateEnquiry } from "../actions";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "", label: "All" },
  { key: "new", label: "New" },
  { key: "reviewing", label: "Reviewing" },
  { key: "quoted", label: "Quoted" },
  { key: "booked", label: "Booked" },
  { key: "closed", label: "Closed" },
];

function formatDate(date: Date) {
  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string;
    status?: string;
    confirm?: string;
    quoteSent?: string;
  }>;
}) {
  const params = await searchParams;

  // ---------- detail view ----------
  if (params.id) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id: params.id } });
    if (!enquiry) {
      return (
        <div className="card">
          <p className="text-slate-600">That enquiry no longer exists.</p>
          <Link href="/admin/enquiries" className="btn-navy mt-4">
            Back to enquiries
          </Link>
        </div>
      );
    }

    let photos: string[] = [];
    try {
      photos = JSON.parse(enquiry.photos);
    } catch {
      photos = [];
    }

    const rows: [string, string][] = [
      ["Received", formatDate(enquiry.createdAt)],
      ["Name", enquiry.name],
      ["Phone", enquiry.phone],
      ["Email", enquiry.email],
      ["Postcode", enquiry.postcode],
      ["Service", enquiry.service],
      ["Property type", enquiry.propertyType],
      ["Bedrooms", enquiry.bedrooms],
      ["Bathrooms", enquiry.bathrooms],
      ["Frequency", enquiry.frequency],
      ["Preferred date", enquiry.preferredDate || "—"],
      ["Extra tasks", enquiry.extras || "—"],
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-navy">{enquiry.name}</h1>
            <p className="text-sm text-slate-500">{enquiry.service}</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-sm font-bold text-navy underline decoration-mint decoration-2 underline-offset-4"
          >
            ← Back to all enquiries
          </Link>
        </div>

        {params.quoteSent === "1" && (
          <p className="rounded-lg border border-mint-dark bg-mint-soft px-4 py-3 text-sm font-semibold text-navy">
            ✅ Quote sent — the customer received it by email (if SMTP is
            configured). It is also saved below.
          </p>
        )}
        {params.quoteSent === "0" && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            ⚠️ Quote saved, but the email could not be sent — SMTP is not
            configured yet (see HANDOVER.md section 6). The quote details are
            saved below so you can send them manually.
          </p>
        )}
        {params.quoteSent === "missing" && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Please enter a price before sending the quote.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-lg font-bold text-navy">Job details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[140px_1fr] gap-2 border-b border-slate-100 pb-2"
                >
                  <dt className="font-semibold text-slate-500">{label}</dt>
                  <dd className="text-navy">{value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-5 font-bold text-navy">Description</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {enquiry.description}
            </p>

            {photos.length > 0 && (
              <>
                <h3 className="mt-5 font-bold text-navy">Photos</h3>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {photos.map((src) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-24 overflow-hidden rounded-lg border border-slate-200"
                    >
                      <Image
                        src={src}
                        alt="Customer uploaded photo"
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </a>
                  ))}
                </div>
              </>
            )}

            <p className="mt-4 flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-500">Status:</span>
              <StatusBadge status={enquiry.status} />
            </p>
          </div>

          <div className="space-y-6">
            <form action={sendQuote} className="card space-y-4">
              <input type="hidden" name="id" value={enquiry.id} />
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-navy">Send a quote</h2>
                {enquiry.quoteSentAt && (
                  <span className="rounded-full bg-mint-soft px-3 py-1 text-xs font-bold text-navy">
                    Sent {formatDate(enquiry.quoteSentAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">
                The customer gets a branded email with this price and your
                bank transfer details. A
                <strong className="text-navy"> Pay by debit card</strong> button
                (Stripe) appears automatically once card payments are switched
                on later.
              </p>
              <div>
                <label className="label" htmlFor="quotePrice">
                  Price
                </label>
                <input
                  id="quotePrice"
                  name="price"
                  className="input"
                  defaultValue={enquiry.quotePrice}
                  placeholder="e.g. £180 or 240"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="quoteMessage">
                  Message to the customer
                </label>
                <textarea
                  id="quoteMessage"
                  name="message"
                  rows={4}
                  className="input"
                  defaultValue={
                    enquiry.quoteMessage ||
                    `Hi ${enquiry.name.split(" ")[0]}, thank you for your enquiry. Your ${enquiry.service.toLowerCase()} is confirmed at the price above. We will contact you to arrange a suitable date.`
                  }
                />
              </div>
              <button type="submit" className="btn-mint w-full">
                ✉️ Send quote by email
              </button>
            </form>

            <form action={updateEnquiry} className="card space-y-4">
              <input type="hidden" name="id" value={enquiry.id} />

              <div>
                <label className="label" htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={enquiry.status}
                  className="input"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked">Booked</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="notes">
                  Private notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={5}
                  defaultValue={enquiry.notes}
                  className="input"
                  placeholder="Price sent, follow up Friday…"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Only you can see these notes.
                </p>
              </div>

              <button type="submit" className="btn-navy">
                Save changes
              </button>
            </form>

            <div className="card space-y-3">
              <h2 className="text-lg font-bold text-navy">Contact the customer</h2>
              <a href={`tel:${enquiry.phone}`} className="btn-outline w-full">
                📞 Call {enquiry.phone}
              </a>
              <a href={`mailto:${enquiry.email}`} className="btn-outline w-full">
                ✉️ Email {enquiry.email}
              </a>

              <div className="pt-3">
                {params.confirm === enquiry.id ? (
                  <form action={deleteEnquiry} className="space-y-2">
                    <input type="hidden" name="id" value={enquiry.id} />
                    <p className="text-sm font-semibold text-red-700">
                      Delete this enquiry permanently? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button className="cursor-pointer rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
                        Yes, delete
                      </button>
                      <Link
                        href={`/admin/enquiries?id=${enquiry.id}`}
                        className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-600"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                ) : (
                  <Link
                    href={`/admin/enquiries?id=${enquiry.id}&confirm=${enquiry.id}`}
                    className="text-sm font-semibold text-red-600 underline"
                  >
                    Delete enquiry
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- list view ----------
  const where = params.status ? { status: params.status } : {};
  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Enquiries</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every quote request from the website, newest first.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.key}
            href={filter.key ? `/admin/enquiries?status=${filter.key}` : "/admin/enquiries"}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              (params.status ?? "") === filter.key
                ? "bg-navy text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:border-navy"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {enquiries.length === 0 ? (
        <div className="card text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-3 font-semibold text-navy">No enquiries here yet</p>
          <p className="mt-1 text-sm text-slate-500">
            When customers submit the quote form on your website, they appear
            here and arrive in your business email.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Postcode</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries?id=${enquiry.id}`}
                      className="font-semibold text-navy underline decoration-mint decoration-2 underline-offset-4"
                    >
                      {enquiry.name}
                    </Link>
                    <p className="text-xs text-slate-500">{enquiry.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{enquiry.service}</td>
                  <td className="px-4 py-3 text-slate-700">{enquiry.postcode}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={enquiry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
