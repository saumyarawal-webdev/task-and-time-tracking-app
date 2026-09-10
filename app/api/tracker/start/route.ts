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

    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    // Proactive check to cleanly catch if a timer is already running
    const activeTimer = await db.query.timeLogs.findFirst({
      where: and(eq(timeLogs.userId, userId), isNull(timeLogs.endTime)),
    });

    if (activeTimer) {
      return NextResponse.json(
        { error: "A timer is already running" },
        { status: 400 },
      );
    }

    const [newLog] = await db
      .insert(timeLogs)
      .values({
        userId,
        taskId,
      })
      .returning();

    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error("Start timer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
