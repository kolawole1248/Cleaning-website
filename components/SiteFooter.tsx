import Link from "next/link";
import { whatsappLink } from "@/lib/data";
import type { Settings } from "@/lib/data";

export default function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-xl font-extrabold tracking-wide">ZA CLEANING CO.</p>
          <p className="mt-3 text-sm leading-6 text-white/80">
            Professional house and office cleaning across {settings.serviceArea}.
            Clear quotes before any work starts.
          </p>
        </div>

        <nav aria-label="Footer services">
          <p className="mb-3 font-bold text-mint">Services</p>
          <ul className="space-y-2 text-sm text-white/85">
            <li><Link className="hover:text-mint" href="/services#regular-domestic-cleaning">Regular domestic cleaning</Link></li>
            <li><Link className="hover:text-mint" href="/services#one-off-cleaning">One-off cleaning</Link></li>
            <li><Link className="hover:text-mint" href="/services#deep-cleaning">Deep cleaning</Link></li>
            <li><Link className="hover:text-mint" href="/services#end-of-tenancy-cleaning">End-of-tenancy cleaning</Link></li>
            <li><Link className="hover:text-mint" href="/services#office-cleaning">Office cleaning</Link></li>
          </ul>
        </nav>

        <nav aria-label="Footer company">
          <p className="mb-3 font-bold text-mint">Company</p>
          <ul className="space-y-2 text-sm text-white/85">
            <li><Link className="hover:text-mint" href="/prices">Prices</Link></li>
            <li><Link className="hover:text-mint" href="/about">About us</Link></li>
            <li><Link className="hover:text-mint" href="/quote">Get a quote</Link></li>
            <li><Link className="hover:text-mint" href="/privacy">Privacy notice</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 font-bold text-mint">Contact</p>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <Link className="hover:text-mint" href="/contact">
                Contact us — all details
              </Link>
            </li>
            <li>
              <a className="hover:text-mint" href={`tel:${settings.phoneDial}`}>
                {settings.phone}
              </a>{" "}
              (phone & WhatsApp)
            </li>
            <li>
              <a className="hover:text-mint" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </li>
            <li>
              <a
                className="hover:text-mint"
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{settings.instagram}
              </a>
            </li>
            <li>
              <a
                className="hover:text-mint"
                href={whatsappLink(settings, "Hello ZA Cleaning, I would like a quote please.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </li>
            <li className="text-white/70">{settings.registeredOffice}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-5 text-white/70">
          <p>
            {settings.companyName} is a company registered in{" "}
            {settings.registrationPlace} with company number{" "}
            {settings.companyNumber}. Registered office: {settings.registeredOffice}.
          </p>
          <p className="mt-2">
            © {year} {settings.companyName}. All rights reserved. ·{" "}
            <Link href="/privacy" className="underline hover:text-mint">
              Privacy notice
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
