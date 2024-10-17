import bcrypt from 'bcryptjs';
import User from '../../../../models/User';
import { createToken } from '../../../../lib/jwt';
import dbConnect from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = createToken(user); // Generate JWT
    return new Response(
      JSON.stringify({ token }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ message: 'Invalid credentials' }),
      { status: 401 }
    );
  }
}
