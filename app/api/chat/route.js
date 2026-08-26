import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `As an educational AI assistant, help with this question: ${message}

Please format your response in a clear, well-structured way:
- Use bullet points (•) for lists
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Use **bold text** for important concepts
- Use separate paragraphs for different topics
- Keep explanations clear and concise
- Focus on being helpful for students

Question: ${message}`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
    });
    const text = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ success: true, response: text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      error: 'Failed to process request',
      details: error.message,
    }, { status: 500 });
  }
}
