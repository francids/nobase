import type { FC } from 'hono/jsx';
import logo from '../../static/logo.svg' with { type: 'file' };
import { file } from 'bun';

type NavProps = {
  hideNav?: boolean;
};

export const Nav: FC<NavProps> = async ({ hideNav = false }) => {
  const logoFile = file(logo);
  const logoContent = await logoFile.text();
  const logoBase64 = Buffer.from(logoContent).toString('base64');
  const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`;

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
                    src={logoDataUri}
                    alt="Nobase Logo"
                    style={{
                      maxWidth: '150px',
                      width: '100%',
                      height: 'auto',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
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
                <a href="/docs" class="contrast">
                  API Docs
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
