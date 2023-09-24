import { Elysia } from 'elysia';
import { authModel } from './auth.model';
import { setup } from '../setup';

export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
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
