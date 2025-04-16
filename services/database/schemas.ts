import { text, json, pgTable, date } from 'drizzle-orm/pg-core';
import type { CollectionSchema, Document } from '../../interfaces/collection';

export const adminUsers = pgTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const collectionSchemas = pgTable('collection_schemas', {
  collectionName: text('collection_name').primaryKey(),
  schema: json('schema').$type<CollectionSchema>().notNull(),
});

export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  collectionName: text('collection_name').notNull(),
  data: json('data').$type<Document>().notNull(),
});
