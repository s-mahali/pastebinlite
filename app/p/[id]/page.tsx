// src/app/p/[id]/page.tsx
import { db } from "@/app/lib/db";
import { pastes } from "@/app/schema";
import { eq, and, or, gt, isNull, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getPasteData(id: string) {
  const headerList = headers();
  const testNow = (await headerList).get("x-test-now-ms");
  const isTestMode = process.env.TEST_MODE === "1";
  const now = isTestMode && testNow ? new Date(parseInt(testNow)) : new Date();

  const result = await db
    .update(pastes)
    .set({ remainingViews: sql`${pastes.remainingViews} - 1` })
    .where(
      and(
        eq(pastes.id, id),
        or(isNull(pastes.expiresAt), gt(pastes.expiresAt, now)),
        or(isNull(pastes.remainingViews), gt(pastes.remainingViews, 0))
      )
    )
    .returning();

  return result[0];
}

type Params = Promise<{ id: string }>;
export default async function ViewPaste({ params }: { params: Params }) {
  const { id } = await params;
  const paste = await getPasteData(id);

  if (!paste) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <div className="bg-slate-50 border rounded-lg p-6 shadow-sm">
        <h1 className="text-sm font-mono text-slate-500 mb-4 border-b pb-2">
          Paste ID: {id}
        </h1>
        {/* Render text safely*/}
        <pre className="whitespace-pre-wrap wrap-break-word font-sans text-slate-800">
          {paste.content}
        </pre>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        {paste.expiresAt && (
          <p>Expires: {new Date(paste.expiresAt).toLocaleString()}</p>
        )}
        {paste.remainingViews !== null && (
          <p>Views left: {paste.remainingViews}</p>
        )}
      </div>
    </main>
  );
}
