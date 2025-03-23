import { Hono } from 'hono';
import { storeFile, serveFile } from '../storage';

const fileRoutes = new Hono();

fileRoutes.post('/upload', async (c) => {
  try {
    const contentType = c.req.header('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return c.json(
        {
          error: 'Content type must be multipart/form-data',
        },
        400
      );
    }

    const form = await c.req.formData();
    const file = form.get('file');
    if (!file) {
      return c.json({ error: 'No file was provided' }, 400);
    }

    if (typeof file === 'string') {
      return c.json({ error: 'Invalid file provided' }, 400);
    }

    const filename = await storeFile(file);
    if (filename) {
      return c.json({ filename, message: 'File uploaded successfully' }, 201);
    } else {
      return c.json({ error: 'Error uploading file' }, 500);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return c.json(
      {
        error: 'Error processing form',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      400
    );
  }
});

fileRoutes.get('/files/:filename', (c) => {
  const { filename } = c.req.param();
  return serveFile(filename, c);
});

export default fileRoutes;
