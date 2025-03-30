import { Hono } from 'hono';
import { InitialSetupView } from './views/initialSetup';
import { hasAdmins, createInitialAdmin } from './auth/dashboardAuth';
import { setCookie } from 'hono/cookie';

const setupRoutes = new Hono();
const SESSION_COOKIE_NAME = 'admin_session';

setupRoutes.get('/', async (c) => {
  const adminExists = await hasAdmins();
  if (adminExists) return c.redirect('/dashboard/login');
  return c.render(<InitialSetupView c={c} />);
});

setupRoutes.post('/', async (c) => {
  const { username, password, confirmPassword } = await c.req.parseBody();
  if (password !== confirmPassword) {
    return c.render(<InitialSetupView c={c} error="Passwords do not match" />);
  }
  if (password.length < 6 || username.length < 3) {
    return c.render(
      <InitialSetupView
        c={c}
        error="Username or password do not meet requirements"
      />
    );
  }
  const success = await createInitialAdmin(
    username as string,
    password as string
  );
  if (success) {
    setCookie(c, SESSION_COOKIE_NAME, `session_${Date.now()}`, {
      httpOnly: true,
      path: '/',
    });
    return c.redirect('/dashboard');
  }
  return c.render(
    <InitialSetupView c={c} error="Could not create the administrator" />
  );
});

export default setupRoutes;
