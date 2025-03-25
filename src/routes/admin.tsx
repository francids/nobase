/** @jsxImportSource hono/jsx */

import { Hono } from 'hono';

const adminRoutes = new Hono();

adminRoutes.get('/', (c) => {
  c.res.headers.set('Content-Type', 'text/plain');
  return c.text('nobase is running');
});

adminRoutes.get('/docs', (c) => {
  return c.html(
    <>
      <h1>API Documentation</h1>
      <h2>Users</h2>
      <ul>
        <li>POST /auth/register: Register a new user</li>
        <li>POST /auth/login: Login</li>
      </ul>
      <h2>Data</h2>
      <ul>
        <li>POST /database/:collection: Create a new collection</li>
        <li>GET /database/:collection: Get all documents from a collection</li>
        <li>GET /database/:collection/:id: Get a document by ID</li>
        <li>POST /database/:collection: Insert a new document</li>
        <li>PUT /database/:collection/:id: Update a document by ID</li>
        <li>DELETE /database/:collection/:id: Delete a document by ID</li>
      </ul>
      <h2>Files</h2>
      <ul>
        <li>POST /storage/upload: Upload a file</li>
        <li>GET /storage/files/:filename: Get a file</li>
      </ul>
    </>
  );
});

export default adminRoutes;
