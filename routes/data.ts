import { Hono } from 'hono';
import {
  getDocuments,
  getDocumentById,
  insertDocument,
  updateDocumentById,
  deleteDocumentById,
  setCollectionSchema,
  getCollectionSchema,
  deleteCollectionSchema,
} from '../db';
import { z } from 'zod';

const dataRoutes = new Hono();

dataRoutes.get('/:collection/schema', async (c) => {
  const { collection } = c.req.param();
  const schema = await getCollectionSchema(collection);
  if (schema) {
    return c.json(schema);
  } else {
    return c.json(
      { error: `Schema for collection "${collection}" not found` },
      404
    );
  }
});

dataRoutes.post('/:collection/schema', async (c) => {
  const { collection } = c.req.param();
  const schemaDefinition = await c.req.json();

  try {
    const schema = z.object(
      Object.entries(schemaDefinition).reduce((acc, [key, type]) => {
        switch (type) {
          case 'string':
            acc[key] = z.string();
            break;
          case 'number':
            acc[key] = z.number();
            break;
          case 'boolean':
            acc[key] = z.boolean();
            break;
          case 'object':
            acc[key] = z.object({});
            break;
          case 'array':
            acc[key] = z.array(z.any());
            break;
          default:
            throw new Error(`Unsupported type "${type}" for key "${key}"`);
        }
        return acc;
      }, {} as Record<string, any>)
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: 'Invalid schema' }, 400);
  }

  await setCollectionSchema(collection, schemaDefinition);

  return c.json({
    message: `Schema for collection "${collection}" set successfully`,
  });
});

dataRoutes.delete('/:collection/schema', async (c) => {
  const { collection } = c.req.param();
  await deleteCollectionSchema(collection);
  return c.json({
    message: `Schema for collection "${collection}" deleted successfully`,
  });
});

dataRoutes.post('/:collection', async (c) => {
  const { collection } = c.req.param();
  const data = await c.req.json();

  const schemaDefinition = await getCollectionSchema(collection);
  if (!schemaDefinition) {
    return c.json({ error: `Collection "${collection}" does not exist` }, 404);
  }

  try {
    const schema = z.object(
      Object.entries(schemaDefinition).reduce((acc, [key, type]) => {
        switch (type) {
          case 'string':
            acc[key] = z.string();
            break;
          case 'number':
            acc[key] = z.number();
            break;
          case 'boolean':
            acc[key] = z.boolean();
            break;
          case 'object':
            acc[key] = z.object({});
            break;
          case 'array':
            acc[key] = z.array(z.any());
            break;
          default:
            throw new Error(`Unsupported type "${type}" for key "${key}"`);
        }
        return acc;
      }, {} as Record<string, any>)
    );
    schema.parse(data);
    const id = await insertDocument(collection, data);
    return c.json({ id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ error: err.errors }, 400);
    }
    return c.json({ error: 'Invalid document' }, 400);
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
