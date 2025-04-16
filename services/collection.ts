import { eq, and } from 'drizzle-orm';
import { getDbConnection } from './database/connection';
import { collections, collectionSchemas } from './database/schemas';
import type { CollectionSchema, Document } from '../interfaces/collection';

export const setCollectionSchema = async (
  collectionName: string,
  schema: CollectionSchema
) => {
  const db = await getDbConnection();

  await db
    .insert(collectionSchemas)
    .values({
      collectionName,
      schema,
    })
    .onConflictDoUpdate({
      target: [collectionSchemas.collectionName],
      set: {
        schema,
      },
    });
};

export const getCollectionSchema = async (
  collectionName: string
): Promise<CollectionSchema | undefined> => {
  const db = await getDbConnection();

  const result = await db
    .select({ schema: collectionSchemas.schema })
    .from(collectionSchemas)
    .where(eq(collectionSchemas.collectionName, collectionName))
    .limit(1)
    .then((result) => result[0]);

  return result ? result.schema : undefined;
};

export const getAllSchemas = async (): Promise<
  { [collection: string]: CollectionSchema } | undefined
> => {
  const db = await getDbConnection();

  const schemas = await db
    .select({
      collection_name: collectionSchemas.collectionName,
      schema: collectionSchemas.schema,
    })
    .from(collectionSchemas);

  if (!schemas) return undefined;

  const result: { [collection: string]: CollectionSchema } = {};
  schemas.forEach((schema) => (result[schema.collection_name] = schema.schema));
  return result;
};

export const deleteCollectionSchema = async (collectionName: string) => {
  const db = await getDbConnection();

  await db
    .delete(collectionSchemas)
    .where(eq(collectionSchemas.collectionName, collectionName));
};

const validateDocument = (schema: CollectionSchema, data: any): boolean => {
  for (const key in schema) {
    const expectedType = schema[key];
    const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
    if (actualType !== expectedType) {
      return false;
    }
  }
  return true;
};

export const insertDocument = async (
  collectionName: string,
  data: Document
): Promise<string> => {
  const db = await getDbConnection();

  const schema = await getCollectionSchema(collectionName);
  if (schema && !validateDocument(schema, data)) {
    throw new Error(
      `Document does not match the schema for collection "${collectionName}"`
    );
  }

  const id = Bun.randomUUIDv7();
  await db.insert(collections).values({ id, collectionName, data });
  return id;
};

export const getDocuments = async (
  collectionName: string
): Promise<Document[]> => {
  const db = await getDbConnection();

  const docs = await db
    .select({
      id: collections.id,
      collectionName: collections.collectionName,
      data: collections.data,
    })
    .from(collections)
    .where(eq(collections.collectionName, collectionName));

  return docs.map((doc) => ({
    id: doc.id,
    collectionName: doc.collectionName,
    data: doc.data,
  }));
};

export const getDocumentById = async (
  collectionName: string,
  id: string
): Promise<Document | undefined> => {
  const db = await getDbConnection();

  const doc = await db
    .select({ data: collections.data })
    .from(collections)
    .where(
      and(
        eq(collections.collectionName, collectionName),
        eq(collections.id, id)
      )
    )
    .limit(1)
    .then((result) => result[0]);

  return doc ? doc.data : undefined;
};

export const updateDocumentById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<boolean> => {
  const db = await getDbConnection();

  const schema = await getCollectionSchema(collectionName);
  if (schema && !validateDocument(schema, newData)) {
    throw new Error(
      `Document does not match the schema for collection "${collectionName}"`
    );
  }

  const existingDoc = await getDocumentById(collectionName, id);
  if (!existingDoc) return false;

  const updatedData = { ...existingDoc, ...newData };

  await db
    .update(collections)
    .set({ data: updatedData })
    .where(
      and(
        eq(collections.id, id),
        eq(collections.collectionName, collectionName)
      )
    );

  return true;
};

export const deleteDocumentById = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  const db = await getDbConnection();

  const result = await db
    .delete(collections)
    .where(
      and(
        eq(collections.id, id),
        eq(collections.collectionName, collectionName)
      )
    );

  return result.affectedRows! > 0;
};

export const getCollections = async (): Promise<string[]> => {
  const db = await getDbConnection();

  const c = await db
    .selectDistinct({
      collection_name: collections.collectionName,
    })
    .from(collections);

  return c.map((col) => col.collection_name);
};
