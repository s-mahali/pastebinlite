// src/app/api/healthz/route.ts
import { NextResponse } from "next/server";
import {db} from "@/app/lib/db"
import { sql } from "drizzle-orm";



export async function GET() {
  try {
    //ping the db
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { ok: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
}
