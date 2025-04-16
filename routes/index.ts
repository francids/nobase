import { Hono } from 'hono';
import auth from './auth';
import collections from './collections';
import storage from './storage';

const router = new Hono().basePath('/api');

router.route('/auth', auth);
router.route('/collections', collections);
router.route('/storage', storage);

export default router;
