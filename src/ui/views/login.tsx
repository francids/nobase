import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';

type LoginViewProps = {
  c: Context;
  error?: string;
};

export const LoginView: FC<LoginViewProps> = ({ c, error }) => {
  return (
    <Layout title="Login - Admin Dashboard" hideNav={true}>
      <div
        class="dashboard-container"
        style={{ maxWidth: '500px', margin: '50px auto' }}
      >
        <article>
          <header>
            <p>Inicie sesión para acceder al panel de administración</p>
          </header>

          {error && <div role="alert">{error}</div>}

          <form action="/dashboard/login" method="post">
            <fieldset>
              <label for="username">
                Usuario
                <input type="text" id="username" name="username" required />
              </label>

              <label for="password">
                Contraseña
                <input type="password" id="password" name="password" required />
              </label>
            </fieldset>
            <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
              Iniciar Sesión
            </button>
          </form>
        </article>
      </div>
    </Layout>
  );
};
