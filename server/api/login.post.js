import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from './mcok/mockDb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  // Find the user by username
  const user = users.find(user => user.username === username);

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' });
  }

  // Compare the entered password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' });
  }

  // Create a JWT token (with user info)
  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });

  return { token };
});