import { Elysia } from 'elysia';
import { memberRoute } from './members';
import { authRoute } from './auth';

export const app = new Elysia().use(authRoute).use(memberRoute);

//テスト実施時にサーバーが起動してしまうのを防ぐため、ファイルが直接実行されているかを判定してそうであればサーバー起動
if (import.meta.path === Bun.main) {
  app.listen(3000);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}
