import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import type { User } from '../../auth';

interface AuthSchema {
  users: User[];
}

type UserListViewProps = {
  c: Context;
};

export const UserListView: FC<UserListViewProps> = async ({ c }) => {
  const DATA_DIR = path.join(process.cwd(), 'data');
  const AUTH_DB_PATH = path.join(DATA_DIR, 'auth.json');
  const adapter = new JSONFile<AuthSchema>(AUTH_DB_PATH);
  const defaultData: AuthSchema = { users: [] };
  const authDb = new Low<AuthSchema>(adapter, defaultData);

  await authDb.read();
  const users = authDb.data.users;

  return (
    <Layout title="User Management">
      <div class="dashboard-container">
        <h1>User Management</h1>
        <div style={{ margin: '20px 0' }}>
          <a href="/dashboard/users/new" class="button">
            Create New User
          </a>
        </div>

        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>
                    <a href={`/dashboard/users/edit/${user.id}`} class="button">
                      Edit
                    </a>
                    <button
                      onclick={`if(confirm('Are you sure?')) fetch('/api/users/${user.id}', {method: 'DELETE'}).then(() => window.location.reload())`}
                      class="button danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={3}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
