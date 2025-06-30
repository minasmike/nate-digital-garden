import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { content } = await req.json();
  if (!content) {
    return NextResponse.json({ error: 'No content provided.' }, { status: 400 });
  }

  try {
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) {
      return NextResponse.json({ error: 'Hugging Face API key not set.' }, { status: 500 });
    }

    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: content })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }
    const data = await response.json();
    const summary = Array.isArray(data) && data[0]?.summary_text ? data[0].summary_text : '';
    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({ error: 'Failed to summarize.' }, { status: 500 });
  }
}
