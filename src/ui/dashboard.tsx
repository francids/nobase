import { Hono } from 'hono';
import { Layout } from './components/Layout';
import { CollectionsView } from './views/collections';
import { DocumentsView } from './views/documents';
import { FilesView } from './views/files';
import { UserListView } from './views/users';
import { LoginView } from './views/login';
import { InitialSetupView } from './views/initialSetup';
import {
  validateAdminUser,
  hasAdmins,
  createInitialAdmin,
} from './auth/dashboardAuth';
import { setCookie, getCookie } from 'hono/cookie';

const dashboard = new Hono();

const SESSION_COOKIE_NAME = 'admin_session';

async function requireAuth(c: any, next: any) {
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

dashboard.get('/setup', async (c) => {
  const adminExists = await hasAdmins();

  if (adminExists) {
    return c.redirect('/dashboard/login');
  }

  return c.render(<InitialSetupView c={c} />);
});

dashboard.post('/setup', async (c) => {
  const adminExists = await hasAdmins();
  if (adminExists) {
    return c.redirect('/dashboard/login');
  }

  const { username, password, confirmPassword } = await c.req.parseBody();

  if (password !== confirmPassword) {
    return c.render(
      <InitialSetupView c={c} error="Las contraseñas no coinciden" />
    );
  }

  if (typeof password === 'string' && password.length < 6) {
    return c.render(
      <InitialSetupView
        c={c}
        error="La contraseña debe tener al menos 6 caracteres"
      />
    );
  }

  if (typeof username === 'string' && username.length < 3) {
    return c.render(
      <InitialSetupView
        c={c}
        error="El nombre de usuario debe tener al menos 3 caracteres"
      />
    );
  }

  const success = await createInitialAdmin(
    username as string,
    password as string
  );

  if (success) {
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
      <InitialSetupView c={c} error="No se pudo crear el administrador" />
    );
  }
});

dashboard.get('/login', async (c) => {
  const adminExists = await hasAdmins();

  if (!adminExists) {
    return c.redirect('/dashboard/setup');
  }

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
  type Product = {
    title: string;
    url: string;
  };

  const products: Product[] = [
    {
      title: 'Collections',
      url: '/dashboard/collections',
    },
    {
      title: 'Files',
      url: '/dashboard/files',
    },
    {
      title: 'Users',
      url: '/dashboard/users',
    },
    {
      title: 'API',
      url: '/',
    },
  ];

  const ProductFC = (product: Product) => {
    return (
      <a
        href={product.url}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          background: 'none',
          boxShadow: 'none',
        }}
      >
        <article
          style={{
            padding: '2rem',
          }}
        >
          <strong>{product.title}</strong>
        </article>
      </a>
    );
  };

  return c.html(
    <Layout style={{ userSelect: 'none' }} title="Overview">
      <h1>Overview</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
      >
        {products.map((product) => (
          <ProductFC {...product} />
        ))}
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
