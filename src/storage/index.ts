import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import type { Context } from 'hono';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const storeFile = async (file: File): Promise<string | undefined> => {
  if (!file) return undefined;

  const filename = `${uuidv4()}-${file.name}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  try {
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return filename;
  } catch (err) {
    console.error('Error saving the file:', err);
    return undefined;
  }
};

export const serveFile = (filename: string, c: Context): Response => {
  const filepath = path.join(UPLOAD_DIR, filename);
  if (fs.existsSync(filepath)) {
    const fileContent = fs.readFileSync(filepath);
    const contentType = getContentType(filename);
    return new Response(fileContent, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } else {
    return c.text('File not found', 404);
  }
};

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}
