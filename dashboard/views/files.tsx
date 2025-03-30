import type { FC } from 'hono/jsx';
import type { Context } from 'hono';
import { Layout } from '../components/Layout';
import fs from 'fs';
import path from 'path';

type FilesViewProps = {
  c: Context;
};

export const FilesView: FC<FilesViewProps> = ({ c }) => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  let files: string[] = [];

  if (fs.existsSync(uploadDir)) {
    files = fs.readdirSync(uploadDir);
  }

  return (
    <Layout title="File Management">
      <div class="dashboard-container">
        <h1>File Management</h1>
        <div style={{ margin: '20px 0' }}>
          <form
            action="/storage/upload"
            method="post"
            enctype="multipart/form-data"
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <input type="file" name="file" required />
            <button type="submit" class="button">
              Upload File
            </button>
          </form>
        </div>

        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr>
                  <td>{file}</td>
                  <td>
                    <a
                      href={`/storage/files/${file}`}
                      class="button"
                      target="_blank"
                    >
                      View
                    </a>
                    <button
                      onclick={`if(confirm('Are you sure?')) fetch('/api/files/${file}', {method: 'DELETE'}).then(() => window.location.reload())`}
                      class="button danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan={2}>No files found. Upload your first file.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};
