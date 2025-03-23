import { JSONFile } from 'lowdb/node';
import { Low } from 'lowdb';
import fs from 'fs';
import path from 'path';

interface AdminUser {
  username: string;
  password: string;
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
const defaultAdmins: AdminAuthSchema = {
  admins: [{ username: 'admin', password: 'admin123' }],
};

if (!fs.existsSync(ADMIN_AUTH_PATH)) {
  fs.writeFileSync(ADMIN_AUTH_PATH, JSON.stringify(defaultAdmins, null, 2));
}

const adminAuthDb = new Low<AdminAuthSchema>(adapter, defaultAdmins);

export const validateAdminUser = async (
  username: string,
  password: string
): Promise<boolean> => {
  await adminAuthDb.read();

  const admin = adminAuthDb.data.admins.find(
    (admin) => admin.username === username && admin.password === password
  );

  return !!admin;
};

export const changeAdminPassword = async (
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<boolean> => {
  await adminAuthDb.read();

  const adminIndex = adminAuthDb.data.admins.findIndex(
    (admin) => admin.username === username && admin.password === oldPassword
  );

  if (adminIndex === -1) {
    return false;
  }

  adminAuthDb.data.admins[adminIndex].password = newPassword;
  await adminAuthDb.write();

  return true;
};

export const addAdminUser = async (
  username: string,
  password: string,
  currentAdminUsername: string,
  currentAdminPassword: string
): Promise<boolean> => {
  const isAdmin = await validateAdminUser(
    currentAdminUsername,
    currentAdminPassword
  );
  if (!isAdmin) {
    return false;
  }

  await adminAuthDb.read();

  const exists = adminAuthDb.data.admins.some(
    (admin) => admin.username === username
  );
  if (exists) {
    return false;
  }

  adminAuthDb.data.admins.push({ username, password });
  await adminAuthDb.write();

  return true;
};
