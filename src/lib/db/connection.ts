import "server-only";
import { prisma } from "@/lib/prisma";

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

function hasPlaceholder(value: string) {
  return /\[.*password.*\]|your-password|real_password|paste_/i.test(value);
}

function getConfigMessage() {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!databaseUrl) {
    return "Missing DATABASE_URL. Add it to .env.local in the project root, beside package.json, then restart the dev server. Prisma CLI also needs the same value in .env or an exported shell variable.";
  }

  if (!directUrl) {
    return "Missing DIRECT_URL. Add it to .env.local in the project root for server runtime checks and to .env or your shell for Prisma db push/migrations.";
  }

  if (hasPlaceholder(databaseUrl) || hasPlaceholder(directUrl)) {
    return "DATABASE_URL/DIRECT_URL still contain a placeholder password. Replace it with the real Supabase database password without brackets.";
  }

  return null;
}

export function getDatabaseErrorMessage(error: unknown) {
  const configMessage = getConfigMessage();
  if (configMessage) return configMessage;

  if (!(error instanceof Error)) {
    return "Database connection failed. Please check the Supabase database settings.";
  }

  const message = error.message.toLowerCase();
  const code = "code" in error ? String(error.code) : "";

  if (message.includes("environment variable not found")) {
    return "Missing DATABASE_URL or DIRECT_URL. Add both values to .env.local, mirror them in .env for Prisma CLI, and restart the dev server.";
  }

  if (code === "P1000" || message.includes("authentication failed")) {
    return "Wrong Supabase database password in DATABASE_URL/DIRECT_URL. Update .env.local and restart the dev server.";
  }

  if (code === "P1001" || message.includes("can't reach database server") || message.includes("connect")) {
    return "Database host could not be reached. Check the Supabase host, password, and whether your network allows PostgreSQL connections.";
  }

  if (code === "P2021" || message.includes("does not exist in the current database")) {
    return "Database tables are not migrated yet. Run npx prisma generate and npx prisma db push after setting the real database password.";
  }

  if (message.includes("@prisma/client did not initialize") || message.includes("prisma generate")) {
    return "Prisma client is not generated. Run npx prisma generate and restart the dev server.";
  }

  return "Database connection failed. Please check DATABASE_URL/DIRECT_URL credentials in your .env.local file.";
}

export async function testDatabaseConnection() {
  const configMessage = getConfigMessage();
  if (configMessage) return { ok: false, message: configMessage };

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, message: "Database connection successful." };
  } catch (error) {
    return { ok: false, message: getDatabaseErrorMessage(error) };
  }
}

export async function assertDatabaseReady() {
  const result = await testDatabaseConnection();
  if (!result.ok) throw new DatabaseConnectionError(result.message);
}
