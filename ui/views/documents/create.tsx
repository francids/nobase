import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { getCollectionSchema } from '../../../db';
import { Layout } from '../../components/Layout';
import { Alert } from '../../components/Alert';

type CreateDocumentViewProps = {
  c: Context;
  error?: string;
};

export const CreateDocumentView: FC<CreateDocumentViewProps> = async ({
  c,
  error,
}) => {
  const collection = c.req.param('collection');
  const schema = await getCollectionSchema(collection);

  return (
    <Layout hideNav>
      <section
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header>
            <h1>Create document in "{collection}"</h1>
          </header>
          <form
            action={`/dashboard/collections/${collection}/create`}
            method="post"
          >
            {error && <Alert type="danger">{error}</Alert>}

            {schema &&
              Object.keys(schema).map((field) => (
                <div key={field}>
                  <label htmlFor={field}>{field}</label>
                  <input type="text" id={field} name={field} />
                </div>
              ))}
            <div role="group">
              <button type="submit">Save Document</button>
              <a
                href={`/dashboard/collections/${collection}`}
                role="button"
                class="secondary"
              >
                Back to Collection
              </a>
            </div>
          </form>
        </article>
      </section>
    </Layout>
  );
};
