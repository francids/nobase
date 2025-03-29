import { Hono } from 'hono';
import { registerUser, validateUser } from '../auth';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const authRoutes = new Hono();

const authSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

authRoutes.post('/register', zValidator('form', authSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('form');

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

authRoutes.post('/login', zValidator('form', authSchema), async (c) => {
  try {
    const { username, password } = c.req.valid('form');

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

export default authRoutes;
export type AppType = typeof authRoutes;
