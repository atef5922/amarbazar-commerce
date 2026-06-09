import { readFileSync } from "node:fs";
import { Client } from "pg";

function readEnvValue(key: string) {
  const envFile = readFileSync(".env", "utf8");
  const match = envFile.match(new RegExp(`^${key}="?([^"\\r\\n]+)"?`, "m"));
  return match?.[1] ?? process.env[key];
}

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) throw new Error("Usage: npm exec tsx scripts/apply-sql.ts prisma/init.sql");

  const connectionString = readEnvValue("DIRECT_URL");
  if (!connectionString) throw new Error("DIRECT_URL is missing from .env");

  const sql = readFileSync(sqlFile, "utf8");
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  await client.query(sql);
  await client.end();
  console.log(`Applied SQL from ${sqlFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
