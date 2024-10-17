// lib/jwt.js
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Function to create a JWT token
export function createToken(user) {
  // Create a token with user data (you can include more fields as required)
  return jwt.sign({ userId: user._id, email: user.email }, secretKey, {
    expiresIn: '1h', // Token expiration time
  });
}

// Function to verify the JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error('Invalid token');
  }
}
