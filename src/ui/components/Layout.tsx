import type { FC, PropsWithChildren } from 'hono/jsx';

type LayoutProps = PropsWithChildren<{
  title?: string;
}>;

export const Layout: FC<LayoutProps> = ({
  children,
  title = 'nobase admin',
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          body {
            display: flex;
            background-color: #f5f5f5;
            min-height: 100vh;
          }
          
          .sidebar {
            width: 250px;
            background-color: #2c3e50;
            color: white;
            padding: 20px 0;
            height: 100vh;
            position: fixed;
          }
          
          .sidebar-header {
            padding: 0 20px 20px;
            border-bottom: 1px solid #34495e;
          }
          
          .sidebar-nav {
            margin-top: 20px;
          }
          
          .sidebar-nav a {
            display: block;
            padding: 10px 20px;
            color: #ecf0f1;
            text-decoration: none;
            transition: background-color 0.2s;
          }
          
          .sidebar-nav a:hover {
            background-color: #34495e;
          }
          
          .content {
            flex: 1;
            padding: 20px;
            margin-left: 250px;
          }
          
          .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
          }
          
          .card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-decoration: none;
            color: #333;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          
          th {
            background-color: #2c3e50;
            color: white;
          }
          
          tr:hover {
            background-color: #f5f5f5;
          }
          
          .button {
            display: inline-block;
            background-color: #3498db;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          
          .button:hover {
            background-color: #2980b9;
          }
          
          .button.danger {
            background-color: #e74c3c;
          }
          
          .button.danger:hover {
            background-color: #c0392b;
          }
          
          .form-group {
            margin-bottom: 15px;
          }
          
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          
          input, textarea, select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
        `}</style>
      </head>
      <body>
        <div class="sidebar">
          <div class="sidebar-header">
            <h2>NoBase Admin</h2>
          </div>
          <nav class="sidebar-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/dashboard/collections">Collections</a>
            <a href="/dashboard/files">Files</a>
            <a href="/dashboard/users">Users</a>
            <a href="/">Back to API</a>
          </nav>
        </div>
        <main class="content">{children}</main>
        <script>{`
          // Simple client-side script for interactive elements
          document.addEventListener('DOMContentLoaded', () => {
            // Add any client-side JavaScript needed for the dashboard
          });
        `}</script>
      </body>
    </html>
  );
};
