import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

export const cleanUpDatabase = () => {
  db.exec(`
    DELETE FROM members;
  `);
  db.exec(`
    DELETE FROM users;
  `);
};

export const createUser = async ({ username = 'test-user', password = 'password' }) => {
  const hashedPassword = await Bun.password.hash(password);
  db.exec(
    `
      INSERT INTO users (id, username, password) VALUES (?, ?, ?);
    `,
    [crypto.randomUUID(), username, hashedPassword]
  );
};
