import { getCookie } from 'hono/cookie';
import { hasAdmins } from '../auth/dashboardAuth';

const SESSION_COOKIE_NAME = 'admin_session';

export async function requireAuth(c: any, next: any) {
  const adminExists = await hasAdmins();

  if (!adminExists) {
    return c.redirect('/dashboard/setup');
  }

  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    return c.redirect('/dashboard/login');
  }

  return next();
}
