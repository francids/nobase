import { getDbConnection } from './database/connection';
import { eq } from 'drizzle-orm';
import { users } from './database/schemas';

export const registerUser = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  const db = await getDbConnection();

  const existingUser = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.username, username));

  if (existingUser.length > 0) {
    return undefined;
  }

  const id = Bun.randomUUIDv7();
  const passwordHash = await Bun.password.hash(password);

  await db.insert(users).values({
    id,
    username,
    passwordHash,
  });

  return id;
};

export const validateUser = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  const db = await getDbConnection();

  const user = await db
    .select({
      id: users.id,
      password_hash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
    .then((result) => result[0]);

  if (user && (await Bun.password.verify(password, user.password_hash))) {
    return user.id;
  }
  return undefined;
};
