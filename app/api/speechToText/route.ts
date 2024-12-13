import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(process.env.OPENAI_BASE_URL && { baseURL: process.env.OPENAI_BASE_URL }),
});

// Main POST function for handling audio-to-text requests
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const req = await request.json();
    const base64Audio = req.audio;
    const audio = Buffer.from(base64Audio, "base64");

    const text = await convertAudioToText(audio);

    return NextResponse.json({ result: text }, { status: 200 });
  } catch (error: unknown) {
    // Narrow the type of `error` to `Error`
    if (error instanceof Error) {
      return handleErrorResponse(error);
    }

    // Handle the case where error is not an instance of `Error`
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Function to convert audio data (buffer) to text using OpenAI's Whisper model
async function convertAudioToText(audioData: Buffer): Promise<string> {
  const outputPath = "/tmp/input.webm";
  fs.writeFileSync(outputPath, audioData);

  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(outputPath),
      model: "whisper-1",
    });

    return response.text;
  } finally {
    fs.unlinkSync(outputPath); // Clean up the temporary file
  }
}

// Improved error handler with specific error types
function handleErrorResponse(error: Error & { response?: { status: number; data: unknown } }): NextResponse {
  if (error.response) {
    // Log the detailed error response from OpenAI
    console.error(error.response.status, error.response.data);
    return NextResponse.json({ error: error.response.data }, { status: 500 });
  } else {
    // Log general errors, especially from the OpenAI API
    console.error(`Error with OpenAI API request: ${error.message}`);
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}
