import bcrypt from 'bcryptjs';
import { users } from './mcok/mockDb';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body)
  const { username, password } = body;

  console.log(body.username)

  // Check if user already exists
  if (users.some(user => user.username === username)) {
    throw createError({ statusCode: 400, message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the new user (in a real scenario, store in a DB)
  users.push({ username, password: hashedPassword });

  return { message: 'User registered successfully' };
});