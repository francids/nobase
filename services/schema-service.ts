import { eq } from 'drizzle-orm';
import { getDbConnection } from './database/connection';
import { collectionSchemas } from './database/schemas';
import type { CollectionSchema } from '../interfaces/collection';

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

export const validateDocument = (
  schema: CollectionSchema,
  data: any
): boolean => {
  for (const key in schema) {
    const expectedType = schema[key];
    const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
    if (actualType !== expectedType) {
      return false;
    }
  }
  return true;
};
