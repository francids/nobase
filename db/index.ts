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

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');
const adapter = new JSONFile<DbSchema>(DB_PATH);
const defaultData: DbSchema = {};
const db = new Low<DbSchema>(adapter, defaultData);

await db.read();

export const createCollection = async (collectionName: string) => {
  await db.read();

  if (!db.data[collectionName]) {
    db.data[collectionName] = [];
    await db.write();
  }
};

export const insertDocument = async (
  collectionName: string,
  data: any
): Promise<string> => {
  await db.read();

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
