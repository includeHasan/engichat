import User from '../../../models/User';
import { verifyToken } from '../../../lib/jwt';
import dbConnect from '@/lib/dbConnect';

// Helper function to get token from headers
const getTokenFromHeaders = (headers) => {
  const authHeader = headers.get('authorization');
  if (!authHeader) return null;
  const [bearer, token] = authHeader.split(' ');
  return bearer === 'Bearer' ? token : null;
};

// Handle GET requests for user profile
export async function GET(req) {
  await dbConnect();
  
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Authorization token is missing' }),
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        name: user.name, 
        collegeCourseName: user.collegeCourseName,
        university: user.university ,
        responseFormat:user.responseFormat
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
// Handle PUT requests for user profile
export async function POST(req) {
  await dbConnect();
  
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Authorization token is missing' }),
      { status: 401 }
    );
  }

  try {
    const decoded = verifyToken(token);
    const { name, collegeCourseName, university,responseFormat } = await req.json();
    
    // Fetch current user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    // Check if any of the fields have changed
    const isSameData = 
      user.name === name &&
      user.collegeCourseName === collegeCourseName &&
      user.university === university &&
      user.responseFormat===responseFormat

    if (isSameData) {
      return new Response(
        JSON.stringify({ message: 'No changes detected' }),
        { status: 200 }
      );
    }

    // If data has changed, proceed with the update
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { name, collegeCourseName, university, responseFormat },
      { new: true }
    );

    return new Response(
      JSON.stringify({ 
        message: 'Profile updated', 
        user: {
          name: updatedUser.name,
          collegeCourseName: updatedUser.collegeCourseName,
          university: updatedUser.university,
          responseFormat:updatedUser.responseFormat
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/profile:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
