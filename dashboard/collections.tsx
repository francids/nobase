import { Hono } from 'hono';
import { CollectionsView } from './views/collections';
import { DocumentsView } from './views/documents';
import { CreateDocumentView } from './views/documents/create';
import { getCollectionSchema, insertDocument } from '../db';

const collectionRoutes = new Hono();

collectionRoutes.get('/', (c) => c.render(<CollectionsView c={c} />));

collectionRoutes.get('/:collection', (c) => c.render(<DocumentsView c={c} />));

collectionRoutes.get('/:collection/create', (c) =>
  c.render(<CreateDocumentView c={c} />)
);

collectionRoutes.post('/:collection/create', async (c) => {
  const collection = c.req.param('collection');
  const schema = await getCollectionSchema(collection);
  if (!schema)
    return c.render(
      <CreateDocumentView c={c} error="Collection schema not found" />
    );
  try {
    await insertDocument(collection, await c.req.parseBody());
    return c.redirect(`/dashboard/collections/${collection}`);
  } catch (error) {
    return c.render(
      <CreateDocumentView c={c} error="Failed to create document" />
    );
  }
});

export default collectionRoutes;
