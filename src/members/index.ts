import { Elysia } from 'elysia';
import { memberModel } from './member.model';
import { setup } from '../setup';
import { isAuthenticated } from '../auth/isAuthenticated';

export const memberRoute = new Elysia()
  .use(memberModel)
  .use(setup)
  .use(isAuthenticated)
  .guard({
    //複数のルートに対して同じ処理を実装
    beforeHandle: [
      ({ user, set }) => {
        if (!user) {
          set.status = 401;
          return {
            message: 'Unauthorized',
          };
        }
      },
    ],
  })
  .get(
    '/members',
    ({ MemberRepository, user }) => {
      const members = MemberRepository.getAll(user!.id);
      return members;
    },
    {
      response: 'member.members',
    }
  )
  .post(
    '/members',
    ({ body, MemberRepository, user }) => {
      const newMember = MemberRepository.create(body, user!.id);
      return newMember;
    },
    {
      body: 'member.memberDto',
      response: 'member.member',
    }
  );
