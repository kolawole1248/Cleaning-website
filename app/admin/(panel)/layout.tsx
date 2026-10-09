import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";
import AdminNav from "@/components/AdminNav";

// Belt and braces: robots.txt already disallows /admin — this also tells
// Google not to index the admin panel pages if someone links to them.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 pt-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="rounded-lg bg-white p-1.5">
                <Image
                  src="/za-logo.jpg"
                  alt="ZA Cleaning Co"
                  width={96}
                  height={40}
                  className="h-10 w-auto"
                />
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-mint">
                Admin panel
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">
              {session.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="rounded-full border border-white/40 px-4 py-1.5 font-semibold text-white hover:bg-white hover:text-navy"
            >
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-mint px-4 py-1.5 font-bold text-navy-dark hover:bg-mint-dark"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <AdminNav />
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
