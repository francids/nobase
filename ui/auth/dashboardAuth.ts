import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import fs from 'fs';
import path from 'path';

interface AdminUser {
  username: string;
  passwordHash: string;
}

interface AdminAuthSchema {
  admins: AdminUser[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ADMIN_AUTH_PATH = path.join(DATA_DIR, 'admin_auth.json');
const adapter = new JSONFile<AdminAuthSchema>(ADMIN_AUTH_PATH);
const defaultAdmins: AdminAuthSchema = { admins: [] };

const adminAuthDb = new Low<AdminAuthSchema>(adapter, defaultAdmins);

export const hasAdmins = async (): Promise<boolean> => {
  await adminAuthDb.read();
  return adminAuthDb.data.admins.length > 0;
};

export const createInitialAdmin = async (
  username: string,
  password: string
): Promise<boolean> => {
  await adminAuthDb.read();

  if (adminAuthDb.data.admins.length > 0) {
    return false;
  }

  const passwordHash = await Bun.password.hash(password);
  adminAuthDb.data.admins.push({ username, passwordHash });
  await adminAuthDb.write();
  return true;
};

export const validateAdminUser = async (
  username: string,
  plainPassword: string
): Promise<boolean> => {
  await adminAuthDb.read();

  const admin = adminAuthDb.data.admins.find(
    (admin) => admin.username === username
  );

  if (!admin) return false;

  if (admin.passwordHash && admin.passwordHash.startsWith('$')) {
    return await Bun.password.verify(plainPassword, admin.passwordHash);
  } else {
    const isMatch = admin.passwordHash === plainPassword;

    if (isMatch) {
      admin.passwordHash = await Bun.password.hash(plainPassword);
      await adminAuthDb.write();
    }

    return isMatch;
  }
};
