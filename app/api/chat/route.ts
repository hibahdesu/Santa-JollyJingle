//app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
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

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
  }



  // Fetch the existing chat history for the child
  const chatHistory = await getChatHistory(childName);

  // Add the current child message to the history
  const userMessage: ChatHistoryMessage = {
    role: 'user',
    content: message
  };
  chatHistory.push(userMessage);  // Add child message to history

  // Prepare messages for OpenAI, including the existing chat history
  const messages = [
    {
      role: 'system',
      content: `You are Santa Claus, the jolly, kind, and magical figure who brings joy to children all over the world. You have a deep, caring voice, and always speak in a warm, positive, and friendly manner. You love hearing about children's Christmas wishes and encourage them to be good, kind, and helpful. Each time you respond, vary your tone to reflect Santa's natural excitement, joy, and warmth. Use the child's name and the wishes in different ways to keep the magic alive. keep your response short and to the point. Ho ho ho!`
    },
    ...chatHistory,  // Include the previous messages (if any)
    {
      role: 'assistant',
      content: `Child's name: ${childName}. Christmas wish list: ${wishList}.`
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      messages,
      model: 'gpt-4o-mini',
      temperature: 0.8,
      max_tokens: 200,
      top_p: 1,
    });

    const aiMessage = response.choices[0]?.message?.content || 'Ho ho ho! I couldn\'t quite understand that, but keep being good and your wishes might just come true!';

    const assistantMessage: ChatHistoryMessage = {
      role: 'assistant',
      content: aiMessage
    };
    
    await updateChatHistory(childName, userMessage); 
    await updateChatHistory(childName, assistantMessage); 

    return NextResponse.json({ response: aiMessage });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
  }
}
