import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { tasks, timeLogs } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

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

    // Calculate the exact start of the current day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Fetch only time logs from today
    const todayLogs = await db.query.timeLogs.findMany({
      where: and(
        eq(timeLogs.userId, userId),
        gte(timeLogs.startTime, startOfToday),
      ),
    });

    // Fetch all user tasks to calculate current progress states
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
    });

    // Calculate dynamic stats
    const totalTimeTracked = todayLogs.reduce(
      (acc, log) => acc + (log.durationSeconds || 0),
      0,
    );
    const uniqueTaskIds = new Set(todayLogs.map((log) => log.taskId));
    const tasksWorkedOn = uniqueTaskIds.size;

    const completedTasks = userTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const pendingOrInProgress = userTasks.filter(
      (t) => t.status !== "completed",
    ).length;

    return NextResponse.json(
      {
        tasksWorkedOn,
        totalTimeTracked,
        completedTasks,
        pendingOrInProgress,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
