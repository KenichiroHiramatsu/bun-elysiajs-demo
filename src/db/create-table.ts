import { Database } from 'bun:sqlite';

// { create: true } は DB が存在しない場合に作成するオプション
const db = new Database('db.sqlite', { create: true });

// db.exec(`
//   DROP TABLE IF EXISTS members;
// `);
// db.exec(`
//   DROP TABLE IF EXISTS users;
// `);

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    part TEXT NOT NULL,
    user_id TEXT
  )
`);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL
)
`);

db.close();
