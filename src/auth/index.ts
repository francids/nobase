import { v4 as uuidv4 } from 'uuid';
import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

interface AuthSchema {
  users: User[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const AUTH_DB_PATH = path.join(DATA_DIR, 'auth.json');
const adapter = new JSONFile<AuthSchema>(AUTH_DB_PATH);
const defaultData: AuthSchema = { users: [] };
const authDb = new Low<AuthSchema>(adapter, defaultData);

await authDb.read();

export const registerUser = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  await authDb.read();

  if (authDb.data.users.find((user) => user.username === username)) {
    return undefined;
  }

  const id = uuidv4();
  const passwordHash = password;

  authDb.data.users.push({ id, username, passwordHash });
  await authDb.write();

  return id;
};

export const validateUser = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  await authDb.read();

  const user = authDb.data.users.find((u) => u.username === username);
  if (user && user.passwordHash === password) {
    return user.id;
  }
  return undefined;
};
