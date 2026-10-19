import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute URLs (canonical links, og:image, sitemap) always resolve to
  // the real domain, never to the per-deployment Vercel URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZA Cleaning Co | House & Office Cleaning in London",
    template: "%s | ZA Cleaning Co",
  },
  description:
    "Professional domestic and office cleaning across London. Regular, one-off, deep and end-of-tenancy cleaning with clear quotes. Get a quote within one working day.",
  keywords: [
    "cleaning company London",
    "house cleaning London",
    "office cleaning London",
    "end of tenancy cleaning London",
    "deep cleaning London",
    "regular domestic cleaning",
  ],
  openGraph: {
    title: "ZA Cleaning Co | House & Office Cleaning in London",
    description:
      "Professional domestic and office cleaning across London. Clear quotes before any work starts.",
    type: "website",
    locale: "en_GB",
    siteName: "ZA Cleaning Co",
    images: [{ url: "/za-logo.jpg", width: 1179, height: 1179, alt: "ZA Cleaning Co" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/za-logo.jpg"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CleaningService",
  name: "ZA Cleaning Co Ltd",
  url: SITE_URL,
  image: `${SITE_URL}/za-logo.jpg`,
  telephone: "+447377372889",
  email: "zacleans26@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Flat 268 Pinnacle Apartment, Saffron Square",
    addressLocality: "Croydon",
    postalCode: "CR0 2GH",
    addressCountry: "GB",
  },
  areaServed: { "@type": "City", name: "London" },
  priceRange: "From £25",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
