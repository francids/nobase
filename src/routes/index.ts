import { Hono } from 'hono';
import adminRoutes from './admin';
import authRoutes from './auth';
import dataRoutes from './data';
import fileRoutes from './files';

const router = new Hono();

router.route('/', adminRoutes);
router.route('/auth', authRoutes);
router.route('/storage', fileRoutes);
router.route('/database', dataRoutes);

export default router;
