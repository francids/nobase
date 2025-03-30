import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';
import { Alert } from '../components/Alert';
import logo from '../../static/logo.svg' with { type: 'file' };
import { file } from 'bun';

type LoginViewProps = {
  c: Context;
  error?: string;
};

export const LoginView: FC<LoginViewProps> = async ({ c, error }) => {
  const logoFile = file(logo);
  const logoContent = await logoFile.text();
  const logoBase64 = Buffer.from(logoContent).toString('base64');
  const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`;

  return (
    <Layout title="Login" hideNav={true}>
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <article style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '20px',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <img
              src={logoDataUri}
              alt="Nobase Logo"
              style="max-width: 150px; width: 100%; height: auto"
            />
          </div>

          {error && <Alert type="danger">{error}</Alert>}

          <form action="/dashboard/login" method="post">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
            <input
              type="submit"
              value="Login"
              style={{
                marginBottom: 0,
              }}
            />
          </form>
        </article>
      </section>
    </Layout>
  );
};
