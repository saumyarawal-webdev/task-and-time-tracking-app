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

    const prompt = `You are a sharp, insightful productivity analyst. 
    User Name: ${userName}
    Today's Summary Stats: ${JSON.stringify(summary)}
    Today's Task Details: ${JSON.stringify(logs)}
    
    Your job:
    Write a short, engaging, and personalized paragraph (maximum 3 sentences) summarizing their daily productivity. 
    1. You MUST start by greeting the user by name (e.g., "Hello ${userName}," or "Great progress today, ${userName}!").
    2. Analyze the specific task titles they touched and relate it to their total time.
    3. Keep it motivating but professional.
    
    Return ONLY a valid JSON object containing exactly one key: "insight" (string).`;

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
