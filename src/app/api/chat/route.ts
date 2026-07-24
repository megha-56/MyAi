import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const lastMessage = messages[messages.length - 1].content;
    const result = await model.generateContentStream(lastMessage);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Error: ' + (error as Error).message, { status: 500 });
  }
}