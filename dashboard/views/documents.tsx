import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { getDocuments, getCollectionSchema } from '../../db';
import { Layout } from '../components/Layout';

type DocumentsViewProps = {
  c: Context;
};

export const DocumentsView: FC<DocumentsViewProps> = async ({ c }) => {
  const collection = c.req.param('collection');
  const documents = await getDocuments(collection);
  const schema = await getCollectionSchema(collection);

  const renderFieldValue = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object')
      return JSON.stringify(value).substring(0, 30) + '...';
    return String(value);
  };

  const schemaFields = schema ? Object.keys(schema).slice(0, 5) : [];

  return (
    <Layout title={`Documents in ${collection}`}>
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
          <h1>Documents in "{collection}"</h1>
          <div>
            <a
              href={`/dashboard/collections/${collection}/create`}
              role="button"
            >
              Add New Document
            </a>
            <a
              href="/dashboard/collections"
              role="button"
              class="secondary"
              style={{ marginLeft: '10px' }}
            >
              Back to Collections
            </a>
          </div>
        </div>
      </header>

      {documents.length > 0 ? (
        <article>
          <table class="striped">
            <thead
              style={{
                userSelect: 'none',
              }}
            >
              <tr>
                {/* <th>ID</th> */}
                {schemaFields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  {/* <td>{doc.id}</td> */}
                  {schemaFields.map((field) => (
                    <td key={`${doc.id}-${field}`}>
                      {renderFieldValue(doc[field])}
                    </td>
                  ))}
                  <td
                    style={{
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <button class="outline">Edit</button>
                    <button class="outline secondary">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ) : (
        <article
          style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <header>
            <h2>No documents found in this collection.</h2>
          </header>
          <p>
            Start by creating your first document in the "{collection}"
            collection.
          </p>
          <footer>
            <button>Create your first document</button>
          </footer>
        </article>
      )}
    </Layout>
  );
};
