import { Elysia, t } from 'elysia';
import { Static } from '@sinclair/typebox';

const part = t.Array(
  t.Union([t.Literal('Vo'), t.Literal('Gt'), t.Literal('Ba'), t.Literal('Cho'), t.Literal('Dr')])
);

const member = t.Object({
  id: t.Number(),
  name: t.String(),
  part,
});

// Static は型スキーマから TypeScript の型を生成するヘルパー関数
export type Member = Static<typeof member>;

const memberDto = t.Object({
  name: t.String(),
  part,
});

export type MemberDto = Static<typeof memberDto>;

const app = new Elysia();
export const memberModel = app.model({
  'member.member': member,
  'member.members': t.Array(member),
  'member.memberDto': memberDto,
});
