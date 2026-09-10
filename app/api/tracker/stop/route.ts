import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { timeLogs } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const activeTimer = await db.query.timeLogs.findFirst({
      where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
    });

    if (!activeTimer) {
      return NextResponse.json(
        { error: "No active timer found to stop" },
        { status: 400 },
      );
    }

    const endTime = new Date();
    const startTime = new Date(activeTimer.startTime);
    const durationSeconds = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000,
    );

    const [stoppedLog] = await db
      .update(timeLogs)
      .set({
        endTime,
        durationSeconds,
      })
      .where(eq(timeLogs.id, activeTimer.id))
      .returning();

    return NextResponse.json(stoppedLog, { status: 200 });
  } catch (error) {
    console.error("Stop timer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
