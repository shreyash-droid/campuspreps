import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
        // Generate content
    console.log('Generating content...');
    const prompt = `As an educational AI assistant, help with this question: ${message}

Please format your response in a clear, well-structured way:
- Use bullet points (•) for lists
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Use **bold text** for important concepts
- Use separate paragraphs for different topics
- Keep explanations clear and concise
- Focus on being helpful for students

Question: ${message}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, response: text });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error.message 
    }, { status: 500 });
  }
}