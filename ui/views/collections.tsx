import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { getAllSchemas } from '../../db';
import { Layout } from '../components/Layout';

type CollectionsViewProps = {
  c: Context;
};

export const CollectionsView: FC<CollectionsViewProps> = async () => {
  const collectionsSchema = await getAllSchemas();
  const collections = Object.keys(collectionsSchema || {});

  return (
    <Layout title="Collections">
      <header>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            userSelect: 'none',
          }}
        >
          <h1>Collections</h1>
          <button>Create Collection</button>
        </div>
      </header>

      {collections.length > 0 ? (
        <div class="grid">
          {collections.map((collection) => (
            <article
              style={{
                borderRadius: '8px',
                padding: '1.5rem',
                userSelect: 'none',
              }}
            >
              <div class="grid">
                <h3>{collection}</h3>
                <a
                  href={`/dashboard/collections/${collection}`}
                  role="button"
                  class="secondary"
                >
                  View Documents
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article
          style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <header>
            <h2>No collections yet</h2>
          </header>
          <p>Start by creating your first collection to store your data.</p>
          <footer>
            <button>Create your first collection</button>
          </footer>
        </article>
      )}
    </Layout>
  );
};
