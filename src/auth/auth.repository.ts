import { Database } from 'bun:sqlite';
import { User, UserDto } from './auth.model';

const db = new Database('db.sqlite');

const getUserByIdQuery = db.prepare('SELECT * FROM users WHERE id = ?');
const getUserByUsernameQuery = db.prepare('SELECT * FROM users WHERE username = ?');
const insertQuery = db.prepare('INSERT INTO users (id, username, password) VALUES (?, ?, ?)');

type Result =
  | {
      success: true;
      user: User;
    }
  | {
      success: false;
      message: string;
    };

export const AuthRepository = {
  /**
   * ユーザーを登録する
   */
  async create(userDto: UserDto): Promise<Result> {
    // 既に同じユーザー名のユーザーが存在する場合にはエラーを返す
    const existingUser = getUserByUsernameQuery.get(userDto.username);
    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    const id = crypto.randomUUID();
    // パスワードをハッシュ化
    const hashedPassword = await Bun.password.hash(userDto.password);
    insertQuery.run(id, userDto.username, hashedPassword);
    const record = getUserByIdQuery.get(id);

    if (!record) {
      return {
        success: false,
        message: 'Unable to create user',
      };
    }

    return {
      success: true,
      user: record as User,
    };
  },

  /**
   * ユーザーログイン
   */
  async login(userDto: UserDto): Promise<Result> {
    // ユーザー名からユーザーを取得
    const record = getUserByUsernameQuery.get(userDto.username) as User | null;

    // 存在しないユーザー名の場合にはエラーを返す
    if (!record) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // パスワードを検証
    const isValid = await Bun.password.verify(userDto.password, record.password);

    // パスワードが一致しない場合にはエラーを返す
    if (!isValid) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      user: record,
    };
  },
};
