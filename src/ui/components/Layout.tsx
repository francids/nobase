import type { FC, PropsWithChildren } from 'hono/jsx';
import { css, Style } from 'hono/css';
import { Nav } from './Nav';

type LayoutProps = PropsWithChildren<{
  title?: string;
  hideNav?: boolean;
  style?: Record<string, string>;
}>;

export const Layout: FC<LayoutProps> = ({
  children,
  title = 'nobase admin',
  hideNav = false,
  style = {},
}) => {
  const themeStyle = css`
    :root {
      --pico-font-size: 87.5%;
      /* Original: 100% */
      --pico-line-height: 1.25;
      /* Original: 1.5 */
      --pico-form-element-spacing-vertical: 0.5rem;
      /* Original: 1rem */
      --pico-form-element-spacing-horizontal: 1rem;
      /* Original: 1.25rem */
      --pico-border-radius: 0.375rem;
      /* Original: 0.25rem */
    }

    @media (min-width: 576px) {
      :root {
        --pico-font-size: 87.5%;
        /* Original: 106.25% */
      }
    }

    @media (min-width: 768px) {
      :root {
        --pico-font-size: 87.5%;
        /* Original: 112.5% */
      }
    }

    @media (min-width: 1024px) {
      :root {
        --pico-font-size: 87.5%;
        /* Original: 118.75% */
      }
    }

    @media (min-width: 1280px) {
      :root {
        --pico-font-size: 87.5%;
        /* Original: 125% */
      }
    }

    @media (min-width: 1536px) {
      :root {
        --pico-font-size: 87.5%;
        /* Original: 131.25% */
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      --pico-font-weight: 600;
      /* Original: 700 */
    }

    article {
      border: 1px solid var(--pico-muted-border-color);
      /* Original doesn't have a border */
      border-radius: calc(var(--pico-border-radius) * 2);
      /* Original: var(--pico-border-radius) */
    }

    article > footer {
      border-radius: calc(var(--pico-border-radius) * 2);
      /* Original: var(--pico-border-radius) */
    }
  `;

  return (
    <html class={themeStyle}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <Style />
      </head>
      <body style={style}>
        <header class="sticky-header">
          <Nav hideNav={hideNav} />
        </header>
        <style>{`
          .sticky-header {
            position: sticky;
            top: 0;
            z-index: 300;
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--pico-form-element-border-color);
          }
        `}</style>
        <main class="container">
          {children}
          <style>{`
            main {
              margin-top: 1rem;
            }
          `}</style>
        </main>
      </body>
    </html>
  );
};
