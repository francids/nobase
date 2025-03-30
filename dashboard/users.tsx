import { Hono } from 'hono';
import { UserListView } from './views/users';

const userRoutes = new Hono();

userRoutes.get('/', (c) => c.render(<UserListView c={c} />));

export default userRoutes;
