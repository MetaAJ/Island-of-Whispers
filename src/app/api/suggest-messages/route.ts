import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAi = createGoogleGenerativeAI({
//   baseURL: "https://generativelanguage.googleapis.com/v1beta",
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
    const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for teenage audience. Avoid universal themes, and focus more on personal, sensitive, engaging or playful interactive topics that encourage friendly as well as mysterious interactions. For example, your output should be structured like this: 'What are your darkest fantasies?||If you could go on a date now, who would it be with?||What’s the last thing you would want to do before you die?'. Ensure the questions are intriguing, foster curiosity, and contribute to any type of conversation.";

    try {
        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await model.generateContent(prompt);

        return NextResponse.json(
            {
                success: true,
                message: response.response
            },
            { status: 200 }
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json(
            {
                success: true,
                message: error,
            },
            { status: 500 }
        );
    }
}