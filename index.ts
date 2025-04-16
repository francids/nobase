import { Hono } from 'hono';
import router from './routes';

const app = new Hono();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';
const protocol = process.env.PROTOCOL || 'http';

app.route('/', router);

app.all('*', (c) => {
  return c.json({ error: 'No Found' }, 404);
});

const server = Bun.serve({
  fetch: app.fetch,
  port: port,
  hostname: hostname,
});

const primary = '\x1b[38;2;24;104;219m'; // #1868DB
// const secondary = '\x1b[38;2;200;226;241m'; // #C8E2F1
const reset = '\x1b[0m'; // Reset
const mainUrl = `${protocol}://${server.hostname}:${server.port}`;

console.log(`\x1b[1mnobase\x1b[0m on ${primary}${mainUrl}/${reset}`);
