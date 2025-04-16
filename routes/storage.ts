import { Hono } from 'hono';
import { storeFile, getStoredFile } from '../services/storage-service';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const storage = new Hono();

const storageSchema = z.object({
  file: z.string().min(1, 'Base64 file is required'),
  filename: z.string().min(1, 'Filename is required'),
});

storage.post('/upload', zValidator('json', storageSchema), async (c) => {
  try {
    const { file, filename } = c.req.valid('json');

    const buffer = Buffer.from(file, 'base64');
    const blob = new Blob([buffer]);
    const fn = await storeFile(blob, filename);

    if (fn) {
      return c.json({ fn, message: 'File uploaded successfully' }, 201);
    } else {
      return c.json({ error: 'Error uploading file' }, 500);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return c.json(
      {
        error: 'Error processing request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      400
    );
  }
});

storage.get('/files/:filename', async (c) => {
  const { filename } = c.req.param();

  try {
    const result = await getStoredFile(filename);

    if (result.file) {
      return new Response(result.file, {
        headers: {
          'Content-Type': result.contentType,
        },
      });
    } else {
      return c.text('File not found', 404);
    }
  } catch (err) {
    console.error('Error serving file:', err);
    return c.text('Error serving file', 500);
  }
});

export default storage;
