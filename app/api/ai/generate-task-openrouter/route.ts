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

    const prompt = `You are a highly organized productivity assistant. The user is creating a task.
    Current Title: "${title || ""}"
    Current Description: "${description || ""}"
    
    Your job:
    1. If both exist, improve them to be clear, actionable, and professional.
    2. If one is missing, generate it logically based on the context of the provided one.
    3. Keep the title concise. Make the description a detailed sentence or two.
    
    Return ONLY a valid JSON object containing exactly two keys: "title" (string) and "description" (string).`;

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
