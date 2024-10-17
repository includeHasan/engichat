import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '@/lib/jwt';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();

  try {
    const { token, query, history, responseFormat } = await req.json();

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

    // Create a robust system prompt that includes response format
    let systemPrompt = `You are a highly knowledgeable assistant helping ${user.name}, a student studying ${user.collegeCourseName}. You specialize in assisting with queries related to college education, projects, exams, and general academic advice. Provide clear and accurate information to help the user in their studies.`;

    // Include the response format in the system prompt, if specified by the user
    if (responseFormat) {
      systemPrompt += `\nPlease format the response as follows: ${responseFormat}.`;
    } else if(!responseFormat || responseFormat==='') {
      systemPrompt += `\nIf no specific format is provided, return a well-structured and concise text response.`;
    }
    console.log(systemPrompt)

    // Prepare chat history in the correct format
    const formattedHistory = history ? history.map(item => ({
      role: item.role === 'assistant' ? 'model' : item.role,
      parts: [{ text: item.message }]
    })) : [];

    // Start a new chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Add system prompt to the chat
    chat.sendMessage([{ text: systemPrompt }]);

    // Send the query to the AI model
    const result = await chat.sendMessage([{ text: query }]);
    const response = await result.response.text();

    // Return the response to the frontend
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
