// src/app/api/pastes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pastes } from "@/app/schema";
import {db} from "@/app/lib/db"



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    //validation: Content is required and must be non-empty
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    //validation: ttl_seconds optional integer >=1
    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    //validation: max_views optional integer >= 1
    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // calculate constraints
    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

    //insert into database
    const [newPaste] = await db
      .insert(pastes)
      .values({
        content,
        maxViews: max_views ?? null,
        remainingViews: max_views ?? null,
        expiresAt: expiresAt,
      })
      .returning({ id: pastes.id });

    // 6. Construct URL
    const host = request.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const pasteUrl = `${protocol}://${host}/p/${newPaste.id}`;

    return NextResponse.json(
      {
        id: newPaste.id,
        url: pasteUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Paste creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

