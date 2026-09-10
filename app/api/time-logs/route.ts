import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { tasks, timeLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

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

    // Fetch logs joined with their parent tasks
    const rawLogs = await db
      .select({
        log: timeLogs,
        task: tasks,
      })
      .from(timeLogs)
      .leftJoin(tasks, eq(timeLogs.taskId, tasks.id))
      .where(eq(timeLogs.userId, userId))
      .orderBy(desc(timeLogs.startTime));

    // Group logs by task and calculate dynamic total time
    const groupedData = rawLogs.reduce(
      (acc, row) => {
        if (!row.task) return acc;

        const taskId = row.task.id;
        if (!acc[taskId]) {
          acc[taskId] = {
            task: row.task,
            totalDurationSeconds: 0,
            logs: [],
          };
        }

        acc[taskId].logs.push(row.log);
        acc[taskId].totalDurationSeconds += row.log.durationSeconds || 0;

        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json(Object.values(groupedData), { status: 200 });
  } catch (error) {
    console.error("Fetch time logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
