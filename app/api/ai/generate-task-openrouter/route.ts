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

    const { title, description } = await req.json();

    // Check if BOTH are missing
    if (!title && !description) {
      return NextResponse.json(
        { error: "Either title or description is required" },
        { status: 400 },
      );
    }

    const prompt = `You are a strict, professional task-refinement engine used inside a productivity app. You do not chat, explain, or add commentary. You only transform task input into a clean JSON object.

INPUT:
Current Title: "${title || ""}"
Current Description: "${description || ""}"

RULES (follow exactly, in order):
1. If both title and description are empty or meaningless (e.g. random characters, single letters, "asdf"), return the input back with minimal cleanup — do NOT invent a fictional task.
2. If only the title is provided, you MUST still generate a description — never leave it empty or omit it. The description must explain HOW to complete that exact task (a concrete first action).
3. If only the description is provided, you MUST still generate a title — never leave it empty or omit it. The title must name the task, not restate the description.
4. If both exist, rewrite both to be clearer and more actionable, without changing the user's original intent or task subject.
5. Title: maximum 6 words. Use Title Case. No punctuation at the end. No generic words like "Task", "Thing", "Item".
6. Description: exactly 1 sentence, 10–20 words. Must state a specific, concrete action (who/what/how), not a summary of the title. No filler like "This task involves..." or "Make sure to...".
7. Never use emojis, exclamation marks, or first-person language ("I will", "we need to").
8. Do not add information that wasn't implied by the input (no fake names, tools, or deadlines unless mentioned).
9. MANDATORY CHECK before responding: your JSON object must contain a non-empty "title" string AND a non-empty "description" string, no matter which one was originally missing. A response missing either key or leaving one blank is INVALID and must not be returned.

EXAMPLES:
Input title: "follow up with designer"
Output: {"title": "Follow Up With UI Designer", "description": "Send a Slack message to confirm wireframe delivery status."}

Input title: "fix bug"
Output: {"title": "Fix Login Page Bug", "description": "Investigate and resolve the reported issue on the login page."}

Input description: "need to call the client about invoice delay"
Output: {"title": "Call Client About Invoice", "description": "Call the client to explain and resolve the delay in invoice processing."}

OUTPUT FORMAT (STRICT):
- Return ONLY a raw JSON object. No markdown. No backticks. No code fences. No explanation before or after.
- The JSON must contain EXACTLY two keys: "title" (string) and "description" (string), both non-empty. No extra keys.
- The response must start with { and end with } — nothing else.`;

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
    console.error("OpenRouter Generate Task error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during AI generation" },
      { status: 500 },
    );
  }
}
