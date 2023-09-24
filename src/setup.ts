import { AuthRepository } from './auth/auth.repository';
import Elysia from 'elysia';
import { MemberRepository } from './members/member.repository';

export const setup = new Elysia({ name: 'setup' }).decorate({
  MemberRepository,
  AuthRepository,
});
