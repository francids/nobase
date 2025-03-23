import { Hono } from 'hono';
import { Layout } from './components/Layout';
import { CollectionsView } from './views/collections';
import { DocumentsView } from './views/documents';
import { FilesView } from './views/files';
import { UserListView } from './views/users';
import { LoginView } from './views/login';
import { validateAdminUser } from './auth/dashboardAuth';
import { setCookie, getCookie } from 'hono/cookie';

const dashboard = new Hono();

const SESSION_COOKIE_NAME = 'admin_session';

async function requireAuth(c: any, next: any) {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    return c.redirect('/dashboard/login');
  }

  return next();
}

dashboard.get('/login', (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);
  if (sessionId) {
    return c.redirect('/dashboard');
  }

  return c.render(<LoginView c={c} />);
});

dashboard.post('/login', async (c) => {
  const { username, password } = await c.req.parseBody();

  const isValid = await validateAdminUser(
    username as string,
    password as string
  );

  if (isValid) {
    const sessionToken = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    setCookie(c, SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return c.redirect('/dashboard');
  } else {
    return c.render(
      <LoginView c={c} error="Usuario o contraseña incorrectos" />
    );
  }
});

dashboard.get('/logout', (c) => {
  setCookie(c, SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return c.redirect('/dashboard/login');
});

dashboard.use('/*', requireAuth);

dashboard.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div class="dashboard-cards">
          <a href="/dashboard/collections" class="card">
            <h2>Collections</h2>
            <p>Manage database collections</p>
          </a>
          <a href="/dashboard/files" class="card">
            <h2>Files</h2>
            <p>Manage uploaded files</p>
          </a>
          <a href="/dashboard/users" class="card">
            <h2>Users</h2>
            <p>Manage user accounts</p>
          </a>
        </div>
      </div>
    </Layout>
  );
});

dashboard.get('/collections', (c) => c.render(<CollectionsView c={c} />));
dashboard.get('/collections/:collection', (c) =>
  c.render(<DocumentsView c={c} />)
);
dashboard.get('/files', (c) => c.render(<FilesView c={c} />));
dashboard.get('/users', (c) => c.render(<UserListView c={c} />));

export default dashboard;
