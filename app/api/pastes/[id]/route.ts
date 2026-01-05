import { NextRequest, NextResponse } from "next/server";
import { pastes } from "@/app/schema";
import { getEffectiveTime } from "@/app/lib/utils";
import {db} from "@/app/lib/db"
import { eq, and, or, gt, isNull, sql } from "drizzle-orm";


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const now = getEffectiveTime(req);

  try {
    //atomic update
    const result = await db
      .update(pastes)
      .set({
        //sql drizzle temp literals prevent from negative value
        remainingViews: sql`${pastes.remainingViews} - 1`,
      })
      .where(
        and(
          eq(pastes.id, id),
          or(isNull(pastes.expiresAt), gt(pastes.expiresAt, now)),
          or(isNull(pastes.remainingViews), gt(pastes.remainingViews, 0))
        )
      )
      .returning();
    console.log("result", result);

    //If no row was updated, it means the ID doesn't exist or a constraint failed
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Paste not found or unavailable" },
        { status: 404 }
      );
    }

    const paste = result[0];
    return NextResponse.json({
      content: paste.content,
      remaining_views: paste.remainingViews,
      expires_at: paste.expiresAt?.toISOString() || null,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
