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
        <header>
          <h1>Database Collections</h1>
        </header>

        <form action="/dashboard/collections/create" method="post" class="grid">
          <div>
            <input
              type="text"
              name="collectionName"
              placeholder="New collection name"
              required
            />
          </div>
          <div>
            <button type="submit">Create Collection</button>
          </div>
        </form>

        {collections.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Collection Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr>
                  <td>{collection}</td>
                  <td>
                    <a
                      href={`/dashboard/collections/${collection}`}
                      role="button"
                    >
                      View Documents
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <article>
            <p>No collections found. Create your first collection.</p>
          </article>
        )}
      </div>
    </Layout>
  );
};
