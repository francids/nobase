import { Hono } from 'hono';
import overviewRoutes from './overview';
import setupRoutes from './setup';
import authRoutes from './auth';
import collectionRoutes from './collections';
import fileRoutes from './files';
import userRoutes from './users';
import { requireAuth } from './middleware/authMiddleware';

const dashboard = new Hono();

dashboard.route('/setup', setupRoutes);
dashboard.route('/', authRoutes);
dashboard.use('*', requireAuth);
dashboard.route('/', overviewRoutes);
dashboard.route('/collections', collectionRoutes);
dashboard.route('/files', fileRoutes);
dashboard.route('/users', userRoutes);

export default dashboard;
