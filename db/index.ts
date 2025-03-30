import { v4 as uuidv4 } from 'uuid';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import fs from 'fs';
import path from 'path';

export interface Document {
  id: string;
  [key: string]: any;
}

interface DbSchema {
  [collection: string]: Document[];
}

interface CollectionSchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');
const adapter = new JSONFile<DbSchema>(DB_PATH);
const defaultData: DbSchema = {};
const db = new Low<DbSchema>(adapter, defaultData);

await db.read();

const SCHEMA_PATH = path.join(DATA_DIR, 'schemas.json');

const loadSchemas = (): { [collection: string]: CollectionSchema } => {
  if (fs.existsSync(SCHEMA_PATH)) {
    const rawData = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    return JSON.parse(rawData);
  }
  return {};
};

const saveSchemas = (schemas: { [collection: string]: CollectionSchema }) => {
  fs.writeFileSync(SCHEMA_PATH, JSON.stringify(schemas, null, 2));
};

const collectionSchemas: { [collection: string]: CollectionSchema } =
  loadSchemas();

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

export const setCollectionSchema = async (
  collectionName: string,
  schema: CollectionSchema
) => {
  collectionSchemas[collectionName] = schema;
  saveSchemas(collectionSchemas);
};

export const getCollectionSchema = async (
  collectionName: string
): Promise<CollectionSchema | undefined> => {
  await db.read();
  return collectionSchemas[collectionName];
};

export const deleteCollectionSchema = async (collectionName: string) => {
  delete collectionSchemas[collectionName];
  saveSchemas(collectionSchemas);
};

export const insertDocument = async (
  collectionName: string,
  data: any
): Promise<string> => {
  await db.read();

  const schema = collectionSchemas[collectionName];
  if (schema && !validateDocument(schema, data)) {
    throw new Error(
      `Document does not match the schema for collection "${collectionName}"`
    );
  }

  const id = uuidv4();
  const document: Document = { id, ...data };

  if (!db.data[collectionName]) {
    db.data[collectionName] = [];
  }

  db.data[collectionName].push(document);
  await db.write();
  return id;
};

export const getDocuments = async (
  collectionName: string
): Promise<Document[]> => {
  await db.read();
  return db.data[collectionName] || [];
};

export const getDocumentById = async (
  collectionName: string,
  id: string
): Promise<Document | undefined> => {
  await db.read();
  return db.data[collectionName]?.find((doc) => doc.id === id);
};

export const updateDocumentById = async (
  collectionName: string,
  id: string,
  newData: any
): Promise<boolean> => {
  await db.read();

  const schema = collectionSchemas[collectionName];
  if (schema && !validateDocument(schema, newData)) {
    throw new Error(
      `Document does not match the schema for collection "${collectionName}"`
    );
  }

  const collection = db.data[collectionName];
  if (!collection) return false;

  const index = collection.findIndex((doc) => doc.id === id);
  if (index === -1) return false;

  db.data[collectionName][index] = {
    ...db.data[collectionName][index],
    ...newData,
  };
  await db.write();
  return true;
};

export const deleteDocumentById = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  await db.read();

  const collection = db.data[collectionName];
  if (!collection) return false;

  const index = collection.findIndex((doc) => doc.id === id);
  if (index === -1) return false;

  db.data[collectionName].splice(index, 1);
  await db.write();
  return true;
};

export const getCollections = async (): Promise<string[]> => {
  await db.read();
  return Object.keys(db.data);
};
