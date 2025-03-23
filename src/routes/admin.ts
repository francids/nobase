import { Hono } from 'hono';
import { getCollections } from '../db';

const adminRoutes = new Hono();

adminRoutes.get('/', async (c) => {
  const collections = await getCollections();

  return c.html(`
    <h1>Simple Admin Panel</h1>
    <p>Welcome to your backend admin panel.</p>
    <p>Available collections: ${collections.join(', ') || 'None'}</p>
    <p><a href="/docs">View API documentation</a></p>
  `);
});

adminRoutes.get('/docs', (c) => {
  return c.html(`
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
  `);
});

export default adminRoutes;
