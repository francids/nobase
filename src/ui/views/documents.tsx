import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { getDocuments } from '../../db';
import { Layout } from '../components/Layout';

type DocumentsViewProps = {
  c: Context;
};

export const DocumentsView: FC<DocumentsViewProps> = async ({ c }) => {
  const collection = c.req.param('collection');
  const documents = await getDocuments(collection);

  return (
    <Layout title={`Documents in ${collection}`}>
      <div class="dashboard-container">
        <h1>Documents in "{collection}"</h1>
        <div style={{ margin: '20px 0' }}>
          <a href={`/dashboard/collections/${collection}/new`} class="button">
            Add New Document
          </a>
          <a
            href="/dashboard/collections"
            class="button"
            style={{ marginLeft: '10px' }}
          >
            Back to Collections
          </a>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Content Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <tr>
                  <td>{doc.id}</td>
                  <td>
                    {JSON.stringify(doc).substring(0, 50)}
                    {JSON.stringify(doc).length > 50 ? '...' : ''}
                  </td>
                  <td>
                    <a
                      href={`/dashboard/collections/${collection}/edit/${doc.id}`}
                      class="button"
                    >
                      Edit
                    </a>
                    <button
                      onclick={`if(confirm('Are you sure?')) fetch('/database/${collection}/${doc.id}', {method: 'DELETE'}).then(() => window.location.reload())`}
                      class="button danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={3}>No documents found in this collection.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
