import { prisma } from "@/lib/db";

// Defaults used until the owner edits them in the admin panel.
export const DEFAULT_SETTINGS: Record<string, string> = {
  phone: "07377 372889",
  phoneDial: "+447377372889",
  whatsapp: "447377372889",
  email: "zacleans26@gmail.com",
  instagram: "zacleans26",
  serviceArea: "London",
  responseTime: "We aim to respond within one working day.",
  companyName: "ZA Cleaning Co Ltd",
  companyNumber: "17501743",
  registrationPlace: "England and Wales",
  registeredOffice:
    "Flat 268 Pinnacle Apartment, Saffron Square, Croydon, England CR0 2GH",
  bankName: "",
  accountName: "",
  sortCode: "",
  accountNumber: "",
  stripeLink: "",
};

export type Settings = Record<string, string>;

export async function getSettings(): Promise<Settings> {
  try {
    const rows = await prisma.setting.findMany();
    const fromDb: Settings = {};
    for (const row of rows) fromDb[row.key] = row.value;
    return { ...DEFAULT_SETTINGS, ...fromDb };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function whatsappLink(settings: Settings, message?: string): string {
  const base = `https://wa.me/${settings.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const DEFAULT_SERVICES = [
  {
    slug: "regular-domestic-cleaning",
    name: "Regular domestic cleaning",
    priceLabel: "From £25 per cleaner-hour",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "one-off-cleaning",
    name: "One-off cleaning",
    priceLabel: "From £30 per cleaner-hour",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "deep-cleaning",
    name: "Deep cleaning",
    priceLabel: "Get a quote",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "end-of-tenancy-cleaning",
    name: "End-of-tenancy cleaning",
    priceLabel: "Fixed quote",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "office-cleaning",
    name: "Office cleaning",
    priceLabel: "Contract quote",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    slug: "post-construction-cleaning",
    name: "Post-construction cleaning",
    priceLabel: "Coming soon",
    image: "",
    featured: false,
  },
  {
    slug: "carpet-and-upholstery-cleaning",
    name: "Carpet and upholstery cleaning",
    priceLabel: "Coming soon",
    image: "",
    featured: false,
  },
  {
    slug: "window-cleaning",
    name: "Window cleaning",
    priceLabel: "Coming soon",
    image: "",
    featured: false,
  },
  {
    slug: "washroom-supplies",
    name: "Washroom supplies",
    priceLabel: "Coming soon",
    image: "",
    featured: false,
  },
];
