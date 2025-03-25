import type { FC } from 'hono/jsx';
import { css } from 'hono/css';

type AlertType = 'danger' | 'warning' | 'success';

type AlertProps = {
  type: AlertType;
  children: string;
};

export const Alert: FC<AlertProps> = ({ type, children }) => {
  const alertCss = css`
    /* Basic alert styles */
    .alert {
      --font-size: 1rem;
      --spacing: 1rem;
      --form-element-spacing-vertical: 0.75rem;
      --form-element-spacing-horizontal: 1rem;
      --border-radius: 0.25rem;

      margin-bottom: var(--spacing);
      padding: var(--form-element-spacing-vertical)
        var(--form-element-spacing-horizontal);
      border-radius: var(--border-radius);
      color: var(--color);
      background-color: var(--background-color);
      border: 1px solid var(--background-color);

      /* Icon configuration */
      background-image: var(--icon);
      background-position: center left var(--form-element-spacing-vertical);
      background-size: calc(var(--font-size) * 1.5) auto;
      background-repeat: no-repeat;
      padding-left: calc(
        var(--form-element-spacing-vertical) * 2 + calc(var(--font-size) * 1.5)
      );
    }

    .alert-danger {
      --background-color: #ffebee;
      --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b71c1c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 16l4-4M14 16l-4-4M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z'%3E%3C/path%3E%3C/svg%3E");
      --color: #b71c1c;
    }

    .alert-warning {
      --background-color: #fff8e1;
      --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23c85700' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
      --color: #c85700;
    }

    .alert-success {
      --background-color: #e8f5e9;
      --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231b5e20' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6L9 17l-5-5'%3E%3C/path%3E%3C/svg%3E");
      --color: #1b5e20;
    }
  `;

  return (
    <>
      <div class={alertCss}>
        <div class={`alert alert-${type}`}>{children}</div>
      </div>
    </>
  );
};
