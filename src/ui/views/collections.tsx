import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { getCollections } from '../../db';
import { Layout } from '../components/Layout';

type CollectionsViewProps = {
  c: Context;
};

export const CollectionsView: FC<CollectionsViewProps> = async ({ c }) => {
  const collections = await getCollections();

  return (
    <Layout title="Database Collections">
      <div class="dashboard-container">
        <h1>Database Collections</h1>
        <div style={{ margin: '20px 0' }}>
          <form
            action="/dashboard/collections/create"
            method="post"
            style={{ display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              name="collectionName"
              placeholder="New collection name"
              required
            />
            <button type="submit" class="button">
              Create Collection
            </button>
          </form>
        </div>

        <table>
          <thead>
            <tr>
              <th>Collection Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.length > 0 ? (
              collections.map((collection) => (
                <tr>
                  <td>{collection}</td>
                  <td>
                    <a
                      href={`/dashboard/collections/${collection}`}
                      class="button"
                    >
                      View Documents
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={2}>
                  No collections found. Create your first collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
