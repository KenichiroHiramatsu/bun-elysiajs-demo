import { Elysia } from 'elysia';
import { Member, memberModel } from './member.model';
import { setup } from '../setup';

const members: Member[] = [
  { id: 1, name: 'Hitori', part: ['Gt'] },
  { id: 2, name: 'Ryo', part: ['Ba', 'Cho'] },
  { id: 3, name: 'Nijika', part: ['Dr'] },
  { id: 4, name: 'Ikuyo', part: ['Vo', 'Gt'] },
];

export const memberRoute = new Elysia()
  .use(memberModel)
  .use(setup)
  .get(
    '/members',
    ({ MemberRepository }) => {
      const members = MemberRepository.getAll();
      return members;
    },
    {
      response: 'member.members',
    }
  )
  .post(
    '/members',
    ({ body, MemberRepository }) => {
      //   const newMember: Member = {
      //     id: members.length + 1,
      //     name: body.name,
      //     part: body.part,
      //   };

      const newMember = MemberRepository.create(body);

      members.push(newMember);

      return newMember;
    },
    {
      body: 'member.memberDto',
      response: 'member.member',
    }
  );
