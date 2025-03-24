import type { FC } from 'hono/jsx';

type NavProps = {
  hideNav?: boolean;
};

export const Nav: FC<NavProps> = ({ hideNav = false }) => {
  if (hideNav) {
    return <></>;
  } else {
    return (
      <nav class="container">
        <ul>
          <li>
            <strong>nobase admin</strong>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/collections">Collections</a>
          </li>
          <li>
            <a href="/dashboard/files">Files</a>
          </li>
          <li>
            <a href="/dashboard/users">Users</a>
          </li>
          <li>
            <a href="/">API</a>
          </li>
          <li>
            <a href="/dashboard/logout" role="button" class="secondary outline">
              Cerrar sesión
            </a>
          </li>
        </ul>
      </nav>
    );
  }
};
