import { Hono } from 'hono';
import { LoginView } from './views/login';
import { validateAdminUser, hasAdmins } from './auth/dashboardAuth';
import { setCookie, getCookie } from 'hono/cookie';

const authRoutes = new Hono();
const SESSION_COOKIE_NAME = 'admin_session';

authRoutes.get('/login', async (c) => {
  const adminExists = await hasAdmins();
  if (!adminExists) return c.redirect('/dashboard/setup');
  if (getCookie(c, SESSION_COOKIE_NAME)) return c.redirect('/dashboard');
  return c.render(<LoginView c={c} />);
});

authRoutes.post('/login', async (c) => {
  const { username, password } = await c.req.parseBody();
  const isValid = await validateAdminUser(
    username as string,
    password as string
  );
  if (isValid) {
    setCookie(c, SESSION_COOKIE_NAME, `session_${Date.now()}`, {
      httpOnly: true,
      path: '/',
    });
    return c.redirect('/dashboard');
  }
  return c.render(<LoginView c={c} error="Invalid username or password" />);
});

authRoutes.get('/logout', (c) => {
  setCookie(c, SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return c.redirect('/dashboard/login');
});

export default authRoutes;
