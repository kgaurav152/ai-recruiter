import { Feedback_Prompt } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    const {conversation} = await req.json();
    const FINAL_PROMPT=Feedback_Prompt.replace("{{conversation}}",JSON.stringify(conversation));
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: FINAL_PROMPT }],
      });
      return NextResponse.json(completion.choices[0].message);
    } catch (error: any) {
      console.log(error?.message);
      return NextResponse.json(error?.message);
    }
}