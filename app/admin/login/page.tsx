import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="rounded-2xl bg-white p-3">
            <Image
              src="/za-logo.jpg"
              alt="ZA Cleaning Co"
              width={140}
              height={60}
              className="h-20 w-auto"
            />
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-mint">
            Admin panel
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-xl font-extrabold text-navy">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">
            Staff and owner access only.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          <Link href="/" className="underline hover:text-mint">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
