import Link from "next/link";
import { prisma } from "@/lib/db";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [newEnquiries, totalEnquiries, publishedServices] = await Promise.all([
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.enquiry.count(),
    prisma.service.count({ where: { status: "published" } }),
  ]);

  const recent = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries?status=new" },
    { label: "Total enquiries", value: totalEnquiries, href: "/admin/enquiries" },
    { label: "Published services", value: publishedServices, href: "/admin/services" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here is what is happening on your website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card hover:border-mint">
            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-2 text-4xl font-extrabold text-navy">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Recent enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="text-sm font-bold text-navy underline decoration-mint decoration-2 underline-offset-4"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No enquiries yet. They will appear here as soon as customers submit
            the quote form.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recent.map((enquiry) => (
              <li key={enquiry.id} className="py-3">
                <Link
                  href={`/admin/enquiries?id=${enquiry.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-navy">
                      {enquiry.name}{" "}
                      <span className="font-normal text-slate-500">
                        · {enquiry.service}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(enquiry.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      · {enquiry.postcode} · {enquiry.phone}
                    </p>
                  </div>
                  <StatusBadge status={enquiry.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/services" className="card hover:border-mint">
          <h3 className="font-bold text-navy">✏️ Edit services & prices</h3>
          <p className="mt-1 text-sm text-slate-600">
            Change what each service says, what it includes and the price shown
            on the site.
          </p>
        </Link>
        <Link href="/admin/settings" className="card hover:border-mint">
          <h3 className="font-bold text-navy">⚙️ Site settings</h3>
          <p className="mt-1 text-sm text-slate-600">
            Phone number, email, Instagram, payment details and your password.
          </p>
        </Link>
      </div>
    </div>
  );
}
