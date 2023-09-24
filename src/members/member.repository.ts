import { Database } from 'bun:sqlite';
import { Member, MemberDto, PureMember } from './member.model';

const db = new Database('db.sqlite');

const getAllQuery = db.prepare('SELECT * FROM members WHERE user_id = ?');
const getMemberByIdQuery = db.prepare('SELECT * FROM members WHERE id = ?');
const insertQuery = db.prepare('INSERT INTO members (id, name, part, user_id) VALUES (?, ?, ?, ?)');

export const MemberRepository = {
  /**
   * すべてのメンバーを取得する
   */
  getAll(userId: string) {
    const pureMembers = getAllQuery.all(userId) as PureMember[];
    const members = pureMembers.map((item: PureMember) => {
      return {
        id: item.id,
        name: item.name,
        userId: item.user_id,
        part: item.part.split(','),
      };
    });
    return members as Member[];
  },

  /**
   * タスクを作成する
   */
  create(memberDto: MemberDto, userId: string) {
    const id = crypto.randomUUID();
    insertQuery.run(id, memberDto.name, memberDto.part.join(','), userId);
    const record = getMemberByIdQuery.get(id) as PureMember;

    if (!record) {
      throw new Error('Member not found');
    }

    const newMember = {
      id: record.id,
      name: record.name,
      userId: record.user_id,
      part: record.part.split(','),
    };

    return newMember as Member;
  },
};
