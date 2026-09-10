import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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

    if (!title?.trim() && !description?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are a highly organized productivity assistant. The user is creating a task.
    Current Title: "${title || ""}"
    Current Description: "${description || ""}"
    
    Your job:
    1. If both exist, improve them to be clear, actionable, and professional.
    2. If one is missing, generate it logically based on the context of the provided one.
    3. Keep the title concise. Make the description a detailed sentence or two.
    
    Return ONLY a valid JSON object containing exactly two keys: "title" (string) and "description" (string).`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData, { status: 200 });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during AI generation" },
      { status: 500 },
    );
  }
}
