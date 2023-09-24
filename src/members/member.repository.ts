import { Database } from 'bun:sqlite';
import { Member, MemberDto } from './member.model';

const db = new Database('db.sqlite');

const getAllQuery = db.prepare('SELECT * FROM members');
const getMemberByIdQuery = db.prepare('SELECT * FROM members WHERE id = ?');
const insertQuery = db.prepare('INSERT INTO members (id, name, part) VALUES (?, ?, ?)');

export const MemberRepository = {
  /**
   * すべてのメンバーを取得する
   */
  getAll() {
    return getAllQuery.all() as Member[];
  },

  /**
   * タスクを作成する
   */
  create(memberDto: MemberDto) {
    const id = crypto.randomUUID();
    insertQuery.run(id, memberDto.name, memberDto.part[0]);
    const record = getMemberByIdQuery.get(id);

    if (!record) {
      throw new Error('Member not found');
    }

    return record as Member;
  },
};
