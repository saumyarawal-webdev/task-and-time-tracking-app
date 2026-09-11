import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    const { logs, summary, userName } = await req.json();

    if (!logs || !summary || !userName) {
      return NextResponse.json(
        { error: "Logs, summary, and userName are required" },
        { status: 400 },
      );
    }

    const prompt = `You are a sharp, insightful productivity analyst. You do not chat, explain, or add commentary. You only produce one JSON object.

USER NAME: ${userName}
TODAY'S SUMMARY STATS (raw JSON): ${JSON.stringify(summary)}
TODAY'S TASK DETAILS (raw JSON): ${JSON.stringify(logs)}

TIME FIELD RULES (critical — follow exactly, this is a common source of errors):
1. Any time-related field in the summary stats (e.g. totalTimeTracked, time tracked, duration) is ALWAYS in SECONDS. It is never minutes, never hours.
2. Convert it yourself using this exact method before writing anything:
   - hours = floor(seconds / 3600)
   - minutes = floor((seconds % 3600) / 60)
   - remainingSeconds = seconds % 60
3. If hours = 0 and minutes = 0, you MUST describe the time in seconds only (e.g. "41 seconds"). Do NOT say "41 minutes" or round up to a minute.
4. If hours = 0 and minutes > 0, describe it in minutes (and seconds if non-zero), never in hours.
5. Never invent, round, guess, or restate the time in a different unit than what the conversion above produces.
6. Double-check your converted value against the raw seconds number before finalizing your answer.

RULES (follow exactly):
1. Write exactly 1 paragraph, maximum 3 sentences. No more, no fewer.
2. Sentence 1 MUST greet the user by name, e.g. "Hello ${userName}," or "Great progress today, ${userName}!" — vary the phrasing naturally.
3. Mention the time tracked today using the converted value from the TIME FIELD RULES above.
4. Mention at least one real task title from TODAY'S TASK DETAILS if it is non-empty. If empty, do not invent a task — acknowledge no tasks were tracked yet.
5. If the converted time is 0 seconds total, do not claim progress was made — encourage starting instead of praising output.
6. Tone: motivating but professional. No emojis, no exclamation spam (max one "!" total).
7. Never invent numbers, task names, or times not present in the data above.

OUTPUT FORMAT (STRICT):
- Return ONLY a raw JSON object. No markdown, no backticks, no code fences, no text outside the JSON.
- Exactly one key: "insight" (string).
- Response must start with { and end with }.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct",
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter rejected:", errorText);
      return NextResponse.json(
        { error: "API Error" },
        { status: response.status },
      );
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from AI");
    }

    // Strip out pesky markdown backticks
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiData = JSON.parse(content);

    return NextResponse.json(aiData, { status: 200 });
  } catch (error) {
    console.error("OpenRouter Dashboard AI error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during AI generation" },
      { status: 500 },
    );
  }
}
