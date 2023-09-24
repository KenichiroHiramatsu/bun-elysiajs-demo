import { afterAll, beforeAll, describe, it, expect } from 'bun:test';
import { app } from '../../src';
import { cleanUpDatabase } from '../../src/db/test-utils';

describe('auth', () => {
  // テストの前後でデータベースを初期化
  beforeAll(() => {
    cleanUpDatabase();
  });

  // ユーザーの作成 API のテスト
  it('should create a user', async () => {
    // Elysia インスタンスの .handle() メソッドを利用して、API を呼び出す
    // .handle() メソッドは Request オブジェクトを受け取り、Response オブジェクトを返却する
    const response = await app.handle(
      new Request('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Hitori',
          password: 'Goto',
        }),
      })
    );

    const body = await response.json();

    expect(response.status).toEqual(201);
    expect(body).toEqual({
      message: 'User created successfully',
    });
  });

  // 同名のユーザーを作成できないことを確認するテスト
  it('should not create a user with the same username', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Hitori',
          password: 'Goto',
        }),
      })
    );

    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: 'User already exists',
    });
  });

  it('should login a user', async () => {
    const response = await app.handle(
      new Request('http://localhos:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Hitori',
          password: 'Goto',
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      message: 'User logged in successfully',
    });
    // ログインに成功した場合、Cookie に JWT トークンが含まれていることを確認
    expect(response.headers.get('set-cookie')).toMatch(/token=.+;/);
  });

  it('should not login a user with wrong password', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Hitori',
          password: 'tsuchinoko',
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: 'User not found',
    });
  });

  it('should not login a user with wrong username', async () => {
    const response = await app.handle(
      new Request('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Futari',
          password: 'Goto',
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: 'User not found',
    });
  });

  afterAll(() => {
    cleanUpDatabase();
  });
});
