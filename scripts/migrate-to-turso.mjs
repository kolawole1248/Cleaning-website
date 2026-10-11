/* One-off migration: local SQLite (prisma/dev.db) → hosted Turso database.
 *
 * Usage:  node --env-file=.env scripts/migrate-to-turso.mjs
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.
 * Safe to re-run: existing tables are left alone and tables that already
 * contain rows are skipped, so nothing gets duplicated.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env");
  process.exit(1);
}

// 1. Create any missing tables directly on Turso --------------------------
const schema = readFileSync("prisma/turso-schema.sql", "utf8");
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const turso = createClient({ url, authToken });

const { rows: existing } = await turso.execute(
  "SELECT name, type FROM sqlite_master WHERE type IN ('table','index')"
);
const existingNames = new Set(existing.map((r) => `${r.type}:${r.name}`));

for (const stmt of statements) {
  const table = stmt.match(/CREATE TABLE ["`\s]*(\w+)["`\s]*\(/)?.[1];
  const index = stmt.match(/CREATE (?:UNIQUE )?INDEX ["`\s]*(\w+)/)?.[1];
  if (table && existingNames.has(`table:${table}`)) {
    console.log(`table ${table} already exists — left untouched`);
    continue;
  }
  if (index && existingNames.has(`index:${index}`)) {
    console.log(`index ${index} already exists — left untouched`);
    continue;
  }
  await turso.execute(stmt);
  console.log(`${index ? "index " + index : "table " + (table ?? "(statement)")} created`);
}

// 2. Copy every row from the local database --------------------------------
const adapter = new PrismaLibSQL({ url, authToken });
const local = new PrismaClient(); // local dev.db
const remote = new PrismaClient({ adapter });

const models = [
  ["services", () => local.service.findMany(), (rows) => remote.service.createMany({ data: rows })],
  ["settings", () => local.setting.findMany(), (rows) => remote.setting.createMany({ data: rows })],
  ["enquiries", () => local.enquiry.findMany(), (rows) => remote.enquiry.createMany({ data: rows })],
  ["adminUsers", () => local.adminUser.findMany(), (rows) => remote.adminUser.createMany({ data: rows })],
];

for (const [label, read, write] of models) {
  const rows = await read();
  if (rows.length === 0) {
    console.log(`${label}: nothing to copy`);
    continue;
  }
  const already = await write(rows)
    .then((r) => {
      console.log(`${label}: copied ${r.count} row(s)`);
      return true;
    })
    .catch((e) => {
      console.log(`${label}: SKIPPED (${e.message?.slice(0, 90)}) — probably already migrated`);
      return false;
    });
  void already;
}

await remote.$disconnect();
await local.$disconnect();
console.log("Migration finished.");
