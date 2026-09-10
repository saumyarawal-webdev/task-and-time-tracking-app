import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { timeLogs } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Sniff out the one log where endTime is still NULL
    const activeTimer = await db.query.timeLogs.findFirst({
      where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
    });

    // Return the active timer object, or null if nothing is running
    return NextResponse.json(activeTimer || null, { status: 200 });
  } catch (error) {
    console.error("Fetch active timer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
