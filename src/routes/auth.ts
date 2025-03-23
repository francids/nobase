import { Hono } from 'hono';
import { registerUser, validateUser } from '../auth';

const authRoutes = new Hono();

authRoutes.post('/register', async (c) => {
  try {
    if (!c.req.header('content-type')?.includes('application/json')) {
      return c.json({ error: 'Content-Type must be application/json' }, 400);
    }

    const body = await c.req.json();

    if (!body || typeof body !== 'object') {
      return c.json({ error: 'Invalid request body' }, 400);
    }

    const { username, password } = body;

    if (!username || !password) {
      return c.json(
        { error: 'username and password fields are required' },
        400
      );
    }

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

authRoutes.post('/login', async (c) => {
  try {
    if (!c.req.header('content-type')?.includes('application/json')) {
      return c.json({ error: 'Content-Type must be application/json' }, 400);
    }

    const body = await c.req.json();

    if (!body || typeof body !== 'object') {
      return c.json({ error: 'Invalid request body' }, 400);
    }

    const { username, password } = body;

    if (!username || !password) {
      return c.json(
        { error: 'username and password fields are required' },
        400
      );
    }

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
