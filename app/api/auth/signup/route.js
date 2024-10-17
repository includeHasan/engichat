import bcrypt from 'bcryptjs';
import User from '../../../../models/User';
import dbConnect from '@/lib/dbConnect';

// Handle POST request for user registration without OTP
export async function POST(req) {
  await dbConnect();

  const { name, email, password, collegeCourseName, university } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({ name, email, password: hashedPassword, collegeCourseName, university,requestFormat:"" });
  await user.save();

  return new Response(
    JSON.stringify({ message: 'User registered successfully.' }),
    { status: 201 }
  );
}
