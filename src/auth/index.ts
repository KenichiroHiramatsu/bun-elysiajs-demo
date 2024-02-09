import { Elysia, t } from 'elysia';
import { authModel } from './auth.model';
import { setup } from '../setup';
import { cookie } from '@elysiajs/cookie';
import { jwt } from '@elysiajs/jwt';

export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
  .use(cookie())
  .use(
    jwt({
      secret: process.env.ELYSIA_SECRET ?? '',
    })
  )
  .post(
    '/auth/signin',
    async ({ jwt, body, AuthRepository, set, setCookie }) => {
      // ユーザーのログイン処理
      const result = await AuthRepository.login(body);

      // ログインに失敗したら、400 Bad Request を返却
      if (result.success === false) {
        set.status = 400;
        return {
          message: result.message,
        };
      }

      // ログインに成功したら、JWT トークンを発行
      const token = await jwt.sign({
        id: result.user.id,
        username: result.user.username,
      });

      // JWT トークンを Cookie に保存
      setCookie('token', token, {
        httpOnly: true,
        maxAge: 15 * 60, // 15 minutes
        path: '/',
      });

      return {
        message: 'User logged in successfully',
      };
    },
    {
      body: 'auth.userDto',
      response: t.Object({
        message: t.String(),
      }),
    }
  )
  .post(
    '/auth/signup',
    async ({ body, AuthRepository, set }) => {
      const result = await AuthRepository.create(body);

      if (result.success === false) {
        set.status = 400;
        return {
          message: result.message,
        };
      }

      set.status = 201;
      return {
        message: 'User created successfully',
      };
    },
    {
      body: 'auth.userDto',
    }
  );
