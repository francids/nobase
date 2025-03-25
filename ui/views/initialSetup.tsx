import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';

type InitialSetupViewProps = {
  c: Context;
  error?: string;
};

export const InitialSetupView: FC<InitialSetupViewProps> = ({ c, error }) => {
  return (
    <Layout title="Configuración Inicial - NoBase" hideNav={true}>
      <div
        class="dashboard-container"
        style={{ maxWidth: '500px', margin: '50px auto' }}
      >
        <article>
          <header>
            <h2>Bienvenido a NoBase</h2>
            <p>Cree su cuenta de administrador para comenzar</p>
          </header>

          {error && <div role="alert">{error}</div>}

          <form action="/dashboard/setup" method="post">
            <fieldset>
              <label for="username">
                Usuario Administrador
                <input type="text" id="username" name="username" required />
              </label>

              <label for="password">
                Contraseña
                <input type="password" id="password" name="password" required />
              </label>

              <label for="confirmPassword">
                Confirmar Contraseña
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                />
              </label>
            </fieldset>
            <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
              Crear Administrador
            </button>
          </form>
        </article>
      </div>
    </Layout>
  );
};
