import { join } from 'path';
import type { BunFile } from 'bun';

const STORAGE_PATH = 'n_files';

export const storeFile = async (
  blob: Blob,
  fileName: string
): Promise<string | undefined> => {
  if (!blob) return undefined;

  const finalName = `${Bun.randomUUIDv7()}-${fileName}`;
  const filepath = join(STORAGE_PATH, finalName);

  try {
    const buffer = await blob.arrayBuffer();
    await Bun.write(filepath, buffer);
    return finalName;
  } catch (err) {
    console.error('Error saving the file:', err);
    return undefined;
  }
};

export const getStoredFile = async (
  filename: string
): Promise<{
  file: BunFile | null;
  contentType: string;
}> => {
  const filepath = join(STORAGE_PATH, filename);
  const file = Bun.file(filepath);

  if (await file.exists()) {
    const contentType = getContentType(filename);
    return { file, contentType };
  }

  return { file: null, contentType: 'application/octet-stream' };
};

const getContentType = (filename: string): string => {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'text/javascript';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
};
