import type { FC } from 'hono/jsx';

type NavProps = {
  hideNav?: boolean;
};

export const Nav: FC<NavProps> = ({ hideNav = false }) => {
  if (hideNav) {
    return <></>;
  } else {
    return (
      <>
        <style>{`
        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 300;
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--pico-form-element-border-color);
        }
      `}</style>
        <header>
          <nav class="container" style="user-select: none;">
            <ul>
              <li>
                <a href="/dashboard">
                  <img
                    src="/static/logo.svg"
                    alt="Nobase Logo"
                    style="max-width: 150px; width: 100%; height: auto;"
                  />
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <a href="/dashboard/collections" class="contrast">
                  Collections
                </a>
              </li>
              <li>
                <a href="/dashboard/files" class="contrast">
                  Files
                </a>
              </li>
              <li>
                <a href="/dashboard/users" class="contrast">
                  Users
                </a>
              </li>
              <li>
                <a href="/" class="contrast">
                  API
                </a>
              </li>
              <li>
                <a href="/dashboard/logout" class="secondary">
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
  }
};
