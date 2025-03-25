import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import router from './routes';

const app = new Hono();
const port = process.env.PORT || 3000;

app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }));

app.route('/', router);

app.all('*', (c) => {
  return c.json({ error: 'No Found' }, 404);
});

Bun.serve({
  fetch: app.fetch,
  port: port,
});

console.log(`Server listening on http://localhost:${port}`);
