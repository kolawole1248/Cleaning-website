import Link from "next/link";
import { prisma } from "@/lib/db";
import StatusBadge from "@/components/StatusBadge";
import { saveService, setServiceStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  const editing = params.edit
    ? services.find((s) => s.id === params.edit)
    : undefined;
  const showForm = Boolean(editing) || params.new !== undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">
            Services &amp; prices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Everything you change here appears on the website immediately after
            you press Save.
          </p>
        </div>
        {!showForm && (
          <Link href="/admin/services?new=1" className="btn-mint">
            + Add a service
          </Link>
        )}
      </div>

      {params.saved && (
        <p className="rounded-lg border border-mint-dark bg-mint-soft px-4 py-3 text-sm font-semibold text-navy">
          ✓ Saved — the website has been updated.
        </p>
      )}
      {params.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {params.error}
        </p>
      )}

      {showForm ? (
        <form action={saveService} className="card space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">
              {editing ? `Edit: ${editing.name}` : "New service"}
            </h2>
            <Link
              href="/admin/services"
              className="text-sm font-semibold text-slate-500 hover:text-navy"
            >
              Cancel
            </Link>
          </div>

          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Service name *</label>
              <input id="name" name="name" required maxLength={120} defaultValue={editing?.name ?? ""} className="input" placeholder="Regular domestic cleaning" />
            </div>
            <div>
              <label className="label" htmlFor="slug">URL slug</label>
              <input id="slug" name="slug" maxLength={120} defaultValue={editing?.slug ?? ""} className="input" placeholder="regular-domestic-cleaning" />
              <p className="mt-1 text-xs text-slate-500">
                Leave blank to generate automatically.
              </p>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="summary">
              Short summary (shown on cards) *
            </label>
            <input id="summary" name="summary" maxLength={400} defaultValue={editing?.summary ?? ""} className="input" placeholder="A quick line describing this service" />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Full description
            </label>
            <textarea id="description" name="description" rows={4} maxLength={3000} defaultValue={editing?.description ?? ""} className="input" />
          </div>

          <div>
            <label className="label" htmlFor="includes">
              What&apos;s included (one item per line)
            </label>
            <textarea id="includes" name="includes" rows={6} defaultValue={editing?.includes ?? ""} className="input" placeholder={"Dusting all surfaces\nVacuuming and mopping\nKitchen cleaned"} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="priceLabel">
                Price shown on site *
              </label>
              <input id="priceLabel" name="priceLabel" maxLength={120} defaultValue={editing?.priceLabel ?? ""} className="input" placeholder="From £25 per cleaner-hour" />
            </div>
            <div>
              <label className="label" htmlFor="priceNote">
                Price note (small text)
              </label>
              <input id="priceNote" name="priceNote" maxLength={120} defaultValue={editing?.priceNote ?? ""} className="input" placeholder="Minimum 2 hours" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={editing?.status ?? "published"} className="input">
                <option value="published">Published</option>
                <option value="coming-soon">Coming soon</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="order">Sort order</label>
              <input id="order" name="order" type="number" defaultValue={editing?.order ?? 0} className="input" />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-navy">
                <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="h-4 w-4 rounded border-slate-300" />
                Feature on home page
              </label>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image">Image URL</label>
            <input id="image" name="image" maxLength={500} defaultValue={editing?.image ?? ""} className="input" placeholder="https://…" />
            <p className="mt-1 text-xs text-slate-500">
              Paste a link to a photo (e.g. from Unsplash) or an image you have
              uploaded.
            </p>
          </div>

          <button type="submit" className="btn-navy">
            Save service
          </button>
        </form>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Price shown</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy">{service.name}</p>
                    <p className="text-xs text-slate-500">/{service.slug}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy">
                    {service.priceLabel}
                    {service.priceNote && (
                      <span className="block text-xs font-normal text-slate-500">
                        {service.priceNote}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/services?edit=${service.id}`}
                        className="rounded-full border border-navy px-3 py-1 text-xs font-bold text-navy hover:bg-navy hover:text-white"
                      >
                        Edit
                      </Link>
                      {service.status !== "published" && (
                        <form action={setServiceStatus}>
                          <input type="hidden" name="id" value={service.id} />
                          <input type="hidden" name="status" value="published" />
                          <button className="cursor-pointer rounded-full bg-mint px-3 py-1 text-xs font-bold text-navy-dark hover:bg-mint-dark">
                            Publish
                          </button>
                        </form>
                      )}
                      {service.status === "published" && (
                        <form action={setServiceStatus}>
                          <input type="hidden" name="id" value={service.id} />
                          <input type="hidden" name="status" value="hidden" />
                          <button className="cursor-pointer rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100">
                            Hide
                          </button>
                        </form>
                      )}
                    </div>
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
