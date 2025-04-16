import { Hono } from 'hono';
import { registerUser, validateUser } from '../services/auth-service';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const auth = new Hono();

const authSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

auth.post('/register', zValidator('json', authSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('json');

    const userId = await registerUser(username, password);
    if (userId) {
      return c.json(
        { id: userId, message: 'User registered successfully' },
        201
      );
    } else {
      return c.json({ error: 'Username already exists' }, 400);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

auth.post('/login', zValidator('json', authSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('json');

    const userId = await validateUser(username, password);

    if (userId) {
      return c.json({ id: userId, message: 'Login successful' });
    } else {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default auth;
export type AppType = typeof auth;
