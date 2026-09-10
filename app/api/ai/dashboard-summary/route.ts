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

    const { logs, summary, userName } = await req.json();

    if (!logs || !summary || !userName) {
      return NextResponse.json(
        { error: "Logs, summary, and userName are required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const aiData = JSON.parse(responseText);

    return NextResponse.json(aiData, { status: 200 });
  } catch (error) {
    console.error("Dashboard AI error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during AI generation" },
      { status: 500 },
    );
  }
}
