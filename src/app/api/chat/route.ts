import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function POST(request: Request) {
  if (!env.hasAnthropic) {
    return NextResponse.json({
      message:
        'Our AI assistant is coming soon! For now, please use our contact form at /contact.',
    });
  }

  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system:
          'You are the MVVCSO community assistant. You help residents and visitors learn about MVVCSO programs, volunteer opportunities, events, and Ranchita community resources. Be warm, helpful, and bilingual (English/Spanish). Keep answers concise.',
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
