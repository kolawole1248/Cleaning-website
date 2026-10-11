import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Two modes, one schema:
 * - Hosted (Vercel): TURSO_DATABASE_URL + TURSO_AUTH_TOKEN are set and the
 *   Prisma client talks to the Turso database through the libSQL adapter.
 * - Local development: those vars are missing, so the classic SQLite file
 *   (DATABASE_URL="file:./dev.db") is used. Nothing else changes.
 */
function createClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (url && authToken) {
    const adapter = new PrismaLibSQL({ url, authToken });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
