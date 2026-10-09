// Seeds the database with the launch content from the ZA Cleaning brief.
// Safe to run more than once — existing rows are never overwritten.
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Load .env so DATABASE_URL is available to Prisma
try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // no .env file — rely on system env
}

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@zacleans.co.uk";
const ADMIN_PASSWORD = "ChangeMe123!";

const SETTINGS = {
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

const SERVICES = [
  {
    slug: "regular-domestic-cleaning",
    name: "Regular domestic cleaning",
    order: 1,
    featured: true,
    status: "published",
    priceLabel: "From £25 per cleaner-hour",
    priceNote: "Minimum 2 hours",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Reliable weekly, fortnightly or ad-hoc cleaning to keep your home fresh and tidy.",
    description:
      "A regular cleaner for your home, on a schedule that suits you — weekly, fortnightly or whenever you need it. You get the same tasks done every visit, with the flexibility to add extras.",
    includes: [
      "Dusting of surfaces, shelves and skirting boards",
      "Vacuuming and mopping all floors",
      "Kitchen worktops, sink and hob cleaned",
      "Bathrooms cleaned and sanitised",
      "Bins emptied",
      "Beds made on request",
      "Mirrors and glass wiped",
    ].join("\n"),
  },
  {
    slug: "one-off-cleaning",
    name: "One-off cleaning",
    order: 2,
    featured: true,
    status: "published",
    priceLabel: "From £30 per cleaner-hour",
    priceNote: "",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    summary:
      "A thorough clean for when your home needs a reset — book a single visit.",
    description:
      "Ideal after a busy period, before guests arrive, or as a one-time refresh. Book a single visit and we will work through the property exactly as agreed in your quote.",
    includes: [
      "Everything in a regular clean",
      "Inside cupboards on request",
      "Inside the microwave",
      "Skirting boards, doors and door frames",
      "Detailed dusting of all rooms",
      "Bins emptied and cleaned",
    ].join("\n"),
  },
  {
    slug: "deep-cleaning",
    name: "Deep cleaning",
    order: 3,
    featured: true,
    status: "published",
    priceLabel: "Get a quote",
    priceNote: "Price depends on the property",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80",
    summary:
      "An intensive clean that reaches the places regular cleaning doesn't.",
    description:
      "A detailed, top-to-bottom clean for kitchens, bathrooms and whole properties. Tell us where it matters most and we will build the job around it.",
    includes: [
      "Limescale removal in bathrooms",
      "Oven interior on request",
      "Deep scrub of tiles and grout",
      "Inside cupboards and drawers",
      "Detailed cleaning of skirting and edges",
      "High and low dusting",
    ].join("\n"),
  },
  {
    slug: "end-of-tenancy-cleaning",
    name: "End-of-tenancy cleaning",
    order: 4,
    featured: true,
    status: "published",
    priceLabel: "Fixed quote",
    priceNote: "Confirmed after we review the job",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Hand the keys back with confidence — a full property clean ready for inspection.",
    description:
      "A full-scope clean covering the whole property so you can return it in great condition. Send us the property details and we will confirm a fixed price before booking.",
    includes: [
      "Kitchen: oven, hob, extractor, cupboards, surfaces",
      "Bathrooms: tiles, grout, glass and fixtures",
      "All rooms: skirting, doors, switches and sockets",
      "Windows and sills (inside)",
      "Carpets vacuumed throughout",
      "Bins emptied and cleaned",
    ].join("\n"),
  },
  {
    slug: "office-cleaning",
    name: "Office cleaning",
    order: 5,
    featured: true,
    status: "published",
    priceLabel: "Contract quote",
    priceNote: "Weekly or daily contracts",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    summary:
      "Daily or weekly cleaning contracts for offices and workplaces across London.",
    description:
      "A dependable cleaning contract for your workplace, scheduled around your hours — daily, weekly or anything in between, with one point of contact for everything.",
    includes: [
      "Desks and communal areas cleaned",
      "Kitchens and break areas",
      "Toilets and washrooms cleaned",
      "Bins emptied and recycling separated",
      "Floors vacuumed and mopped",
      "Glass and reception areas wiped",
    ].join("\n"),
  },
  {
    slug: "post-construction-cleaning",
    name: "Post-construction cleaning",
    order: 6,
    featured: false,
    status: "coming-soon",
    priceLabel: "Contact us",
    priceNote: "",
    image: "",
    summary: "Final clean after building or renovation work — ask us about availability.",
    description: "We are confirming the details of this service before it goes live. Message us and we will let you know.",
    includes: "",
  },
  {
    slug: "carpet-and-upholstery-cleaning",
    name: "Carpet and upholstery cleaning",
    order: 7,
    featured: false,
    status: "coming-soon",
    priceLabel: "Contact us",
    priceNote: "",
    image: "",
    summary: "Deep cleaning for carpets, sofas and soft furnishings — ask us about availability.",
    description: "We are confirming the details of this service before it goes live. Message us and we will let you know.",
    includes: "",
  },
  {
    slug: "window-cleaning",
    name: "Window cleaning",
    order: 8,
    featured: false,
    status: "coming-soon",
    priceLabel: "Contact us",
    priceNote: "",
    image: "",
    summary: "Interior and exterior window cleaning — ask us about availability.",
    description: "We are confirming the details of this service before it goes live. Message us and we will let you know.",
    includes: "",
  },
  {
    slug: "washroom-supplies",
    name: "Washroom supplies",
    order: 9,
    featured: false,
    status: "coming-soon",
    priceLabel: "Contact us",
    priceNote: "",
    image: "",
    summary: "Washroom consumables for offices — ask us about availability.",
    description: "We are confirming the details of this service before it goes live. Message us and we will let you know.",
    includes: "",
  },
];

async function main() {
  console.log("Seeding database…");

  // Admin user
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });
  if (existingAdmin) {
    console.log(`  admin: ${ADMIN_EMAIL} already exists — skipped`);
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.adminUser.create({
      data: { email: ADMIN_EMAIL, passwordHash, name: "ZA Cleaning" },
    });
    console.log(`  admin: created ${ADMIN_EMAIL}`);
  }

  // Settings (only missing keys — never overwrite admin edits)
  let settingsCreated = 0;
  for (const [key, value] of Object.entries(SETTINGS)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({ data: { key, value } });
      settingsCreated += 1;
    }
  }
  console.log(`  settings: ${settingsCreated} created`);

  // Services
  let servicesCreated = 0;
  for (const service of SERVICES) {
    const existing = await prisma.service.findUnique({
      where: { slug: service.slug },
    });
    if (!existing) {
      await prisma.service.create({ data: service });
      servicesCreated += 1;
    }
  }
  console.log(`  services: ${servicesCreated} created`);
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
