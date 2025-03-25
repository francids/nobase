import { Hono } from 'hono';
import {
  createCollection,
  getDocuments,
  getDocumentById,
  insertDocument,
  updateDocumentById,
  deleteDocumentById,
} from '../db';

const dataRoutes = new Hono();

dataRoutes.post('/:collection', async (c) => {
  const { collection } = c.req.param();

  if (c.req.header('content-type')?.includes('application/json')) {
    const body = await c.req.json();
    const id = await insertDocument(collection, body);
    return c.json({ id, message: 'Document inserted successfully' }, 201);
  } else {
    await createCollection(collection);
    return c.json({ message: `Collection "${collection}" created` }, 201);
  }
});

dataRoutes.get('/:collection', async (c) => {
  const { collection } = c.req.param();
  const documents = await getDocuments(collection);
  return c.json(documents);
});

dataRoutes.get('/:collection/:id', async (c) => {
  const { collection, id } = c.req.param();
  const document = await getDocumentById(collection, id);
  if (document) {
    return c.json(document);
  } else {
    return c.json({ error: 'Document not found' }, 404);
  }
});

dataRoutes.put('/:collection/:id', async (c) => {
  const { collection, id } = c.req.param();
  const body = await c.req.json();
  const updated = await updateDocumentById(collection, id, body);
  if (updated) {
    return c.json({ message: 'Document updated successfully' });
  } else {
    return c.json({ error: 'Document not found' }, 404);
  }
});

dataRoutes.delete('/:collection/:id', async (c) => {
  const { collection, id } = c.req.param();
  const deleted = await deleteDocumentById(collection, id);
  if (deleted) {
    return c.json({ message: 'Document deleted successfully' });
  } else {
    return c.json({ error: 'Document not found' }, 404);
  }
});

export default dataRoutes;
