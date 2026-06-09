import { NextResponse } from "next/server";
import { testDatabaseConnection } from "@/lib/db/connection";

export async function GET() {
  const result = await testDatabaseConnection();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
