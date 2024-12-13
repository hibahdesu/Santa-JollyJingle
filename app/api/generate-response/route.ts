//app/api/generate-response/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { getChatHistory, updateChatHistory } from '@/lib/chatHistory';
import { ChatHistoryMessage } from '@/lib/chatHistory';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(process.env.OPENAI_BASE_URL && { baseURL: process.env.OPENAI_BASE_URL }),
});

export async function POST(req: Request) {
  const { message, childName, wishList } = await req.json();

  if (!message || !childName || !wishList) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!openai.apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
  }

  let chatHistory;
  try {
    chatHistory = await getChatHistory(childName);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }

  const userMessage: ChatHistoryMessage = {
    role: 'user',
    content: message,
  };
  chatHistory.push(userMessage);

  const messages = [
    {
      role: 'system',
      content: `You are Santa Claus, the jolly, kind, and magical figure who brings joy to children all over the world. You have a deep, caring voice, and always speak in a warm, positive, and friendly manner. You love hearing about children's Christmas wishes and encourage them to be good, kind, and helpful. Each time you respond, vary your tone to reflect Santa's natural excitement, joy, and warmth. Use the child's name and the wishes in different ways to keep the magic alive. Keep your response short and to the point. Ho ho ho!`,
    },
    ...chatHistory.slice(-5), // Limit to the most recent 5 messages to optimize request size
    {
      role: 'assistant',
      content: `Child's name: ${childName}. Christmas wish list: ${wishList}.`,
    },
  ];

  try {
    // Enable streaming to get the response in real-time
    const stream = await openai.chat.completions.create({
      messages,
      model: 'gpt-4o-mini',
      temperature: 0.8,
      max_tokens: 200,
      top_p: 1,
      stream: true,  // Stream responses as they're generated
    });

    let aiMessage = '';

    // Iterate over the stream chunks and handle the content properly
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {  // Access the content within delta
        aiMessage += chunk.choices[0].delta.content;
      }
    }

    if (!aiMessage) {
      aiMessage = 'Ho ho ho! I couldn’t quite understand that, but remember, Christmas magic works in mysterious ways! Stay good and your wishes may come true!';
    } else {
      aiMessage += ``;
    }

    const assistantMessage: ChatHistoryMessage = {
      role: 'assistant',
      content: aiMessage,
    };

    // Update chat history in parallel
    await Promise.all([
      updateChatHistory(childName, userMessage),
      updateChatHistory(childName, assistantMessage),
    ]);

    return NextResponse.json({ response: aiMessage });
  } catch (error) {
    console.error('Error during OpenAI API request:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to generate response: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
