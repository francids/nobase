import { Hono } from 'hono';
import { Layout } from './components/Layout';
import { CollectionsView } from './views/collections';
import { DocumentsView } from './views/documents';
import { FilesView } from './views/files';
import { UserListView } from './views/users';

const dashboard = new Hono();

dashboard.get('/', (c) => {
  return c.html(
    <Layout>
      <div class="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div class="dashboard-cards">
          <a href="/dashboard/collections" class="card">
            <h2>Collections</h2>
            <p>Manage database collections</p>
          </a>
          <a href="/dashboard/files" class="card">
            <h2>Files</h2>
            <p>Manage uploaded files</p>
          </a>
          <a href="/dashboard/users" class="card">
            <h2>Users</h2>
            <p>Manage user accounts</p>
          </a>
        </div>
      </div>
    </Layout>
  );
});

dashboard.get('/collections', (c) => c.render(<CollectionsView c={c} />));
dashboard.get('/collections/:collection', (c) =>
  c.render(<DocumentsView c={c} />)
);
dashboard.get('/files', (c) => c.render(<FilesView c={c} />));
dashboard.get('/users', (c) => c.render(<UserListView c={c} />));

export default dashboard;
