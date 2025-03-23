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
        <h1>nobase admin</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Inicie sesión para acceder al panel de administración
        </p>

        {error && (
          <div
            style={{
              background: '#ffeeee',
              border: '1px solid #ff8888',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px',
              color: '#cc0000',
            }}
          >
            {error}
          </div>
        )}

        <form
          action="/dashboard/login"
          method="post"
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button
            type="submit"
            class="button"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </Layout>
  );
};
