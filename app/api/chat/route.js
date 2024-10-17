import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '@/lib/jwt';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();

  try {
    const { token, query, history } = await req.json();

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Instantiate Google Generative AI API
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Create system prompt with context
    const systemPrompt = `You are an assistant helping ${user.name}, who is a student studying ${user.collegeCourseName}. Respond only to queries related to college education.`;

    // Prepare chat history in the correct format
    const formattedHistory = history ? history.map(item => ({
      role: item.role === 'assistant' ? 'model' : item.role,
      parts: [{ text: item.message }]
    })) : [];

    // Start a new chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the system prompt and user's query
    const result = await chat.sendMessage([
      { text: systemPrompt },
      { text: query }
    ]);
    const response = await result.response.text();

    // Send the response back to the frontend
    return new Response(
      JSON.stringify({ response }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(
      JSON.stringify({ message: 'Something went wrong', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}