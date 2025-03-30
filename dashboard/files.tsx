import { Hono } from 'hono';
import { FilesView } from './views/files';

const fileRoutes = new Hono();

fileRoutes.get('/', (c) => c.render(<FilesView c={c} />));

export default fileRoutes;
