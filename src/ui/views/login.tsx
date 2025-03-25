import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';
import { Alert } from '../components/Alert';

type LoginViewProps = {
  c: Context;
  error?: string;
};

export const LoginView: FC<LoginViewProps> = ({ c, error }) => {
  return (
    <Layout title="Login" hideNav={true}>
      <article style={{ maxWidth: '500px', margin: '0 auto' }}>
        {error && <Alert type="danger">{error}</Alert>}

        <form action="/dashboard/login" method="post">
          <label for="username">User</label>
          <input type="text" id="username" name="username" required />

          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
          <input
            type="submit"
            value="Login"
            style={{ width: '100%', marginTop: '10px' }}
          />
        </form>
      </article>
    </Layout>
  );
};
