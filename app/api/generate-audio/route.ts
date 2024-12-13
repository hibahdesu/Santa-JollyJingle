//app/api/generate-audio/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID}/stream`;
    const headers = {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
    };
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    });

    // Make the request to Eleven Labs API and immediately stream the audio data
    const ttsResponse = await fetch(url, { method: 'POST', headers, body });

    if (!ttsResponse.ok) {
      throw new Error('Failed to generate audio');
    }

    // Stream the response directly to the client as audio/mpeg
    const audioStream = ttsResponse.body;

    return new NextResponse(audioStream, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}
