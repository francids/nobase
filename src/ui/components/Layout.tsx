import type { FC, PropsWithChildren } from 'hono/jsx';
import { Nav } from './Nav';
import './theme.css';

type LayoutProps = PropsWithChildren<{
  title?: string;
  hideNav?: boolean;
}>;

export const Layout: FC<LayoutProps> = ({
  children,
  title = 'nobase admin',
  hideNav = false,
}) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
      </head>
      <body>
        <Nav hideNav={hideNav} />
        <main class="container">{children}</main>
      </body>
    </html>
  );
};
