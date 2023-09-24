import { beforeAll, describe, it, expect } from 'bun:test';
import { app } from '../../src';
import { cleanUpDatabase, createUser } from '../../src/db/test-utils';

describe('members', () => {
  // ログイン API をコールした際に取得した Cookie を保持する変数
  let cookie: string;

  beforeAll(async () => {
    cleanUpDatabase();
    // あらかじめダミーのユーザーを作成しておく
    await createUser({
      username: 'Ryo',
      password: 'Yamada',
    });
    // ダミーユーザーでログイン API をコールして JWT トークンを取得
    const response = await app.handle(
      new Request('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Ryo',
          password: 'Yamada',
        }),
      })
    );
    // ヘッダーに含まれる Cookie を取得
    cookie = response.headers.get('set-cookie')!;
  });

  // クッキーがヘッダーに含まれていない場合には、
  // 401 Unauthorized が返却されることを確認
  it('should not create a member without a cookie', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Nijika',
          part: ['Dr'],
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  // ボディリクエストのバリデーションのテスト
  it('should create a member', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({
          name: 'Ikuyo',
          part: ['Vo', 'Gt'],
        }),
      })
    );

    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      id: expect.any(String),
      name: 'Ikuyo',
      part: ['Vo', 'Gt'],
      userId: expect.any(String),
    });
  });

  it('should validate member dto', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({
          name: 'Seika',
          part: ['Gt', 'Tencho'],
        }),
      })
    );
    const body = await response.text();

    expect(response.status).toEqual(400);
    expect(body).toEqual(
      'Invalid body, \'part/1\': Expected union value\n\nExpected: {\n  "name": "",\n  "part": []\n}\n\nFound: {\n  "name": "Seika",\n  "part": [\n    "Gt",\n    "Tencho"\n  ]\n}'
    );
  });

  it('should not get members without a cookie', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/members', {
        method: 'GET',
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  it('should get members', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/members', {
        method: 'GET',
        headers: {
          Cookie: cookie,
        },
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual([
      {
        id: expect.any(String),
        name: 'Ikuyo',
        part: ['Vo', 'Gt'],
        userId: expect.any(String),
      },
    ]);
  });
});
